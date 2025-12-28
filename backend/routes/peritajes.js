const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Peritaje = require('../models/Peritaje');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');
const { upload, processAndUploadToR2, processLocalUpload } = require('../middleware/r2Upload');
const { Op } = require('sequelize');

// @route   GET /api/peritajes
// @desc    Obtener todos los peritajes
// @access  Private (Perito o Admin)
router.get('/', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'perito' && usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de perito o admin' });
    }

    // Si es admin, obtener todos los peritajes de los últimos 3 meses
    // Si es perito, solo sus peritajes
    const ahora = new Date();
    const hace3Meses = new Date(ahora);
    hace3Meses.setMonth(ahora.getMonth() - 3);

    let whereClause = {};
    
    if (usuario.rol === 'admin' || usuario.rol === 'superadmin') {
      // Admin: todos los peritajes de los últimos 3 meses
      whereClause = {
        createdAt: {
          [Op.gte]: hace3Meses
        }
      };
    } else {
      // Perito: solo sus peritajes
      whereClause = { peritoId: req.user.id };
    }

    const peritajes = await Peritaje.findAll({
      where: whereClause,
      include: [{
        model: Usuario,
        as: 'perito',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Limpiar peritajes de más de 3 meses (solo si es admin)
    if ((usuario.rol === 'admin' || usuario.rol === 'superadmin')) {
      try {
        const eliminados = await Peritaje.destroy({
          where: {
            createdAt: {
              [Op.lt]: hace3Meses
            }
          }
        });
        if (eliminados > 0) {
          console.log(`[GET /api/peritajes] Eliminados ${eliminados} peritajes de más de 3 meses`);
        }
      } catch (cleanupError) {
        console.error('[GET /api/peritajes] Error limpiando peritajes antiguos:', cleanupError);
        // No fallar la petición si falla la limpieza
      }
    }

    res.json(peritajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener peritajes' });
  }
});

// @route   GET /api/peritajes/:id
// @desc    Obtener un peritaje por ID
// @access  Private (Perito o Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'perito' && usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Si es admin, puede ver cualquier peritaje; si es perito, solo los suyos
    const whereClause = (usuario.rol === 'admin' || usuario.rol === 'superadmin')
      ? { id: req.params.id }
      : { id: req.params.id, peritoId: req.user.id };

    const peritaje = await Peritaje.findOne({
      where: whereClause,
      include: [{
        model: Usuario,
        as: 'perito',
        attributes: ['id', 'nombre', 'email']
      }]
    });

    if (!peritaje) {
      return res.status(404).json({ message: 'Peritaje no encontrado' });
    }

    console.log('[GET /api/peritajes/:id] Peritaje encontrado:', {
      id: peritaje.id,
      imagenes: peritaje.imagenes,
      imagenesPorSeccion: peritaje.imagenesPorSeccion
    });

    res.json(peritaje);
  } catch (error) {
    console.error('[GET /api/peritajes/:id] Error:', error);
    res.status(500).json({ message: 'Error al obtener peritaje' });
  }
});

