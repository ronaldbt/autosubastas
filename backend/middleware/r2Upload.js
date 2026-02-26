const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { S3Client, PutObjectCommand, DeleteObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;
const fsSync = require('fs');

// Configurar cliente S3 para Cloudflare R2
// Soporta tanto R2_* como NUXT_PUBLIC_R2_* (para compatibilidad)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || process.env.NUXT_PUBLIC_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.NUXT_PUBLIC_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.NUXT_PUBLIC_R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.NUXT_PUBLIC_R2_BUCKET || 'subastas';
const R2_ENDPOINT = process.env.R2_ENDPOINT || process.env.NUXT_PUBLIC_R2_ENDPOINT;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://pub-${R2_ACCOUNT_ID}.r2.dev`;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Configuración de almacenamiento temporal (para procesar antes de subir)
const tempDir = path.join(process.cwd(), 'uploads', 'temp');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fsSync.mkdirSync(tempDir, { recursive: true });
      cb(null, tempDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Resolver path temporal de forma absoluta para lectura posterior
const getTempPath = (filePath) => {
  if (path.isAbsolute(filePath)) return filePath;
  return path.join(process.cwd(), filePath);
};

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10485760 // 10MB por defecto
  },
  fileFilter: fileFilter
});

// Función para subir archivo a R2
const uploadToR2 = async (filePath, key, contentType = 'image/webp') => {
  try {
    console.log('[uploadToR2] Iniciando subida:', {
      filePath,
      key,
      contentType,
      bucket: BUCKET_NAME,
      publicUrlBase: R2_PUBLIC_URL
    });
    
    const absolutePath = getTempPath(filePath);
    const fileContent = await fs.readFile(absolutePath);
    console.log('[uploadToR2] Archivo leído, tamaño:', fileContent.length, 'bytes');
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      // Agregar headers CORS para permitir acceso desde el navegador
      Metadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });

    await s3Client.send(command);
    console.log('[uploadToR2] Archivo subido exitosamente a R2');
    
    // Retornar URL pública
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    console.log('[uploadToR2] URL pública generada:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('[uploadToR2] Error subiendo a R2:', error);
    throw error;
  }
};

// Función para eliminar archivo de R2
const deleteFromR2 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error eliminando de R2:', error);
    throw error;
  }
};

// Función para copiar objeto dentro del mismo bucket (reorganizar a carpeta por auto)
const copyInR2 = async (sourceKey, destKey) => {
  try {
    const copySource = encodeURIComponent(`${BUCKET_NAME}/${sourceKey}`);
    const command = new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: copySource,
      Key: destKey,
      ContentType: 'image/webp',
    });
    await s3Client.send(command);
    return `${R2_PUBLIC_URL}/${destKey}`;
  } catch (error) {
    console.error('[copyInR2] Error copiando en R2:', { sourceKey, destKey, error: error.message });
    throw error;
  }
};

/**
 * Reorganiza las imágenes subidas en R2 a una carpeta por auto: autos/{autoId}/1.webp, 2.webp, ...
 * Copia cada key a autos/{autoId}/{index}.webp, elimina el objeto antiguo y retorna las nuevas URLs.
 */
const reorganizeR2KeysForAuto = async (uploadedKeys, autoId) => {
  if (!uploadedKeys || uploadedKeys.length === 0) return [];
  const prefix = `autos/${autoId}`;
  const newUrls = [];
  for (let i = 0; i < uploadedKeys.length; i++) {
    const oldKey = uploadedKeys[i];
    const newKey = `${prefix}/${i + 1}.webp`;
    const newUrl = await copyInR2(oldKey, newKey);
    newUrls.push(newUrl);
    try {
      await deleteFromR2(oldKey);
    } catch (e) {
      console.warn('[reorganizeR2KeysForAuto] No se pudo eliminar key antigua:', oldKey, e.message);
    }
  }
  console.log('[r2Upload] Reorganizado en R2:', prefix, 'URLs:', newUrls.length);
  return newUrls;
};

