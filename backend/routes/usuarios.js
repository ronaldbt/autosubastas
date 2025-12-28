const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Auto = require('../models/Auto');
const Remate = require('../models/Remate');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @route   GET /api/usuarios
// @desc    Obtener todos los usuarios (con filtro opcional por rol)
// @access  Private (Admin/SuperAdmin)
router.get('/', auth, async (req, res) => {
  try {
    // Verificar si es admin o superadmin
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const { rol } = req.query;
    const where = {};
    if (rol) {
      where.rol = rol;
    }

    const usuarios = await Usuario.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// @route   GET /api/usuarios/vendedores/estadisticas
// @desc    Obtener vendedores con estadísticas detalladas
// @access  Private (Admin/SuperAdmin)
router.get('/vendedores/estadisticas', auth, async (req, res) => {
  try {
    // Verificar si es admin o superadmin
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    // Obtener todos los vendedores
    const vendedores = await Usuario.findAll({
      where: { rol: 'vendedor' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    // Obtener estadísticas para cada vendedor
    const vendedoresConStats = await Promise.all(
      vendedores.map(async (vendedor) => {
        // Contar autos publicados por este vendedor
        const autosPublicados = await Auto.count({
          where: { creadoPor: vendedor.id }
        });

        // Contar autos vendidos por este vendedor
        const autosVendidos = await Auto.count({
          where: {
            creadoPor: vendedor.id,
            estado: 'vendido'
          }
        });

        // Calcular ingresos generados (suma de precios de autos vendidos)
        const autosVendidosData = await Auto.findAll({
          where: {
            creadoPor: vendedor.id,
            estado: 'vendido'
          },
          attributes: ['precioActual']
        });

        const ingresosGenerados = autosVendidosData.reduce((sum, auto) => {
          return sum + parseFloat(auto.precioActual || 0);
        }, 0);

        // Calcular calificación promedio (por ahora usamos un valor basado en ventas)
        // En el futuro esto podría venir de un sistema de calificaciones
        let calificacion = 4.0; // Base
        if (autosVendidos > 0) {
          calificacion = Math.min(5.0, 4.0 + (autosVendidos / 10) * 0.5);
        }

        return {
          id: vendedor.id,
          nombre: vendedor.nombre,
          email: vendedor.email,
          telefono: vendedor.telefono || null,
          autosPublicados: autosPublicados,
          ventas: autosVendidos,
          ingresosGenerados: ingresosGenerados,
          calificacion: Math.round(calificacion * 10) / 10, // Redondear a 1 decimal
          activo: vendedor.activo !== false, // Por defecto activo si no está definido
          createdAt: vendedor.createdAt,
          updatedAt: vendedor.updatedAt
        };
      })
    );

    // Calcular estadísticas totales
    const totalVendedores = vendedoresConStats.length;
    const vendedoresActivos = vendedoresConStats.filter(v => v.activo).length;
    const totalAutosPublicados = vendedoresConStats.reduce((sum, v) => sum + v.autosPublicados, 0);
    const totalVentas = vendedoresConStats.reduce((sum, v) => sum + v.ventas, 0);

    res.json({
      vendedores: vendedoresConStats,
      estadisticas: {
        totalVendedores,
        vendedoresActivos,
        totalAutosPublicados,
        totalVentas
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de vendedores:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas de vendedores', error: error.message });
  }
});

// @route   GET /api/usuarios/dealers/estadisticas
// @desc    Obtener dealers con estadísticas detalladas
// @access  Private (Admin/SuperAdmin)
router.get('/dealers/estadisticas', auth, async (req, res) => {
  try {
    // Verificar si es admin o superadmin
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    // Obtener todos los dealers
    const dealers = await Usuario.findAll({
      where: { rol: 'dealer' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    // Obtener estadísticas para cada dealer
    const dealersConStats = await Promise.all(
      dealers.map(async (dealer) => {
        // Contar todas las pujas del dealer
        const totalPujas = await Remate.count({
          where: { pujadorId: dealer.id }
        });

        // Contar compras (pujas ganadoras)
        const compras = await Remate.count({
          where: {
            pujadorId: dealer.id,
            estado: 'ganadora'
          }
        });

        // Calcular gasto total (suma de todas las pujas)
        const todasLasPujas = await Remate.findAll({
          where: { pujadorId: dealer.id },
          attributes: ['monto']
        });

        const gastoTotal = todasLasPujas.reduce((sum, puja) => {
          return sum + parseFloat(puja.monto || 0);
        }, 0);

        return {
          id: dealer.id,
          nombre: dealer.nombre,
          email: dealer.email,
          telefono: dealer.telefono || null,
          totalPujas: totalPujas,
          compras: compras,
          gastoTotal: gastoTotal,
          activo: dealer.activo !== false, // Por defecto activo si no está definido
          createdAt: dealer.createdAt,
          updatedAt: dealer.updatedAt
        };
      })
    );

    // Calcular estadísticas totales
    const totalDealers = dealersConStats.length;
    const dealersActivos = dealersConStats.filter(d => d.activo).length;
    const totalPujas = dealersConStats.reduce((sum, d) => sum + d.totalPujas, 0);
    const totalCompras = dealersConStats.reduce((sum, d) => sum + d.compras, 0);

    res.json({
      dealers: dealersConStats,
      estadisticas: {
        totalDealers,
        dealersActivos,
        totalPujas,
        totalCompras
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de dealers:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas de dealers', error: error.message });
  }
});

// @route   GET /api/usuarios/:id
// @desc    Obtener un usuario por ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo el mismo usuario o un admin/superadmin puede ver el perfil
    if (req.user.id !== parseInt(req.params.id)) {
      const currentUser = await Usuario.findByPk(req.user.id);
      if (!currentUser || (currentUser.rol !== 'admin' && currentUser.rol !== 'superadmin')) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// @route   PUT /api/usuarios/:id
// @desc    Actualizar un usuario
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const currentUser = await Usuario.findByPk(req.user.id);
    
    // Solo el mismo usuario o un admin/superadmin puede actualizar
    if (req.user.id !== parseInt(req.params.id)) {
      if (!currentUser || (currentUser.rol !== 'admin' && currentUser.rol !== 'superadmin')) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo superadmin puede cambiar el rol
    if (req.body.rol && currentUser.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Solo superadmin puede cambiar el rol' });
    }

    // Actualizar campos permitidos
    if (req.body.nombre) usuario.nombre = req.body.nombre;
    if (req.body.telefono !== undefined) usuario.telefono = req.body.telefono;
    if (req.body.whatsapp !== undefined) usuario.whatsapp = req.body.whatsapp;
    if (req.body.rut !== undefined) usuario.rut = req.body.rut;
    if (req.body.rol && currentUser.rol === 'superadmin') usuario.rol = req.body.rol;
    if (req.body.activo !== undefined && (currentUser.rol === 'admin' || currentUser.rol === 'superadmin')) {
      usuario.activo = req.body.activo;
    }

    await usuario.save();
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      whatsapp: usuario.whatsapp,
      rut: usuario.rut,
      rol: usuario.rol,
      activo: usuario.activo,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

module.exports = router;
