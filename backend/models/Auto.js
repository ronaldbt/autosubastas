const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Usuario = require('./Usuario');

const Auto = sequelize.define('Auto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patente: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Patente del vehículo (formato Chile, ej: ABCD12)'
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La marca es requerida'
      }
    }
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El modelo es requerido'
      }
    }
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1900],
        msg: 'El año debe ser válido'
      },
      max: {
        args: [new Date().getFullYear() + 1],
        msg: 'El año no puede ser futuro'
      }
    }
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El kilometraje no puede ser negativo'
      }
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  precioBase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo'
      }
    }
  },
  precioActual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagenes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'en_remate', 'vendido', 'cancelado'),
    defaultValue: 'disponible'
  },
  fechaInicioRemate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaFinRemate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  creadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  peritajeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'peritajes',
      key: 'id'
    }
  }
}, {
  tableName: 'autos',
  timestamps: true,
  hooks: {
    beforeCreate: (auto) => {
      if (!auto.precioActual) {
        auto.precioActual = auto.precioBase;
      }
      // Asegurar que imagenes sea un array
      if (!auto.imagenes || !Array.isArray(auto.imagenes)) {
        auto.imagenes = [];
      }
    },
    afterFind: (results) => {
      // Normalizar arrays de imágenes después de recuperar de la BD
      if (!results) return;
      
      const normalize = (result) => {
        if (!result) return;
        
        // Si es un array de resultados
        if (Array.isArray(result)) {
          result.forEach(normalize);
          return;
        }
        
        // Si es un solo resultado
        if (result.imagenes === null || result.imagenes === undefined) {
          result.imagenes = [];
        } else if (!Array.isArray(result.imagenes)) {
          // Si es un string, intentar parsearlo
          try {
            result.imagenes = JSON.parse(result.imagenes);
          } catch (e) {
            result.imagenes = [result.imagenes];
          }
        }
      };
      
      normalize(results);
    }
  }
});

// Relaciones
Auto.belongsTo(Usuario, {
  foreignKey: 'creadoPor',
  as: 'creador'
});

Usuario.hasMany(Auto, {
  foreignKey: 'creadoPor',
  as: 'autos'
});

module.exports = Auto;