// @route   POST /api/peritajes
// @desc    Crear un nuevo peritaje
// @access  Private (Perito)
router.post('/', auth, upload.array('imagenes', 20), processAndUploadToR2, processLocalUpload, [
  body('patente').trim().notEmpty().withMessage('La patente es requerida.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'perito' && usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de perito o admin' });
    }

    // Agregar tipo para R2
    req.body.tipo = 'peritajes';

    // Usar las URLs de R2 si están disponibles, sino usar file.path
    let imagenes = [];
    if (req.uploadedUrls && req.uploadedUrls.length > 0) {
      // Si hay URLs subidas a R2, usarlas directamente
      imagenes = req.uploadedUrls.filter(url => url && url.trim() !== '');
      console.log('[POST /api/peritajes] Usando URLs de R2 desde req.uploadedUrls:', imagenes);
    } else if (req.files && req.files.length > 0) {
      // Si no hay URLs en req.uploadedUrls, usar file.path
      imagenes = req.files.map(file => {
        console.log('[POST /api/peritajes] Archivo procesado:', {
          originalname: file.originalname,
          path: file.path,
          fieldname: file.fieldname,
          key: file.key,
          hasPath: !!file.path,
          pathType: typeof file.path,
          pathStartsWithHttp: file.path ? file.path.startsWith('http') : false
        });
        return file.path;
      }).filter(path => path && path.trim() !== '');
      console.log('[POST /api/peritajes] Usando URLs desde req.files:', imagenes);
    }
    
    console.log('[POST /api/peritajes] URLs de imágenes finales a guardar:', imagenes);
    
    // Procesar imágenes por sección
    const imagenesPorSeccion = {
      informacionVehiculo: [],
      sistemaFrenos: [],
      sistemaSuspension: [],
      inspeccionCarroceria: [],
      chasis: [],
      llantas: [],
      motor: [],
      general: []
    };
    
    // Separar imágenes por sección basándose en el nombre del campo
    // Usar req.uploadedUrlsByField si está disponible (mejor para múltiples secciones), sino usar file.path
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const fieldName = file.fieldname;
        // Obtener la URL: primero de req.uploadedUrlsByField si existe, luego de req.uploadedUrls, sino de file.path
        let imageUrl = file.path;
        if (req.uploadedUrlsByField && req.uploadedUrlsByField[fieldName]) {
          // Buscar la URL correspondiente en el array de ese fieldname
          const fieldUrls = req.uploadedUrlsByField[fieldName];
          const fileIndexInField = req.files
            .slice(0, index)
            .filter(f => f.fieldname === fieldName).length;
          imageUrl = fieldUrls[fileIndexInField] || file.path;
        } else if (req.uploadedUrls && req.uploadedUrls[index]) {
          imageUrl = req.uploadedUrls[index];
        }
        
        console.log('[POST /api/peritajes] Procesando imagen por sección:', {
          fieldName,
          index,
          imageUrl,
          fromUploadedUrlsByField: !!(req.uploadedUrlsByField && req.uploadedUrlsByField[fieldName]),
          fromUploadedUrls: !!(req.uploadedUrls && req.uploadedUrls[index])
        });
        
        if (fieldName.startsWith('imagenes_')) {
          const seccion = fieldName.replace('imagenes_', '');
          if (imagenesPorSeccion[seccion]) {
            imagenesPorSeccion[seccion].push(imageUrl);
          }
        } else if (fieldName === 'imagenes') {
          imagenesPorSeccion.general.push(imageUrl);
        }
      });
    }
    
    console.log('[POST /api/peritajes] Imágenes por sección:', imagenesPorSeccion);

    // Parsear campos JSONB si vienen como strings
    const peritajeData = { ...req.body };
    if (typeof peritajeData.carroceria === 'string') {
      try {
        peritajeData.carroceria = JSON.parse(peritajeData.carroceria);
      } catch (e) {
        peritajeData.carroceria = {};
      }
    }
    if (typeof peritajeData.chasis === 'string') {
      try {
        peritajeData.chasis = JSON.parse(peritajeData.chasis);
      } catch (e) {
        peritajeData.chasis = {};
      }
    }
    if (typeof peritajeData.llantas === 'string') {
      try {
        peritajeData.llantas = JSON.parse(peritajeData.llantas);
      } catch (e) {
        peritajeData.llantas = {};
      }
    }
    if (typeof peritajeData.motor === 'string') {
      try {
        peritajeData.motor = JSON.parse(peritajeData.motor);
      } catch (e) {
        peritajeData.motor = {};
      }
    }
    if (typeof peritajeData.carroceriaImagenNumeros === 'string') {
      try {
        peritajeData.carroceriaImagenNumeros = JSON.parse(peritajeData.carroceriaImagenNumeros);
      } catch (e) {
        peritajeData.carroceriaImagenNumeros = [];
      }
    }

    console.log('[POST /api/peritajes] Creando peritaje con datos:', {
      patente: peritajeData.patente,
      imagenes: imagenes,
      imagenesCount: imagenes.length,
      imagenesPorSeccion: imagenesPorSeccion
    });

    const peritaje = await Peritaje.create({
      ...peritajeData,
      peritoId: req.user.id,
      estado: peritajeData.estado || 'PENDIENTE',
      imagenes: imagenes,
      imagenesPorSeccion: imagenesPorSeccion
    });

    console.log('[POST /api/peritajes] Peritaje creado exitosamente con ID:', peritaje.id);
    console.log('[POST /api/peritajes] Peritaje creado - imagenes guardadas:', peritaje.imagenes);
    console.log('[POST /api/peritajes] Peritaje creado - tipo de imagenes:', typeof peritaje.imagenes);
    console.log('[POST /api/peritajes] Peritaje creado - es array?:', Array.isArray(peritaje.imagenes));
    console.log('[POST /api/peritajes] Peritaje creado - imagenesPorSeccion:', peritaje.imagenesPorSeccion);
    
    // Verificar que las imágenes se guardaron correctamente
    if (imagenes.length > 0 && (!peritaje.imagenes || peritaje.imagenes.length === 0)) {
      console.error('[POST /api/peritajes] ⚠️ ADVERTENCIA: Las imágenes no se guardaron correctamente!');
      console.error('[POST /api/peritajes] Imágenes que se intentaron guardar:', imagenes);
      console.error('[POST /api/peritajes] Imágenes guardadas en peritaje:', peritaje.imagenes);
      
      // Intentar actualizar manualmente
      try {
        await peritaje.update({ 
          imagenes: imagenes,
          imagenesPorSeccion: imagenesPorSeccion
        });
        await peritaje.reload();
        console.log('[POST /api/peritajes] ✅ Imágenes actualizadas manualmente:', peritaje.imagenes);
      } catch (updateError) {
        console.error('[POST /api/peritajes] ❌ Error actualizando imágenes manualmente:', updateError);
      }
    }

    // Recargar el peritaje con relaciones para asegurar que los datos estén actualizados
    const peritajeConRelaciones = await Peritaje.findByPk(peritaje.id, {
      include: [{
        model: Usuario,
        as: 'perito',
        attributes: ['id', 'nombre', 'email']
      }]
    });

    console.log('[POST /api/peritajes] Peritaje con relaciones - imagenes:', peritajeConRelaciones.imagenes);
    console.log('[POST /api/peritajes] Peritaje con relaciones - imagenesPorSeccion:', peritajeConRelaciones.imagenesPorSeccion);

    res.status(201).json(peritajeConRelaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear peritaje', error: error.message });
  }
});

