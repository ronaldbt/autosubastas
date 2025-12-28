const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Auto = require('./Auto');
const Usuario = require('./Usuario');

const Remate = sequelize.define('Remate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  autoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'autos',
      key: 'id'
    }
  },
  pujadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El monto no puede ser negativo'
      }
    }
  },
  fechaPuja: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('activa', 'ganadora', 'perdedora', 'cancelada'),
    defaultValue: 'activa'
  }
}, {
  tableName: 'remates',
  timestamps: true
});

// Relaciones
Remate.belongsTo(Auto, {
  foreignKey: 'autoId',
  as: 'auto'
});

Remate.belongsTo(Usuario, {
  foreignKey: 'pujadorId',
  as: 'pujador'
});

Auto.hasMany(Remate, {
  foreignKey: 'autoId',
  as: 'pujas'
});

Usuario.hasMany(Remate, {
  foreignKey: 'pujadorId',
  as: 'pujas'
});

module.exports = Remate;
