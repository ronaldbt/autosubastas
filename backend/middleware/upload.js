const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

// Configuración de almacenamiento temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5242880 // 5MB por defecto
  },
  fileFilter: fileFilter
});

// Middleware para convertir imágenes a WebP
const convertToWebP = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    // Asegurar que existe el directorio uploads
    await fs.mkdir('uploads', { recursive: true });
    await fs.mkdir('uploads/temp', { recursive: true });

    const convertedFiles = [];
    
    for (const file of req.files) {
      const tempPath = file.path;
      const originalExt = path.extname(file.originalname).toLowerCase();
      
      // Solo convertir si no es ya WebP
      if (originalExt === '.webp') {
        // Si ya es WebP, mover directamente
        const finalPath = path.join('uploads', file.filename);
        await fs.rename(tempPath, finalPath);
        file.path = finalPath;
        convertedFiles.push(finalPath);
      } else {
        // Convertir a WebP
        const webpFilename = file.filename.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        const webpPath = path.join('uploads', webpFilename);

        await sharp(tempPath)
          .webp({ quality: 85 })
          .toFile(webpPath);

        // Eliminar archivo temporal
        await fs.unlink(tempPath);

        // Actualizar información del archivo
        file.path = webpPath;
        file.filename = webpFilename;
        convertedFiles.push(webpPath);
      }
    }

    next();
  } catch (error) {
    console.error('Error convirtiendo imagen a WebP:', error);
    // Si falla la conversión, continuar con los archivos originales
    next();
  }
};

module.exports = { upload, convertToWebP };
