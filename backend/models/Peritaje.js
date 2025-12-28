const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Usuario = require('./Usuario');

const Peritaje = sequelize.define('Peritaje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Información del Vehículo
  patente: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La patente es requerida'
      }
    }
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  propietario: {
    type: DataTypes.STRING,
    allowNull: true
  },
  propietarioRut: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'RUT del propietario'
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Email inválido'
      }
    }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true
  },
  numeroMotor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroChasis: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroSerial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipoTransporte: {
    type: DataTypes.ENUM('AUTOMOVIL', 'CAMIONETA', 'SUV', 'MOTOCICLETA', 'CAMION', 'BUS'),
    allowNull: true
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Año del vehículo'
  },
  procedencia: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'País de procedencia del vehículo'
  },
  fabricante: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Fabricante del vehículo'
  },
  tipoSello: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Tipo de sello (ej: SELLO VERDE)'
  },
  combustible: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Tipo de combustible (ej: DIESEL, GASOLINA, ELECTRICO)'
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Kilometraje del vehículo'
  },
  // Información de Revisión Técnica
  revisionTecnica_comuna: {
    type: DataTypes.STRING,
    allowNull: true
  },
  revisionTecnica_mes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  revisionTecnica_ultimoControl: {
    type: DataTypes.DATE,
    allowNull: true
  },
  revisionTecnica_estado: {
    type: DataTypes.ENUM('APROBADA', 'RECHAZADA', 'PENDIENTE'),
    allowNull: true
  },
  revisionTecnica_fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Información de Gases
  gases_comuna: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gases_mes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gases_ultimoControl: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gases_estado: {
    type: DataTypes.ENUM('APROBADA', 'RECHAZADA', 'PENDIENTE'),
    allowNull: true
  },
  gases_fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Permiso de Circulación
  permisoCirculacion_info: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Información sobre el permiso de circulación'
  },
  permisoCirculacion_fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // SOAP (Seguro Obligatorio)
  soap_estado: {
    type: DataTypes.ENUM('VIGENTE', 'VENCIDO', 'NO_APLICA'),
    allowNull: true
  },
  soap_compania: {
    type: DataTypes.STRING,
    allowNull: true
  },
  soap_fechaInicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  soap_fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Información de Transporte Público
  transportePublico: {
    type: DataTypes.ENUM('SI', 'NO'),
    allowNull: true
  },
  tipoTransportePublico: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Restricción Vehicular
  restriccionVehicular_condicion: {
    type: DataTypes.ENUM('SI', 'NO'),
    allowNull: true
  },
  restriccionVehicular_comunasPuenteAltoSanBernardo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  restriccionVehicular_provinciaSantiago: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Reportes y Multas
  reporte_robo: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Información sobre reporte de robo'
  },
  reporte_remate: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Información sobre reporte de remate'
  },
  multas: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Información sobre multas del vehículo'
  },
  valorAvaluo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  
  // Sistema de Frenos
  frenos_eficacia_delantera: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frenos_eficacia_trasera: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frenos_diferencia_fuerza_delantera: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frenos_diferencia_fuerza_trasera: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frenos_esfuerzo: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frenos_peso: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frenos_total: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  frenos_estado_general: {
    type: DataTypes.ENUM('BUENO', 'REGULAR', 'MALO'),
    allowNull: true
  },
  
  // Sistema de Suspensión
  suspension_delantera_izquierda: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  suspension_delantera_derecha: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  suspension_trasera_izquierda: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  suspension_trasera_derecha: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  suspension_diferencia_delantera: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  suspension_diferencia_trasera: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  suspension_estado_general: {
    type: DataTypes.ENUM('BUENO', 'REGULAR', 'MALO'),
    allowNull: true
  },
  
  // Carrocería (JSON)
  carroceria: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // Chasis (JSON)
  chasis: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // Llantas (JSON)
  llantas: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // Motor (JSON)
  motor: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // Escaneo de Errores OBD-II
  escanerMotor: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Observaciones y Precio
  observaciones_generales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  imagenes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: true
  },
  
  // Imágenes por sección (JSONB)
  imagenesPorSeccion: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      informacionVehiculo: [],
      sistemaFrenos: [],
      sistemaSuspension: [],
      inspeccionCarroceria: [],
      chasis: [],
      llantas: [],
      motor: [],
      general: []
    }
  },
  
  // Números de carrocería con posiciones en la imagen (JSONB)
  carroceriaImagenNumeros: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  
  // Estado del peritaje
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'EN_PROCESO', 'FINALIZADO'),
    defaultValue: 'PENDIENTE'
  },
  
  // Relación con perito
  peritoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'peritajes',
  timestamps: true
});

// Relaciones
Peritaje.belongsTo(Usuario, {
  foreignKey: 'peritoId',
  as: 'perito'
});

Usuario.hasMany(Peritaje, {
  foreignKey: 'peritoId',
  as: 'peritajes'
});

module.exports = Peritaje;



