const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const { Auto, Usuario, Peritaje } = require('../models');
const auth = require('../middleware/auth');
const { upload, processAndUploadToR2, processLocalUpload } = require('../middleware/r2Upload');
const { Op } = require('sequelize');

// @route   GET /api/autos/patente-info
// @desc    Obtener información básica de vehículo/persona por patente (Chile)
// @access  Private (Admin / Vendedor / Superadmin)
//
// NOTA IMPORTANTE:
// Este endpoint está preparado para conectarse a un servicio externo (API de terceros
// o microservicio en Python) que entregue la información por patente. Por motivos
// legales y de disponibilidad, NO se incluye aquí ninguna API real.
//
// Para usarlo en producción:
// - Crea un servicio externo (por ejemplo, en Python/FastAPI) que consulte la API
//   que definas y exponga un endpoint HTTP propio.
// - Configura la URL en la variable de entorno PATENTE_SERVICE_URL, por ejemplo:
//   PATENTE_SERVICE_URL="http://localhost:8000/api/patente"
// - El servicio debe aceptar query param ?patente=XXX y devolver un JSON con, por ejemplo:
//   {
//     "auto": {
//       "marca": "Toyota",
//       "modelo": "Corolla",
//       "anio": 2018,
//       "color": "Blanco"
//     },
//     "propietario": {
//       "nombre": "Juan Pérez",
//       "rut": "11.111.111-1",
//       "direccion": "..."
//     }
//   }
//
// Mientras no esté configurado PATENTE_SERVICE_URL, este endpoint responderá 501.
router.get('/patente-info', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || !['admin', 'vendedor', 'superadmin'].includes(usuario.rol)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const patenteRaw = (req.query.patente || '').toString().trim();
    if (!patenteRaw) {
      return res.status(400).json({ message: 'La patente es requerida' });
    }

    // Normalizar formato de patente (mayúsculas, sin espacios)
    const patente = patenteRaw.toUpperCase().replace(/\s+/g, '');

    const serviceUrl = process.env.PATENTE_SERVICE_URL;
    if (!serviceUrl) {
      return res.status(501).json({
        message: 'Servicio de consulta por patente no configurado',
        detalle: 'Define la variable de entorno PATENTE_SERVICE_URL apuntando a tu microservicio o API externa.'
      });
    }

    // Llamada sencilla usando fetch nativo (Node 18+). Si tu runtime no tiene fetch,
    // instala e importa una librería como node-fetch o usa axios.
    const url = new URL(serviceUrl);
    url.searchParams.set('patente', patente);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('[GET /api/autos/patente-info] Error del servicio externo:', response.status, text);
      return res.status(502).json({
        message: 'Error al consultar el servicio externo de patentes',
        status: response.status
      });
    }

    const data = await response.json();

    return res.json({
      patente,
      auto: data.auto || null,
      propietario: data.propietario || null,
      fuente: data.fuente || 'servicio_externo'
    });
  } catch (error) {
    console.error('[GET /api/autos/patente-info] Error interno:', error);
    return res.status(500).json({ message: 'Error interno al consultar la patente' });
  }
});

