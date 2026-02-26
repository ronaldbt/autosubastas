const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Conectar a la base de datos
connectDB();

// Inicializar relaciones entre modelos (después de conectar DB)
require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'https://autoremates.cl',
      'https://www.autoremates.cl',
      'https://api.autoremates.cl'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // En producción, solo permitir orígenes conocidos
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true); // Permitir todos en desarrollo
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Manejar preflight requests
app.options('*', cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints (antes de otras rutas)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Servir archivos estáticos (imágenes de autos)
app.use('/uploads', express.static('uploads'));

// Proxy para imágenes de R2 (evita problemas de CORS)
// Usa el cliente S3 para descargar directamente desde R2
app.get('/api/images/:path(*)', async (req, res) => {
  try {
    const { path } = req.params;
    console.log('[Proxy R2] Path recibido:', path);
    
    const { s3Client } = require('./middleware/r2Upload');
    const { GetObjectCommand } = require('@aws-sdk/client-s3');
    const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.NUXT_PUBLIC_R2_BUCKET;
    
    if (!BUCKET_NAME) {
      console.error('[Proxy R2] BUCKET_NAME no configurado');
      return res.status(500).json({ message: 'R2 no configurado' });
    }
    
    console.log('[Proxy R2] Descargando desde bucket:', BUCKET_NAME, 'key:', path);
    console.log('[Proxy R2] s3Client configurado:', !!s3Client);
    console.log('[Proxy R2] Variables de entorno R2:', {
      BUCKET_NAME: BUCKET_NAME,
      R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID ? 'configurado' : 'no configurado',
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? 'configurado' : 'no configurado',
      R2_ENDPOINT: process.env.R2_ENDPOINT ? 'configurado' : 'no configurado'
    });
    
    try {
      // Usar el cliente S3 para obtener el objeto directamente
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path
      });
      
      console.log('[Proxy R2] Enviando comando GetObjectCommand:', {
        Bucket: BUCKET_NAME,
        Key: path
      });
      
      const response = await s3Client.send(command);
      console.log('[Proxy R2] Objeto obtenido de R2, ContentType:', response.ContentType);
      
      // Convertir el stream a buffer
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      console.log('[Proxy R2] Buffer creado, tamaño:', buffer.length, 'bytes');
      
      // Configurar headers CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Content-Type', response.ContentType || 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 año
      res.setHeader('Content-Length', buffer.length);
      
      res.send(buffer);
      console.log('[Proxy R2] Imagen servida exitosamente, tamaño:', buffer.length, 'bytes');
    } catch (s3Error) {
      console.error('[Proxy R2] Error obteniendo objeto de S3:', s3Error);
      console.error('[Proxy R2] Error details:', {
        name: s3Error.name,
        message: s3Error.message,
        code: s3Error.Code,
        statusCode: s3Error.$metadata?.httpStatusCode
      });
      
      // Si falla con S3, intentar con la URL pública como fallback
      const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.NUXT_PUBLIC_R2_PUBLIC_URL;
      if (R2_PUBLIC_URL) {
        const imageUrl = `${R2_PUBLIC_URL}/${path}`;
        console.log('[Proxy R2] Intentando fallback con URL pública:', imageUrl);
        
        const https = require('https');
        const http = require('http');
        
        return new Promise((resolve) => {
          const parsedUrl = new URL(imageUrl);
          const client = parsedUrl.protocol === 'https:' ? https : http;
          
          const request = client.get(imageUrl, (response) => {
            console.log('[Proxy R2] Fallback response status:', response.statusCode);
            if (response.statusCode !== 200) {
              res.status(response.statusCode).json({ 
                message: 'Imagen no encontrada',
                error: `Status ${response.statusCode}`
              });
              return resolve();
            }
            
            const contentType = response.headers['content-type'] || 'image/webp';
            const chunks = [];
            
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', '*');
              res.setHeader('Content-Type', contentType);
              res.setHeader('Cache-Control', 'public, max-age=31536000');
              
              res.send(Buffer.concat(chunks));
              console.log('[Proxy R2] Imagen servida exitosamente (fallback):', imageUrl);
              resolve();
            });
          });
          
          request.on('error', (error) => {
            console.error('[Proxy R2] Error en fallback request:', error);
            res.status(500).json({ message: 'Error al cargar imagen', error: error.message });
            resolve();
          });
        });
      } else {
        res.status(500).json({ 
          message: 'Error al cargar imagen desde R2',
          error: s3Error.message 
        });
      }
    }
  } catch (error) {
    console.error('[Proxy R2] Error general:', error);
    console.error('[Proxy R2] Stack:', error.stack);
    res.status(500).json({ message: 'Error al cargar imagen', error: error.message });
  }
});

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Remates de Autos',
    version: '1.0.0',
    status: 'running'
  });
});

// Importar rutas
const autosRoutes = require('./routes/autos');
const usuariosRoutes = require('./routes/usuarios');
const rematesRoutes = require('./routes/remates');
const authRoutes = require('./routes/auth');
const peritajesRoutes = require('./routes/peritajes');
const statsRoutes = require('./routes/stats');

// Usar rutas
app.use('/api/autos', autosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/remates', rematesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/peritajes', peritajesRoutes);
app.use('/api/stats', statsRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

