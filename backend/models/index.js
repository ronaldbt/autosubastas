// Archivo para inicializar todas las relaciones entre modelos
// Esto evita problemas de dependencias circulares

const Usuario = require('./Usuario');
const Auto = require('./Auto');
const Peritaje = require('./Peritaje');
const Remate = require('./Remate');

// Relaciones Usuario-Auto (ya definidas en Auto.js)
// Auto.belongsTo(Usuario, { foreignKey: 'creadoPor', as: 'creador' });
// Usuario.hasMany(Auto, { foreignKey: 'creadoPor', as: 'autos' });

// Relaciones Usuario-Peritaje (ya definidas en Peritaje.js)
// Peritaje.belongsTo(Usuario, { foreignKey: 'peritoId', as: 'perito' });
// Usuario.hasMany(Peritaje, { foreignKey: 'peritoId', as: 'peritajes' });

// Relaciones Auto-Peritaje (definidas aquí para evitar dependencia circular)
// Solo definir si no están ya definidas
if (!Auto.associations.peritaje) {
  Auto.belongsTo(Peritaje, {
    foreignKey: 'peritajeId',
    as: 'peritaje'
  });
}

if (!Peritaje.associations.auto) {
  Peritaje.hasOne(Auto, {
    foreignKey: 'peritajeId',
    as: 'auto'
  });
}

module.exports = {
  Usuario,
  Auto,
  Peritaje,
  Remate
};