// @route   PUT /api/peritajes/:id
// @desc    Actualizar un peritaje
// @access  Private (Perito, Admin, SuperAdmin)
router.put('/:id', auth, upload.array('imagenes', 20), processAndUploadToR2, processLocalUpload, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'perito' && usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Si es admin o superadmin, puede editar cualquier peritaje
    // Si es perito, solo puede editar sus propios peritajes
    const whereClause = (usuario.rol === 'admin' || usuario.rol === 'superadmin')
      ? { id: req.params.id }
      : { id: req.params.id, peritoId: req.user.id };

    const peritaje = await Peritaje.findOne({
      where: whereClause
    });

    if (!peritaje) {
      return res.status(404).json({ message: 'Peritaje no encontrado' });
    }

    // Agregar tipo para R2
    req.body.tipo = 'peritajes';

    // Si hay nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      // Usar las URLs de R2 si están disponibles, sino usar file.path
      let nuevasImagenes = [];
      if (req.uploadedUrls && req.uploadedUrls.length > 0) {
        nuevasImagenes = req.uploadedUrls.filter(url => url && url.trim() !== '');
        console.log('[PUT /api/peritajes] Usando URLs de R2 desde req.uploadedUrls:', nuevasImagenes);
      } else {
        nuevasImagenes = req.files.map(file => {
          console.log('[PUT /api/peritajes] Archivo procesado:', {
            originalname: file.originalname,
            path: file.path,
            fieldname: file.fieldname,
            key: file.key,
            hasPath: !!file.path,
            pathStartsWithHttp: file.path ? file.path.startsWith('http') : false
          });
          return file.path;
        }).filter(path => path && path.trim() !== '');
        console.log('[PUT /api/peritajes] Usando URLs desde req.files:', nuevasImagenes);
      }
      
      peritaje.imagenes = [...(peritaje.imagenes || []), ...nuevasImagenes];
      
      // Procesar imágenes por sección
      const imagenesPorSeccionActual = peritaje.imagenesPorSeccion || {
        informacionVehiculo: [],
        sistemaFrenos: [],
        sistemaSuspension: [],
        inspeccionCarroceria: [],
        chasis: [],
        llantas: [],
        motor: [],
        general: []
      };
      
      req.files.forEach((file, index) => {
        const fieldName = file.fieldname;
        // Obtener la URL: primero de req.uploadedUrlsByField si existe, luego de req.uploadedUrls, sino de file.path
        let imageUrl = file.path;
        if (req.uploadedUrlsByField && req.uploadedUrlsByField[fieldName]) {
          // Buscar la URL correspondiente en el array de ese fieldname
          const fieldUrls = req.uploadedUrlsByField[fieldName];
          const fileIndexInField = req.files
            .slice(0, index)
            .filter(f => f.fieldname === fieldName).length;
          imageUrl = fieldUrls[fileIndexInField] || file.path;
        } else if (req.uploadedUrls && req.uploadedUrls[index]) {
          imageUrl = req.uploadedUrls[index];
        }
        
        console.log('[PUT /api/peritajes] Procesando imagen por sección:', {
          fieldName,
          index,
          imageUrl,
          fromUploadedUrlsByField: !!(req.uploadedUrlsByField && req.uploadedUrlsByField[fieldName]),
          fromUploadedUrls: !!(req.uploadedUrls && req.uploadedUrls[index])
        });
        
        if (fieldName.startsWith('imagenes_')) {
          const seccion = fieldName.replace('imagenes_', '');
          if (imagenesPorSeccionActual[seccion]) {
            imagenesPorSeccionActual[seccion].push(imageUrl);
          }
        } else if (fieldName === 'imagenes') {
          imagenesPorSeccionActual.general.push(imageUrl);
        }
      });
      
      peritaje.imagenesPorSeccion = imagenesPorSeccionActual;
      console.log('[PUT /api/peritajes] Imágenes por sección actualizadas:', imagenesPorSeccionActual);
    }

    // Actualizar otros campos
    Object.keys(req.body).forEach(key => {
      if (key !== 'imagenes' && key !== 'tipo' && req.body[key] !== undefined) {
        // Parsear campos JSONB si vienen como strings
        if ((key === 'carroceria' || key === 'chasis' || key === 'llantas' || key === 'motor' || key === 'carroceriaImagenNumeros') && typeof req.body[key] === 'string') {
          try {
            peritaje[key] = JSON.parse(req.body[key]);
          } catch (e) {
            // Mantener valor actual si falla el parse
          }
        } else {
          peritaje[key] = req.body[key];
        }
      }
    });

    await peritaje.save();
    
    res.json(peritaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar peritaje' });
  }
});

// @route   DELETE /api/peritajes/:id
// @desc    Eliminar un peritaje
// @access  Private (Perito)
router.delete('/:id', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || usuario.rol !== 'perito') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const peritaje = await Peritaje.findOne({
      where: {
        id: req.params.id,
        peritoId: req.user.id
      }
    });

    if (!peritaje) {
      return res.status(404).json({ message: 'Peritaje no encontrado' });
    }

    await peritaje.destroy();
    res.json({ message: 'Peritaje eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar peritaje' });
  }
});

module.exports = router;



