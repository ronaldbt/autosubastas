const express = require('express');
const router = express.Router();
const Auto = require('../models/Auto');
const Usuario = require('../models/Usuario');
const Remate = require('../models/Remate');
const Peritaje = require('../models/Peritaje');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Respuesta por defecto si falla cualquier consulta (tablas inexistentes, etc.)
function defaultDashboardResponse() {
  return {
    autos: { pendientes: 0, aprobados: 0, enRemate: 0, vendidos: 0, rechazados: 0, total: 0 },
    remates: { activos: 0, totalPujas: 0, pujasHoy: 0, pujasSemana: 0, proximos: [], finalizados: [] },
    usuarios: { totalVendedores: 0, totalDealers: 0, vendedoresActivos: 0, dealersActivos: 0 },
    peritajes: { pendientes: 0, completados: 0, mes: 0 },
    financiero: { ingresosMes: 0, autosVendidosMes: 0 },
    topMarcas: [],
    pujasPorDia: [],
    autosPorEstado: []
  };
}

// @route   GET /api/stats/dashboard
// @desc    Obtener estadísticas del dashboard para admin
// @access  Private (Admin)
router.get('/dashboard', auth, async (req, res) => {
  let usuario;
  try {
    usuario = await Usuario.findByPk(req.user.id);
  } catch (e) {
    console.error('[GET /api/stats/dashboard] Error obteniendo usuario:', e);
    return res.status(500).json({ message: 'Error al verificar usuario' });
  }
  if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de admin' });
  }

  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - 7);
    const inicioDia = new Date(ahora);
    inicioDia.setHours(0, 0, 0, 0);

    let autosPendientes = 0, autosAprobados = 0, autosEnRemate = 0, autosVendidos = 0, autosRechazados = 0;
    try {
      autosPendientes = await Auto.count({ where: { estado: 'pendiente' } });
      autosAprobados = await Auto.count({ where: { estado: 'aprobado' } });
      autosEnRemate = await Auto.count({ where: { estado: 'en_remate' } });
      autosVendidos = await Auto.count({ where: { estado: 'vendido' } });
      autosRechazados = await Auto.count({ where: { estado: 'rechazado' } });
    } catch (err) {
      console.error('[GET /api/stats/dashboard] Error en estadísticas de autos:', err.message);
      return res.json(defaultDashboardResponse());
    }

    // Estadísticas de Remates
    console.log('[GET /api/stats/dashboard] Obteniendo estadísticas de remates...');
    let rematesActivos = 0, totalPujas = 0, pujasHoy = 0, pujasSemana = 0;
    
    try {
      rematesActivos = await Auto.count({
        where: { 
          estado: 'en_remate',
          [Op.and]: [
            { fechaInicioRemate: { [Op.lte]: ahora } },
            { fechaFinRemate: { [Op.gte]: ahora } }
          ]
        }
      });
      
      totalPujas = await Remate.count().catch(() => 0);
      pujasHoy = await Remate.count({
        where: {
          fechaPuja: { [Op.gte]: inicioDia }
        }
      }).catch(() => 0);
      
      pujasSemana = await Remate.count({
        where: {
          fechaPuja: { [Op.gte]: inicioSemana }
        }
      }).catch(() => 0);
    } catch (err) {
      console.error('[GET /api/stats/dashboard] Error en estadísticas de remates:', err);
      // Continuar con valores por defecto
    }

    // Estadísticas de Usuarios
    const totalVendedores = await Usuario.count({
      where: { rol: 'vendedor' }
    });

    const totalDealers = await Usuario.count({
      where: { rol: 'dealer' }
    });

    const vendedoresActivos = await Usuario.count({
      where: { 
        rol: 'vendedor',
        createdAt: { [Op.lte]: inicioSemana }
      }
    });

    const dealersActivos = await Usuario.count({
      where: { 
        rol: 'dealer',
        createdAt: { [Op.lte]: inicioSemana }
      }
    });

    // Estadísticas de Peritajes
    console.log('[GET /api/stats/dashboard] Obteniendo estadísticas de peritajes...');
    let peritajesPendientes = 0, peritajesCompletados = 0, peritajesMes = 0;
    
    try {
      peritajesPendientes = await Peritaje.count({
        where: { estado: 'PENDIENTE' }
      }).catch(() => 0);
      
      peritajesCompletados = await Peritaje.count({
        where: { estado: 'FINALIZADO' }
      }).catch(() => 0);
      
      peritajesMes = await Peritaje.count({
        where: {
          createdAt: { [Op.gte]: inicioMes }
        }
      }).catch(() => 0);
    } catch (err) {
      console.error('[GET /api/stats/dashboard] Error en estadísticas de peritajes:', err);
      // Continuar con valores por defecto
    }

    // Estadísticas financieras
    console.log('[GET /api/stats/dashboard] Obteniendo estadísticas financieras...');
    let autosVendidosMes = [];
    let ingresosMes = 0;
    
    try {
      autosVendidosMes = await Auto.findAll({
        where: {
          estado: 'vendido',
          updatedAt: { [Op.gte]: inicioMes }
        },
        attributes: ['precioActual', 'updatedAt']
      });
      
      // El ingreso de la empresa es el 5% de comisión sobre el precio de venta
      ingresosMes = autosVendidosMes.reduce((sum, auto) => {
        const precioVenta = parseFloat(auto.precioActual || 0);
        const comision = precioVenta * 0.05; // 5% de comisión
        return sum + comision;
      }, 0);
    } catch (err) {
      console.error('[GET /api/stats/dashboard] Error en estadísticas financieras:', err);
      autosVendidosMes = [];
      ingresosMes = 0;
    }

    // Remates próximos (próximas 24 horas)
    console.log('[GET /api/stats/dashboard] Obteniendo remates próximos...');
    let rematesProximos = [];
    try {
      rematesProximos = await Auto.findAll({
        where: {
          estado: 'aprobado',
          fechaInicioRemate: {
            [Op.and]: [
              { [Op.gte]: ahora },
              { [Op.lte]: new Date(ahora.getTime() + 24 * 60 * 60 * 1000) },
              { [Op.ne]: null }
            ]
          }
        },
        include: [{
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email'],
          required: false
        }],
        order: [['fechaInicioRemate', 'ASC']],
        limit: 5
      });
    } catch (err) {
      console.error('[GET /api/stats/dashboard] Error obteniendo remates próximos:', err);
      rematesProximos = [];
    }

    // Remates recientes finalizados
    console.log('[GET /api/stats/dashboard] Obteniendo remates finalizados...');
    let rematesFinalizados = [];
    try {
      rematesFinalizados = await Auto.findAll({
        where: {
          estado: 'vendido',
          updatedAt: { [Op.gte]: inicioSemana }
        },
        include: [{
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email'],
          required: false
        }],
        order: [['updatedAt', 'DESC']],
        limit: 5
      });
    } catch (err) {
      console.error('[GET /api/stats/dashboard] Error obteniendo remates finalizados:', err);
      rematesFinalizados = [];
    }

    // Top marcas más vendidas
    const autosVendidosMesData = await Auto.findAll({
      where: {
        estado: 'vendido',
        updatedAt: { [Op.gte]: inicioMes }
      },
      attributes: ['marca', 'precioActual']
    });

    // Agrupar por marca manualmente
    const marcasMap = {};
    autosVendidosMesData.forEach(auto => {
      const marca = auto.marca || 'Sin marca';
      if (!marcasMap[marca]) {
        marcasMap[marca] = { marca, cantidad: 0, total: 0 };
      }
      marcasMap[marca].cantidad++;
      marcasMap[marca].total += parseFloat(auto.precioActual || 0);
    });

    const topMarcas = Object.values(marcasMap)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // Estadísticas de pujas por día (últimos 7 días)
    const pujasData = await Remate.findAll({
      where: {
        fechaPuja: { [Op.gte]: inicioSemana }
      },
      attributes: ['fechaPuja']
    });

    // Agrupar por día manualmente
    const pujasPorDiaMap = {};
    pujasData.forEach(puja => {
      const fecha = new Date(puja.fechaPuja).toISOString().split('T')[0];
      if (!pujasPorDiaMap[fecha]) {
        pujasPorDiaMap[fecha] = { fecha, cantidad: 0 };
      }
      pujasPorDiaMap[fecha].cantidad++;
    });

    const pujasPorDia = Object.values(pujasPorDiaMap)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Autos por estado (para gráfico)
    const autosData = await Auto.findAll({
      attributes: ['estado']
    });

    // Agrupar por estado manualmente
    const estadosMap = {};
    autosData.forEach(auto => {
      const estado = auto.estado || 'sin_estado';
      if (!estadosMap[estado]) {
        estadosMap[estado] = { estado, cantidad: 0 };
      }
      estadosMap[estado].cantidad++;
    });

    const autosPorEstado = Object.values(estadosMap);

    console.log('[GET /api/stats/dashboard] Preparando respuesta...');
    const response = {
      autos: {
        pendientes: autosPendientes,
        aprobados: autosAprobados,
        enRemate: autosEnRemate,
        vendidos: autosVendidos,
        rechazados: autosRechazados,
        total: autosPendientes + autosAprobados + autosEnRemate + autosVendidos + autosRechazados
      },
      remates: {
        activos: rematesActivos,
        totalPujas: totalPujas,
        pujasHoy: pujasHoy,
        pujasSemana: pujasSemana,
        proximos: rematesProximos.map(auto => ({
          id: auto.id,
          marca: auto.marca,
          modelo: auto.modelo,
          anio: auto.anio,
          fechaInicio: auto.fechaInicioRemate,
          precioBase: auto.precioBase,
          creador: auto.creador
        })),
        finalizados: rematesFinalizados.map(auto => ({
          id: auto.id,
          marca: auto.marca,
          modelo: auto.modelo,
          anio: auto.anio,
          precioVenta: auto.precioActual,
          fechaVenta: auto.updatedAt,
          creador: auto.creador
        }))
      },
      usuarios: {
        totalVendedores: totalVendedores,
        totalDealers: totalDealers,
        vendedoresActivos: vendedoresActivos,
        dealersActivos: dealersActivos
      },
      peritajes: {
        pendientes: peritajesPendientes,
        completados: peritajesCompletados,
        mes: peritajesMes
      },
      financiero: {
        ingresosMes: ingresosMes,
        autosVendidosMes: autosVendidosMes.length
      },
      topMarcas: topMarcas,
      pujasPorDia: pujasPorDia,
      autosPorEstado: autosPorEstado
    };
    
    res.json(response);
  } catch (error) {
    console.error('[GET /api/stats/dashboard] Error:', error.message, error.stack);
    res.json(defaultDashboardResponse());
  }
});