// @route   GET /api/autos
// @desc    Obtener todos los autos (con filtros opcionales)
// @access  Public (pero admins pueden ver todos, vendedores solo los suyos)
router.get('/', [
  query('marca').optional().trim(),
  query('estado').optional(),
  query('minPrecio').optional().isNumeric(),
  query('maxPrecio').optional().isNumeric(),
  query('anio').optional().isNumeric()
], async (req, res) => {
  try {
    const { marca, estado, minPrecio, maxPrecio, anio } = req.query;
    
    // Construir filtro
    const where = {};
    if (marca) where.marca = { [Op.iLike]: `%${marca}%` };
    if (estado) where.estado = estado;
    if (anio) where.anio = parseInt(anio);
    if (minPrecio || maxPrecio) {
      where.precioActual = {};
      if (minPrecio) where.precioActual[Op.gte] = parseFloat(minPrecio);
      if (maxPrecio) where.precioActual[Op.lte] = parseFloat(maxPrecio);
    }

    // Si hay token y es vendedor, solo ver sus autos
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);
        if (usuario && usuario.rol === 'vendedor') {
          where.creadoPor = usuario.id;
        }
      } catch (err) {
        // Token inválido, continuar sin filtro
      }
    }

    const autos = await Auto.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email'],
          required: false
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false,
          include: [{
            model: Usuario,
            as: 'perito',
            attributes: ['id', 'nombre', 'email'],
            required: false
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Finalizar automáticamente remates que terminaron
    const Remate = require('../models/Remate');
    const ahora = new Date();
    for (const auto of autos) {
      if (auto.estado === 'en_remate' && auto.fechaFinRemate) {
        const finRemate = new Date(auto.fechaFinRemate);
        if (finRemate <= ahora) {
          try {
            // Obtener la puja ganadora
            const pujaGanadora = await Remate.findOne({
              where: {
                autoId: auto.id,
                estado: 'activa'
              },
              order: [['monto', 'DESC']]
            });

            if (pujaGanadora) {
              pujaGanadora.estado = 'ganadora';
              await pujaGanadora.save();
              
              await Remate.update(
                { estado: 'perdedora' },
                {
                  where: {
                    autoId: auto.id,
                    id: { [Op.ne]: pujaGanadora.id },
                    estado: 'activa'
                  }
                }
              );
            }

            auto.estado = 'vendido';
            await auto.save();
            console.log(`[Auto ${auto.id}] Remate finalizado automáticamente en GET /api/autos`);
          } catch (err) {
            console.error(`Error finalizando remate para auto ${auto.id}:`, err);
          }
        }
      }
    }

    console.log('[GET /api/autos] Total autos encontrados:', autos.length);
    if (autos.length > 0) {
      const primerAuto = autos[0];
      console.log('[GET /api/autos] Primer auto:', {
        id: primerAuto.id,
        marca: primerAuto.marca,
        modelo: primerAuto.modelo,
        imagenes: primerAuto.imagenes,
        imagenesRaw: JSON.stringify(primerAuto.imagenes),
        imagenesType: typeof primerAuto.imagenes,
        imagenesIsArray: Array.isArray(primerAuto.imagenes),
        imagenesLength: primerAuto.imagenes ? primerAuto.imagenes.length : 0,
        primeraImagen: primerAuto.imagenes && primerAuto.imagenes.length > 0 ? primerAuto.imagenes[0] : 'N/A',
        dataValues: primerAuto.dataValues ? {
          imagenes: primerAuto.dataValues.imagenes,
          imagenesType: typeof primerAuto.dataValues.imagenes
        } : 'N/A'
      });
    }

    res.json(autos);
  } catch (error) {
    console.error('Error detallado al obtener autos:', error);
    res.status(500).json({ 
      message: 'Error al obtener autos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/autos/:id
// @desc    Obtener un auto por ID con su peritaje
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const auto = await Auto.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          include: [{
            model: Usuario,
            as: 'perito',
            attributes: ['id', 'nombre', 'email']
          }]
        }
      ]
    });

    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    // Verificar si el remate terminó automáticamente (fechaFinRemate ya pasó)
    if (auto.estado === 'en_remate' && auto.fechaFinRemate) {
      const ahora = new Date();
      const finRemate = new Date(auto.fechaFinRemate);
      
      if (finRemate <= ahora) {
        // El remate terminó, finalizarlo automáticamente
        const Remate = require('../models/Remate');
        const { Op } = require('sequelize');
        
        // Obtener la puja ganadora (la más alta)
        const pujaGanadora = await Remate.findOne({
          where: {
            autoId: auto.id,
            estado: 'activa'
          },
          order: [['monto', 'DESC']]
        });

        if (pujaGanadora) {
          // Marcar puja ganadora
          pujaGanadora.estado = 'ganadora';
          await pujaGanadora.save();
          
          // Marcar otras pujas como perdedoras
          await Remate.update(
            { estado: 'perdedora' },
            {
              where: {
                autoId: auto.id,
                id: { [Op.ne]: pujaGanadora.id },
                estado: 'activa'
              }
            }
          );
        }

        // Cambiar estado del auto a vendido
        auto.estado = 'vendido';
        await auto.save();
        
        console.log(`[Auto ${auto.id}] Remate finalizado automáticamente. Ganador: ${pujaGanadora ? pujaGanadora.id : 'Sin pujas'}`);
      }
    }

    // Si el auto está vendido, incluir información del ganador
    if (auto.estado === 'vendido') {
      const Remate = require('../models/Remate');
      const pujaGanadora = await Remate.findOne({
        where: {
          autoId: auto.id,
          estado: 'ganadora'
        },
        include: [
          {
            model: Usuario,
            as: 'pujador',
            attributes: ['id', 'nombre', 'email', 'telefono']
          }
        ]
      });

      if (pujaGanadora) {
        auto.dataValues.pujaGanadora = pujaGanadora;
      }
    }

    res.json(auto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener auto' });
  }
});