// Middleware para convertir y subir imágenes a R2
const processAndUploadToR2 = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  // Verificar que R2 está configurado
  if (!BUCKET_NAME || !R2_PUBLIC_URL || !R2_ACCESS_KEY_ID) {
    console.warn('⚠️ R2 no configurado, se usará almacenamiento local como fallback');
    return next();
  }

  try {
    // Asegurar que existe el directorio temp (por si multer usó otra cwd)
    await fs.mkdir(tempDir, { recursive: true });

    const uploadedFiles = [];
    const uploadedFilesByField = {}; // Mapear fieldname -> URLs
    const tipo = req.body.tipo || 'autos'; // 'autos' o 'peritajes'
    
    for (const file of req.files) {
      const tempPath = getTempPath(file.path);
      const originalExt = path.extname(file.originalname).toLowerCase();
      
      let finalPath;
      let webpPath;
      let key;

      // Convertir a WebP si no lo es
      if (originalExt === '.webp') {
        // Si ya es WebP, usar directamente
        finalPath = tempPath;
        webpPath = tempPath;
      } else {
        // Convertir a WebP
        const webpFilename = file.filename.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        webpPath = path.join(tempDir, webpFilename);
        
        await sharp(tempPath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        
        // Eliminar archivo temporal original
        await fs.unlink(tempPath);
        finalPath = webpPath;
      }

      // Generar key único para R2
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1E9);
      const filename = path.basename(finalPath);
      key = `${tipo}/${timestamp}-${random}-${filename}`;

      // Subir a R2
      console.log('[r2Upload] Subiendo archivo a R2:', {
        key,
        contentType: 'image/webp',
        bucket: BUCKET_NAME,
        publicUrl: R2_PUBLIC_URL
      });
      const publicUrl = await uploadToR2(finalPath, key, 'image/webp');
      console.log('[r2Upload] Archivo subido exitosamente. URL pública:', publicUrl);
      
      // Eliminar archivo temporal
      await fs.unlink(finalPath);

      // Actualizar información del archivo
      file.path = publicUrl;
      file.key = key; // Guardar key para poder eliminar después
      uploadedFiles.push(publicUrl);
      
      // Guardar también por fieldname para peritajes
      if (!uploadedFilesByField[file.fieldname]) {
        uploadedFilesByField[file.fieldname] = [];
      }
      uploadedFilesByField[file.fieldname].push(publicUrl);
      
      console.log('[r2Upload] File.path actualizado a:', file.path);
      console.log('[r2Upload] File completo después de actualizar:', {
        originalname: file.originalname,
        fieldname: file.fieldname,
        path: file.path,
        key: file.key,
        mimetype: file.mimetype
      });
    }

    // Guardar keys en req para poder eliminarlos después si es necesario
    req.uploadedKeys = req.files.map(f => f.key);
    
    // Guardar también las URLs en req para verificación
    req.uploadedUrls = uploadedFiles;
    req.uploadedUrlsByField = uploadedFilesByField; // Para peritajes con múltiples secciones
    console.log('[r2Upload] Total URLs subidas a R2:', uploadedFiles.length);
    console.log('[r2Upload] URLs completas:', uploadedFiles);
    console.log('[r2Upload] URLs por fieldname:', uploadedFilesByField);

    next();
  } catch (error) {
    console.error('Error procesando y subiendo imágenes:', error);
    // Si falla, intentar continuar con almacenamiento local
    next();
  }
};

// Middleware para almacenamiento local (fallback si R2 no está configurado)
const processLocalUpload = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  // Si R2 está configurado y las imágenes ya tienen URLs públicas, no procesar localmente
  if (BUCKET_NAME && R2_PUBLIC_URL && R2_ACCESS_KEY_ID) {
    // Verificar si las imágenes ya fueron procesadas por R2 (tienen URLs)
    if (req.files.length > 0 && req.files[0].path && req.files[0].path.startsWith('http')) {
      return next();
    }
  }

  // Si las imágenes ya fueron procesadas (tienen path), no reprocesar
  if (req.files.length > 0 && req.files[0].path && !req.files[0].path.includes('temp')) {
    return next();
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(tempDir, { recursive: true });

    for (const file of req.files) {
      const tempPath = getTempPath(file.path);
      const originalExt = path.extname(file.originalname).toLowerCase();
      
      if (originalExt === '.webp') {
        // Si ya es WebP, mover directamente
        const finalPath = path.join(uploadsDir, file.filename);
        await fs.rename(tempPath, finalPath);
        file.path = finalPath;
      } else {
        // Convertir a WebP
        const webpFilename = file.filename.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        const webpPath = path.join(uploadsDir, webpFilename);

        await sharp(tempPath)
          .webp({ quality: 85 })
          .toFile(webpPath);

        // Eliminar archivo temporal
        await fs.unlink(tempPath);

        file.path = webpPath;
        file.filename = webpFilename;
      }
    }

    next();
  } catch (error) {
    console.error('Error procesando imágenes localmente:', error);
    next();
  }
};

module.exports = {
  upload,
  processAndUploadToR2,
  processLocalUpload,
  uploadToR2,
  deleteFromR2,
  copyInR2,
  reorganizeR2KeysForAuto,
  s3Client,
  BUCKET_NAME,
  tempDir
};