// @route   GET /api/stats/dealer
// @desc    Obtener estadísticas del dashboard para dealer
// @access  Private (Dealer)
router.get('/dealer', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || usuario.rol !== 'dealer') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de dealer' });
    }

    const dealerId = req.user.id;
    const ahora = new Date();

    // Obtener todas las pujas del dealer con sus autos
    const todasLasPujas = await Remate.findAll({
      where: {
        pujadorId: dealerId
      },
      include: [{
        model: Auto,
        as: 'auto',
        required: true
      }]
    });

    // Filtrar pujas activas (estado 'activa' y auto en remate y fechaFinRemate > ahora)
    const pujasActivasFiltradas = todasLasPujas.filter(puja => {
      if (puja.estado !== 'activa') return false;
      if (puja.auto.estado !== 'en_remate') return false;
      if (!puja.auto.fechaFinRemate) return false;
      const finRemate = new Date(puja.auto.fechaFinRemate);
      return finRemate > ahora;
    });

    // Autos ganados (pujas con estado 'ganadora')
    const autosGanados = todasLasPujas.filter(puja => puja.estado === 'ganadora');

    // Total invertido (suma de todas las pujas)
    const totalInvertido = todasLasPujas.reduce((sum, puja) => {
      return sum + parseFloat(puja.monto || 0);
    }, 0);

    // Pujas donde el dealer está liderando
    let pujasLiderando = 0;
    const autosIdsConPujas = [...new Set(pujasActivasFiltradas.map(p => p.auto.id))];
    
    for (const autoId of autosIdsConPujas) {
      const pujaMasAlta = await Remate.findOne({
        where: {
          autoId: autoId,
          estado: 'activa'
        },
        order: [['monto', 'DESC']]
      });

      if (pujaMasAlta && pujaMasAlta.pujadorId === dealerId) {
        pujasLiderando++;
      }
    }

    // Pujas activas recientes (últimas 5)
    const pujasActivasRecientes = pujasActivasFiltradas
      .sort((a, b) => new Date(b.fechaPuja) - new Date(a.fechaPuja))
      .slice(0, 5)
      .map(puja => ({
        id: puja.id,
        auto: {
          id: puja.auto.id,
          marca: puja.auto.marca || 'Sin marca',
          modelo: puja.auto.modelo || 'Sin modelo',
          anio: puja.auto.anio || 'N/A'
        },
        monto: parseFloat(puja.monto || 0),
        fechaPuja: puja.fechaPuja,
        fechaFinRemate: puja.auto.fechaFinRemate
      }));

    // Autos ganados recientes (últimos 5)
    const autosGanadosRecientes = autosGanados
      .sort((a, b) => new Date(b.fechaPuja) - new Date(a.fechaPuja))
      .slice(0, 5)
      .map(puja => {
        // Normalizar imágenes
        let imagenes = [];
        if (puja.auto.imagenes) {
          if (Array.isArray(puja.auto.imagenes)) {
            imagenes = puja.auto.imagenes;
          } else if (typeof puja.auto.imagenes === 'string') {
            try {
              imagenes = JSON.parse(puja.auto.imagenes);
            } catch (e) {
              imagenes = [puja.auto.imagenes];
            }
          }
        }
        
        console.log(`[GET /api/stats/dealer] Auto ${puja.auto.id} - Imágenes:`, {
          imagenesRaw: puja.auto.imagenes,
          imagenesType: typeof puja.auto.imagenes,
          imagenesIsArray: Array.isArray(puja.auto.imagenes),
          imagenesNormalizadas: imagenes,
          primeraImagen: imagenes.length > 0 ? imagenes[0] : null
        });
        
        return {
          id: puja.id,
          auto: {
            id: puja.auto.id,
            marca: puja.auto.marca || 'Sin marca',
            modelo: puja.auto.modelo || 'Sin modelo',
            anio: puja.auto.anio || 'N/A',
            imagenes: imagenes
          },
          precioFinal: parseFloat(puja.auto.precioActual || 0),
          fechaGanado: puja.fechaPuja
        };
      });

    res.json({
      pujasActivas: pujasActivasFiltradas.length,
      autosGanados: autosGanados.length,
      totalInvertido: totalInvertido,
      pujasLiderando: pujasLiderando,
      pujasActivasRecientes: pujasActivasRecientes,
      autosGanadosRecientes: autosGanadosRecientes
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas del dealer:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
});

