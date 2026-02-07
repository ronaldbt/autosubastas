/**
 * Sincroniza todas las tablas de la base de datos (autos, remates, peritajes, etc.).
 * Solo crea tablas que no existan; no altera columnas (seguro para producción).
 * Ejecutar una vez después del primer deploy: node scripts/sync-db.js
 * En Docker: docker compose run --rm -v $(pwd)/backend:/app -e DB_HOST=postgres backend node scripts/sync-db.js
 */
try { require('dotenv').config(); } catch (_) { /* env ya inyectado por Docker */ }
const { sequelize } = require('../config/database');

// Cargar todos los modelos para que Sequelize los registre
require('../models');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');
    await sequelize.sync({ alter: false });
    console.log('✅ Tablas sincronizadas (autos, remates, peritajes, usuarios)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