// @route   POST /api/autos
// @desc    Crear un nuevo auto (vendedores y admins)
// @access  Private (Vendedor o Admin)
router.post('/', auth, upload.array('imagenes', 70), processAndUploadToR2, processLocalUpload, async (req, res) => {
  try {
    console.log('[POST /api/autos] Datos recibidos:', {
      body: req.body,
      files: req.files ? req.files.length : 0,
      user: req.user
    });

    // Obtener valores del body
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const anio = req.body.anio;
    const kilometraje = req.body.kilometraje;
    const precioBase = req.body.precioBase;
    const color = req.body.color;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;
    const patente = req.body.patente;

    console.log('[POST /api/autos] Valores recibidos:', {
      marca,
      modelo,
      anio,
      kilometraje,
      precioBase,
      color,
      descripcion,
      estado
    });

    // Validaciones manuales (express-validator no funciona bien con FormData multipart)
    const errors = [];
    
    if (!marca || (typeof marca === 'string' && marca.trim() === '')) {
      errors.push({ field: 'marca', message: 'La marca es requerida' });
    }
    
    if (!modelo || (typeof modelo === 'string' && modelo.trim() === '')) {
      errors.push({ field: 'modelo', message: 'El modelo es requerido' });
    }
    
    const anioNum = anio ? parseInt(anio) : NaN;
    if (!anio || isNaN(anioNum) || anioNum < 1900) {
      errors.push({ field: 'anio', message: 'El año es requerido y debe ser válido (mínimo 1900)' });
    }
    
    const kilometrajeNum = kilometraje ? parseInt(kilometraje) : NaN;
    if (!kilometraje || isNaN(kilometrajeNum) || kilometrajeNum < 0) {
      errors.push({ field: 'kilometraje', message: 'El kilometraje es requerido y debe ser un número válido' });
    }
    
    const precioBaseNum = precioBase ? parseFloat(precioBase) : NaN;
    if (!precioBase || isNaN(precioBaseNum) || precioBaseNum <= 0) {
      errors.push({ field: 'precioBase', message: 'El precio base es requerido y debe ser un número válido mayor a 0' });
    }

    // Validación básica de patente (opcional, solo si viene)
    if (patente && typeof patente === 'string') {
      const normalizada = patente.toUpperCase().replace(/\s+/g, '');
      // Formatos chilenos típicos: 6 ó 7 caracteres alfanuméricos
      if (normalizada.length < 4 || normalizada.length > 8) {
        errors.push({ field: 'patente', message: 'La patente no tiene un formato válido' });
      }
    }

    if (errors.length > 0) {
      console.log('[POST /api/autos] Errores de validación:', errors);
      return res.status(400).json({ 
        message: 'Error de validación',
        errors: errors 
      });
    }

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Solo vendedores y admins pueden crear autos
    if (usuario.rol !== 'vendedor' && usuario.rol !== 'admin' && usuario.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo vendedores y administradores pueden crear autos' });
    }

    // Agregar tipo para R2
    req.body.tipo = 'autos';
    
    // Usar las URLs de R2 si están disponibles, sino usar file.path
    let imagenes = [];
    
    if (req.uploadedUrls && req.uploadedUrls.length > 0) {
      // Si hay URLs subidas a R2, usarlas directamente
      imagenes = req.uploadedUrls.filter(url => url && url.trim() !== '');
      console.log('[POST /api/autos] Usando URLs de R2 desde req.uploadedUrls:', imagenes);
    } else if (req.files && req.files.length > 0) {
      // Si no hay URLs en req.uploadedUrls, usar file.path
      imagenes = req.files.map(file => {
        console.log('[POST /api/autos] Archivo procesado:', {
          originalname: file.originalname,
          path: file.path,
          key: file.key,
          hasPath: !!file.path,
          pathType: typeof file.path,
          pathStartsWithHttp: file.path ? file.path.startsWith('http') : false
        });
        return file.path;
      }).filter(path => path && path.trim() !== '');
      console.log('[POST /api/autos] Usando URLs desde req.files:', imagenes);
    }
    
    console.log('[POST /api/autos] URLs de imágenes finales a guardar:', imagenes);
    console.log('[POST /api/autos] Cantidad de imágenes:', imagenes.length);
    console.log('[POST /api/autos] req.files:', req.files ? req.files.length : 0);
    console.log('[POST /api/autos] req.uploadedUrls:', req.uploadedUrls);

    // Si es admin, puede crear directamente aprobado, si es vendedor queda pendiente
    const estadoInicial = (usuario.rol === 'admin' || usuario.rol === 'superadmin') 
      ? (estado || 'aprobado')
      : 'pendiente';

    console.log('[POST /api/autos] Creando auto con datos:', {
      marca: typeof marca === 'string' ? marca.trim() : marca,
      modelo: typeof modelo === 'string' ? modelo.trim() : modelo,
      anio: anioNum,
      kilometraje: kilometrajeNum,
      color: color ? (typeof color === 'string' ? color.trim() : color) : null,
      precioBase: precioBaseNum,
      estado: estadoInicial,
      imagenes: imagenes,
      imagenesCount: imagenes.length
    });

    const auto = await Auto.create({
      patente: patente ? (typeof patente === 'string' ? patente.toUpperCase().replace(/\s+/g, '') : patente) : null,
      marca: typeof marca === 'string' ? marca.trim() : marca,
      modelo: typeof modelo === 'string' ? modelo.trim() : modelo,
      anio: anioNum,
      kilometraje: kilometrajeNum,
      color: color ? (typeof color === 'string' ? color.trim() : color) : null,
      precioBase: precioBaseNum,
      precioActual: precioBaseNum,
      descripcion: descripcion ? (typeof descripcion === 'string' ? descripcion.trim() : descripcion) : null,
      imagenes: imagenes,
      estado: estadoInicial,
      creadoPor: req.user.id,
      peritajeId: req.body.peritajeId || null
    });

    console.log('[POST /api/autos] Auto creado exitosamente con ID:', auto.id);
    console.log('[POST /api/autos] Auto creado - imagenes guardadas:', auto.imagenes);
    console.log('[POST /api/autos] Auto creado - tipo de imagenes:', typeof auto.imagenes);
    console.log('[POST /api/autos] Auto creado - es array?:', Array.isArray(auto.imagenes));
    console.log('[POST /api/autos] Auto creado - imagenes raw (dataValues):', auto.dataValues?.imagenes);
    
    // Verificar que las imágenes se guardaron correctamente
    if (imagenes.length > 0 && (!auto.imagenes || auto.imagenes.length === 0)) {
      console.error('[POST /api/autos] ⚠️ ADVERTENCIA: Las imágenes no se guardaron correctamente!');
      console.error('[POST /api/autos] Imágenes que se intentaron guardar:', imagenes);
      console.error('[POST /api/autos] Imágenes guardadas en auto:', auto.imagenes);
      
      // Intentar actualizar manualmente
      try {
        await auto.update({ imagenes: imagenes });
        await auto.reload();
        console.log('[POST /api/autos] ✅ Imágenes actualizadas manualmente:', auto.imagenes);
      } catch (updateError) {
        console.error('[POST /api/autos] ❌ Error actualizando imágenes manualmente:', updateError);
      }
    }

    const autoConRelaciones = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    console.log('[POST /api/autos] Auto con relaciones - imagenes:', autoConRelaciones.imagenes);
    console.log('[POST /api/autos] Auto con relaciones - tipo de imagenes:', typeof autoConRelaciones.imagenes);
    console.log('[POST /api/autos] Auto con relaciones - es array?:', Array.isArray(autoConRelaciones.imagenes));
    console.log('[POST /api/autos] Auto con relaciones - primera imagen:', autoConRelaciones.imagenes?.[0]);

    res.status(201).json(autoConRelaciones);
  } catch (error) {
    console.error('[POST /api/autos] Error detallado:', error);
    console.error('[POST /api/autos] Stack:', error.stack);
    res.status(500).json({ 
      message: 'Error al crear auto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/autos/:id/estado
// @desc    Actualizar estado de un auto (solo admin)
// @access  Private (Admin)
router.put('/:id/estado', auth, [
  body('estado').notEmpty().withMessage('El estado es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    const nuevoEstado = req.body.estado;
    const estadosValidos = ['pendiente', 'en_revision', 'aprobado', 'rechazado', 'disponible', 'en_remate', 'vendido', 'cancelado'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    auto.estado = nuevoEstado;
    await auto.save();

    const autoActualizado = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    res.json(autoActualizado);
  } catch (error) {
    console.error('Error en PUT /api/autos/:id/estado:', error.message, error.stack);
    res.status(500).json({ message: 'Error al actualizar estado del auto', error: error.message });
  }
});

// @route   PUT /api/autos/:id
// @desc    Actualizar un auto
// @access  Private (Admin o el vendedor que lo creó)
router.put('/:id', auth, upload.array('imagenes', 70), processAndUploadToR2, processLocalUpload, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    const auto = await Auto.findByPk(req.params.id);
    
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    // Solo el creador o un admin puede actualizar
    if (auto.creadoPor !== req.user.id && usuario.rol !== 'admin' && usuario.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Agregar tipo para R2
    req.body.tipo = 'autos';
    
    // Si hay nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = req.files.map(file => file.path);
      auto.imagenes = [...(auto.imagenes || []), ...nuevasImagenes];
    }

    // Actualizar otros campos
    if (req.body.marca) auto.marca = req.body.marca;
    if (req.body.modelo) auto.modelo = req.body.modelo;
    if (req.body.patente !== undefined) {
      auto.patente = typeof req.body.patente === 'string'
        ? req.body.patente.toUpperCase().replace(/\s+/g, '')
        : req.body.patente;
    }
    if (req.body.anio) auto.anio = parseInt(req.body.anio);
    if (req.body.kilometraje) auto.kilometraje = parseInt(req.body.kilometraje);
    if (req.body.color !== undefined) auto.color = req.body.color;
    if (req.body.precioBase) auto.precioBase = parseFloat(req.body.precioBase);
    if (req.body.precioActual) auto.precioActual = parseFloat(req.body.precioActual);
    if (req.body.descripcion !== undefined) auto.descripcion = req.body.descripcion;
    
    // Solo admins pueden cambiar el estado
    if (req.body.estado && (usuario.rol === 'admin' || usuario.rol === 'superadmin')) {
      auto.estado = req.body.estado;
    }
    
    if (req.body.fechaInicioRemate) auto.fechaInicioRemate = new Date(req.body.fechaInicioRemate);
    if (req.body.fechaFinRemate) auto.fechaFinRemate = new Date(req.body.fechaFinRemate);
    if (req.body.peritajeId !== undefined) auto.peritajeId = req.body.peritajeId;

    await auto.save();

    const autoActualizado = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    res.json(autoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar auto' });
  }
});

// @route   PUT /api/autos/:id/aprobar
// @desc    Aprobar un auto (solo admin)
// @access  Private (Admin)
router.put('/:id/aprobar', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (usuario.rol !== 'admin' && usuario.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    auto.estado = 'aprobado';
    await auto.save();

    const autoActualizado = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    res.json(autoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al aprobar auto' });
  }
});

// @route   PUT /api/autos/:id/rechazar
// @desc    Rechazar un auto (solo admin)
// @access  Private (Admin)
router.put('/:id/rechazar', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (usuario.rol !== 'admin' && usuario.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    auto.estado = 'rechazado';
    await auto.save();

    const autoActualizado = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    res.json(autoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al rechazar auto' });
  }
});

// @route   PUT /api/autos/:id/revisar
// @desc    Marcar auto como en revisión (solo admin)
// @access  Private (Admin)
router.put('/:id/revisar', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (usuario.rol !== 'admin' && usuario.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    auto.estado = 'en_revision';
    await auto.save();

    const autoActualizado = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    res.json(autoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al marcar auto en revisión' });
  }
});

// @route   PUT /api/autos/:id/iniciar-remate
// @desc    Iniciar remate de un auto (20 minutos)
// @access  Private (Admin)
router.put('/:id/iniciar-remate', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    // Verificar que el auto esté aprobado o disponible
    if (auto.estado !== 'aprobado' && auto.estado !== 'disponible') {
      return res.status(400).json({ message: 'Solo se pueden enviar a subasta autos aprobados o disponibles' });
    }

    // Calcular fecha de fin (20 minutos desde ahora si no se proporciona)
    const fechaInicio = new Date();
    const fechaFin = req.body.fechaFinRemate 
      ? new Date(req.body.fechaFinRemate)
      : new Date(fechaInicio.getTime() + 20 * 60 * 1000); // 20 minutos

    auto.estado = 'en_remate';
    auto.fechaInicioRemate = fechaInicio;
    auto.fechaFinRemate = fechaFin;
    await auto.save();

    const autoActualizado = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    res.json(autoActualizado);
  } catch (error) {
    console.error('Error en PUT /api/autos/:id/iniciar-remate:', error.message, error.stack);
    res.status(500).json({ message: 'Error al iniciar remate', error: error.message });
  }
});

// @route   PUT /api/autos/:id/finalizar-remate
// @desc    Finalizar remate de un auto
// @access  Private (Admin)
router.put('/:id/finalizar-remate', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    if (auto.estado !== 'en_remate') {
      return res.status(400).json({ message: 'El auto no está en remate' });
    }

    // Obtener la puja ganadora
    const Remate = require('../models/Remate');
    const { Op } = require('sequelize');
    
    const pujaGanadora = await Remate.findOne({
      where: {
        autoId: parseInt(req.params.id),
        estado: 'activa'
      },
      order: [['monto', 'DESC']]
    });

    if (pujaGanadora) {
      pujaGanadora.estado = 'ganadora';
      await pujaGanadora.save();
      
      // Marcar otras pujas como perdedoras
      await Remate.update(
        { estado: 'perdedora' },
        {
          where: {
            autoId: parseInt(req.params.id),
            id: { [Op.ne]: pujaGanadora.id },
            estado: 'activa'
          }
        }
      );
    }

    auto.estado = 'vendido';
    await auto.save();

    // Obtener puja ganadora con información del pujador
    const pujaGanadoraPopulada = pujaGanadora ? await Remate.findByPk(pujaGanadora.id, {
      include: [
        {
          model: Usuario,
          as: 'pujador',
          attributes: ['id', 'nombre', 'email', 'telefono']
        }
      ]
    }) : null;

    const autoActualizado = await Auto.findByPk(auto.id, {
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Peritaje,
          as: 'peritaje',
          required: false
        }
      ]
    });

    // Agregar puja ganadora al auto
    if (pujaGanadoraPopulada) {
      autoActualizado.dataValues.pujaGanadora = pujaGanadoraPopulada;
    }

    res.json({
      auto: autoActualizado,
      pujaGanadora: pujaGanadoraPopulada
    });
  } catch (error) {
    console.error('Error en PUT /api/autos/:id/finalizar-remate:', error.message, error.stack);
    res.status(500).json({ message: 'Error al finalizar remate', error: error.message });
  }
});

// @route   DELETE /api/autos/:id
// @desc    Eliminar un auto
// @access  Private (Admin o el vendedor que lo creó)
router.delete('/:id', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    const auto = await Auto.findByPk(req.params.id);
    
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    // Solo el creador o un admin puede eliminar
    if (auto.creadoPor !== req.user.id && usuario.rol !== 'admin' && usuario.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    await auto.destroy();
    res.json({ message: 'Auto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar auto' });
  }
});

module.exports = router;