// @route   GET /api/stats/vendedor
// @desc    Obtener estadísticas del dashboard para vendedor
// @access  Private (Vendedor)
router.get('/vendedor', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || usuario.rol !== 'vendedor') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de vendedor' });
    }

    const vendedorId = req.user.id;
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    // Obtener todos los autos del vendedor
    const todosLosAutos = await Auto.findAll({
      where: { creadoPor: vendedorId },
      include: [{
        model: Remate,
        as: 'pujas',
        required: false,
        attributes: ['id', 'monto', 'fechaPuja', 'estado']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Estadísticas básicas
    const totalAutos = todosLosAutos.length;
    const enRemate = todosLosAutos.filter(a => a.estado === 'en_remate').length;
    const vendidos = todosLosAutos.filter(a => a.estado === 'vendido').length;
    const pendientes = todosLosAutos.filter(a => a.estado === 'pendiente' || a.estado === 'en_revision').length;

    // Calcular ingresos (el vendedor recibe el precio completo de venta, sin comisión)
    const autosVendidos = todosLosAutos.filter(a => a.estado === 'vendido');
    const ingresosTotales = autosVendidos.reduce((sum, auto) => {
      const precioVenta = parseFloat(auto.precioActual || 0);
      return sum + precioVenta; // El vendedor recibe el precio completo
    }, 0);

    // Ingresos del mes
    const autosVendidosMes = autosVendidos.filter(a => {
      const fechaVenta = new Date(a.updatedAt);
      return fechaVenta >= inicioMes;
    });
    const ingresosMes = autosVendidosMes.reduce((sum, auto) => {
      const precioVenta = parseFloat(auto.precioActual || 0);
      return sum + precioVenta; // El vendedor recibe el precio completo
    }, 0);

    // Autos recientes (últimos 5)
    const autosRecientes = todosLosAutos.slice(0, 5).map(auto => {
      let imagenes = [];
      if (auto.imagenes) {
        if (Array.isArray(auto.imagenes)) {
          imagenes = auto.imagenes;
        } else if (typeof auto.imagenes === 'string') {
          try {
            imagenes = JSON.parse(auto.imagenes);
          } catch (e) {
            imagenes = [auto.imagenes];
          }
        }
      }
      return {
        id: auto.id,
        marca: auto.marca || 'Sin marca',
        modelo: auto.modelo || 'Sin modelo',
        anio: auto.anio || 'N/A',
        estado: auto.estado,
        precioBase: parseFloat(auto.precioBase || 0),
        precioActual: parseFloat(auto.precioActual || 0),
        imagenes: imagenes,
        createdAt: auto.createdAt
      };
    });

    // Remates activos (últimos 5)
    const rematesActivos = todosLosAutos
      .filter(a => a.estado === 'en_remate' && a.fechaFinRemate && new Date(a.fechaFinRemate) > ahora)
      .slice(0, 5)
      .map(auto => {
        // Obtener pujas para este auto
        const pujas = auto.pujas || [];
        const pujaMasAlta = pujas.length > 0 
          ? pujas.reduce((max, p) => parseFloat(p.monto) > parseFloat(max.monto) ? p : max, pujas[0])
          : null;
        
        return {
          id: auto.id,
          marca: auto.marca || 'Sin marca',
          modelo: auto.modelo || 'Sin modelo',
          anio: auto.anio || 'N/A',
          precioActual: pujaMasAlta ? parseFloat(pujaMasAlta.monto) : parseFloat(auto.precioBase || 0),
          fechaFinRemate: auto.fechaFinRemate,
          totalPujas: pujas.length
        };
      });

    res.json({
      totalAutos,
      enRemate,
      vendidos,
      pendientes,
      ingresosTotales,
      ingresosMes,
      autosRecientes,
      rematesActivos
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas del vendedor:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
});

// @route   GET /api/stats/reportes
// @desc    Obtener estadísticas para la página de reportes (con comparación mes anterior)
// @access  Private (Admin)
router.get('/reportes', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de admin' });
    }

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

    // Ventas totales (este mes)
    const autosVendidosMes = await Auto.findAll({
      where: {
        estado: 'vendido',
        updatedAt: { [Op.gte]: inicioMes }
      },
      attributes: ['precioActual']
    });

    // El ingreso de la empresa es el 5% de comisión sobre el precio de venta
    const ventasTotales = autosVendidosMes.reduce((sum, auto) => {
      const precioVenta = parseFloat(auto.precioActual || 0);
      const comision = precioVenta * 0.05; // 5% de comisión
      return sum + comision;
    }, 0);

    // Ventas mes anterior
    const autosVendidosMesAnterior = await Auto.findAll({
      where: {
        estado: 'vendido',
        updatedAt: { 
          [Op.gte]: inicioMesAnterior,
          [Op.lte]: finMesAnterior
        }
      },
      attributes: ['precioActual']
    });

    const ventasMesAnterior = autosVendidosMesAnterior.reduce((sum, auto) => {
      const precioVenta = parseFloat(auto.precioActual || 0);
      const comision = precioVenta * 0.05; // 5% de comisión
      return sum + comision;
    }, 0);

    const variacionVentas = ventasMesAnterior > 0 
      ? ((ventasTotales - ventasMesAnterior) / ventasMesAnterior) * 100 
      : 0;

    // Autos vendidos
    const autosVendidosCount = autosVendidosMes.length;
    const autosVendidosMesAnteriorCount = autosVendidosMesAnterior.length;
    const variacionAutos = autosVendidosMesAnteriorCount > 0
      ? ((autosVendidosCount - autosVendidosMesAnteriorCount) / autosVendidosMesAnteriorCount) * 100
      : 0;

    // Remates activos
    const rematesActivos = await Auto.count({
      where: { 
        estado: 'en_remate',
        [Op.and]: [
          { fechaInicioRemate: { [Op.lte]: ahora } },
          { fechaFinRemate: { [Op.gte]: ahora } }
        ]
      }
    });

    const rematesActivosMesAnterior = await Auto.count({
      where: { 
        estado: 'en_remate',
        [Op.and]: [
          { fechaInicioRemate: { [Op.lte]: finMesAnterior } },
          { fechaFinRemate: { [Op.gte]: inicioMesAnterior } }
        ]
      }
    });

    const variacionRemates = rematesActivosMesAnterior > 0
      ? ((rematesActivos - rematesActivosMesAnterior) / rematesActivosMesAnterior) * 100
      : 0;

    // Tasa de conversión (autos vendidos / autos en remate)
    const autosEnRemateTotal = await Auto.count({
      where: {
        estado: 'en_remate',
        fechaInicioRemate: { [Op.lte]: ahora }
      }
    });

    const tasaConversion = autosEnRemateTotal > 0
      ? (autosVendidosCount / autosEnRemateTotal) * 100
      : 0;

    const autosEnRemateTotalAnterior = await Auto.count({
      where: {
        estado: 'en_remate',
        fechaInicioRemate: { 
          [Op.gte]: inicioMesAnterior,
          [Op.lte]: finMesAnterior
        }
      }
    });

    const autosVendidosAnterior = await Auto.count({
      where: {
        estado: 'vendido',
        updatedAt: { 
          [Op.gte]: inicioMesAnterior,
          [Op.lte]: finMesAnterior
        }
      }
    });

    const tasaConversionAnterior = autosEnRemateTotalAnterior > 0
      ? (autosVendidosAnterior / autosEnRemateTotalAnterior) * 100
      : 0;

    const variacionTasa = tasaConversionAnterior > 0
      ? ((tasaConversion - tasaConversionAnterior) / tasaConversionAnterior) * 100
      : 0;

    // Resumen de actividad
    const autosAprobadosMes = await Auto.count({
      where: {
        estado: 'aprobado',
        updatedAt: { [Op.gte]: inicioMes }
      }
    });

    const autosAprobadosMesAnterior = await Auto.count({
      where: {
        estado: 'aprobado',
        updatedAt: { 
          [Op.gte]: inicioMesAnterior,
          [Op.lte]: finMesAnterior
        }
      }
    });

    const variacionAprobados = autosAprobadosMesAnterior > 0
      ? ((autosAprobadosMes - autosAprobadosMesAnterior) / autosAprobadosMesAnterior) * 100
      : 0;

    const rematesIniciadosMes = await Auto.count({
      where: {
        estado: 'en_remate',
        fechaInicioRemate: { [Op.gte]: inicioMes }
      }
    });

    const rematesIniciadosMesAnterior = await Auto.count({
      where: {
        estado: 'en_remate',
        fechaInicioRemate: { 
          [Op.gte]: inicioMesAnterior,
          [Op.lte]: finMesAnterior
        }
      }
    });

    const variacionRematesIniciados = rematesIniciadosMesAnterior > 0
      ? ((rematesIniciadosMes - rematesIniciadosMesAnterior) / rematesIniciadosMesAnterior) * 100
      : 0;

    const inspeccionesMes = await Peritaje.count({
      where: {
        createdAt: { [Op.gte]: inicioMes }
      }
    });

    const inspeccionesMesAnterior = await Peritaje.count({
      where: {
        createdAt: { 
          [Op.gte]: inicioMesAnterior,
          [Op.lte]: finMesAnterior
        }
      }
    });

    const variacionInspecciones = inspeccionesMesAnterior > 0
      ? ((inspeccionesMes - inspeccionesMesAnterior) / inspeccionesMesAnterior) * 100
      : 0;

    const ventasCompletadasMes = autosVendidosCount;
    const ventasCompletadasMesAnterior = autosVendidosMesAnteriorCount;
    const variacionVentasCompletadas = ventasCompletadasMesAnterior > 0
      ? ((ventasCompletadasMes - ventasCompletadasMesAnterior) / ventasCompletadasMesAnterior) * 100
      : 0;

    // Formatear ventas totales
    const formatVentas = (monto) => {
      if (monto >= 1000000) {
        return `$${(monto / 1000000).toFixed(1)}M`;
      } else if (monto >= 1000) {
        return `$${(monto / 1000).toFixed(1)}K`;
      }
      return `$${monto.toFixed(0)}`;
    };

    res.json({
      metricas: {
        ventasTotales: {
          valor: formatVentas(ventasTotales),
          variacion: variacionVentas.toFixed(1),
          esPositiva: variacionVentas >= 0
        },
        autosVendidos: {
          valor: autosVendidosCount,
          variacion: variacionAutos.toFixed(1),
          esPositiva: variacionAutos >= 0
        },
        rematesActivos: {
          valor: rematesActivos,
          variacion: variacionRemates.toFixed(1),
          esPositiva: variacionRemates >= 0
        },
        tasaConversion: {
          valor: tasaConversion.toFixed(0),
          variacion: variacionTasa.toFixed(1),
          esPositiva: variacionTasa >= 0
        }
      },
      resumen: [
        {
          categoria: 'Autos Aprobados',
          esteMes: autosAprobadosMes,
          mesAnterior: autosAprobadosMesAnterior,
          variacion: variacionAprobados.toFixed(1)
        },
        {
          categoria: 'Remates Iniciados',
          esteMes: rematesIniciadosMes,
          mesAnterior: rematesIniciadosMesAnterior,
          variacion: variacionRematesIniciados.toFixed(1)
        },
        {
          categoria: 'Inspecciones',
          esteMes: inspeccionesMes,
          mesAnterior: inspeccionesMesAnterior,
          variacion: variacionInspecciones.toFixed(1)
        },
        {
          categoria: 'Ventas Completadas',
          esteMes: ventasCompletadasMes,
          mesAnterior: ventasCompletadasMesAnterior,
          variacion: variacionVentasCompletadas.toFixed(1)
        }
      ]
    });
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    res.status(500).json({ 
      message: 'Error al obtener reportes', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
});

module.exports = router;

