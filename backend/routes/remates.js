const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Remate = require('../models/Remate');
const Auto = require('../models/Auto');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/remates
// @desc    Obtener todos los remates (con filtros)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { autoId, pujadorId } = req.query;
    const where = {};
    
    if (autoId) where.autoId = parseInt(autoId);
    if (pujadorId) where.pujadorId = parseInt(pujadorId);

    const remates = await Remate.findAll({
      where,
      include: [
        {
          model: Auto,
          as: 'auto',
          attributes: ['id', 'marca', 'modelo', 'anio', 'precioActual']
        },
        {
          model: Usuario,
          as: 'pujador',
          attributes: ['id', 'nombre', 'email']
        }
      ],
      order: [['fechaPuja', 'DESC']]
    });

    res.json(remates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener remates' });
  }
});

// @route   GET /api/remates/:id
// @desc    Obtener un remate por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const remate = await Remate.findByPk(req.params.id, {
      include: [
        {
          model: Auto,
          as: 'auto'
        },
        {
          model: Usuario,
          as: 'pujador',
          attributes: ['id', 'nombre', 'email']
        }
      ]
    });

    if (!remate) {
      return res.status(404).json({ message: 'Remate no encontrado' });
    }

    res.json(remate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener remate' });
  }
});

// @route   POST /api/remates
// @desc    Crear una nueva puja
// @access  Private
router.post('/', auth, [
  body('autoId').notEmpty().withMessage('El ID del auto es requerido'),
  body('monto').isNumeric().withMessage('El monto es requerido y debe ser un número')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { autoId, monto } = req.body;

    // Verificar que el auto existe y está en remate
    const auto = await Auto.findByPk(autoId);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    if (auto.estado !== 'en_remate') {
      return res.status(400).json({ message: 'El auto no está en remate' });
    }

    // Verificar que el monto sea mayor al precio actual
    const montoFloat = parseFloat(monto);
    if (montoFloat <= parseFloat(auto.precioActual)) {
      return res.status(400).json({ 
        message: `El monto debe ser mayor al precio actual ($${auto.precioActual})` 
      });
    }

    // Crear la puja
    const remate = await Remate.create({
      autoId: parseInt(autoId),
      pujadorId: req.user.id,
      monto: montoFloat
    });

    // Actualizar precio actual del auto
    auto.precioActual = montoFloat;
    await auto.save();

    // Marcar pujas anteriores como perdedoras
    await Remate.update(
      { estado: 'perdedora' },
      {
        where: {
          autoId: parseInt(autoId),
          id: { [Op.ne]: remate.id },
          estado: 'activa'
        }
      }
    );

    const rematePopulado = await Remate.findByPk(remate.id, {
      include: [
        {
          model: Auto,
          as: 'auto',
          attributes: ['id', 'marca', 'modelo', 'anio', 'precioActual']
        },
        {
          model: Usuario,
          as: 'pujador',
          attributes: ['id', 'nombre', 'email']
        }
      ]
    });

    res.status(201).json(rematePopulado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear puja' });
  }
});

// @route   PUT /api/remates/:id/iniciar
// @desc    Iniciar remate de un auto
// @access  Private (Admin)
router.put('/:id/iniciar', auth, [
  body('fechaFinRemate').isISO8601().withMessage('La fecha de fin es requerida y debe ser válida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar si es admin
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    auto.estado = 'en_remate';
    auto.fechaInicioRemate = new Date();
    auto.fechaFinRemate = new Date(req.body.fechaFinRemate);

    await auto.save();
    res.json(auto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar remate' });
  }
});

// @route   PUT /api/remates/:id/finalizar
// @desc    Finalizar remate de un auto
// @access  Private (Admin)
router.put('/:id/finalizar', auth, async (req, res) => {
  try {
    // Verificar si es admin
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }

    // Obtener la puja ganadora
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

    const pujaGanadoraPopulada = pujaGanadora ? await Remate.findByPk(pujaGanadora.id, {
      include: [{
        model: Usuario,
        as: 'pujador',
        attributes: ['id', 'nombre', 'email']
      }]
    }) : null;

    res.json({
      auto,
      pujaGanadora: pujaGanadoraPopulada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al finalizar remate' });
  }
});

module.exports = router;
