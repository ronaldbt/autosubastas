// Script para migrar la columna 'año' a 'anio' en la tabla 'autos'
require('dotenv').config();
const { sequelize } = require('../config/database');

async function migrateAñoToAnio() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si ambas columnas existen
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'autos' 
      AND column_name IN ('año', 'anio')
      AND table_schema = 'public'
    `);

    const hasAño = columns.some(col => col.column_name === 'año');
    const hasAnio = columns.some(col => col.column_name === 'anio');

    console.log('Estado de columnas:', { hasAño, hasAnio });

    if (hasAnio && hasAño) {
      // Ambas columnas existen: copiar datos y eliminar 'año'
      console.log('📋 Copiando datos de "año" a "anio"...');
      await sequelize.query(`
        UPDATE autos 
        SET anio = "año" 
        WHERE anio IS NULL AND "año" IS NOT NULL
      `);

      console.log('📋 Haciendo que anio sea NOT NULL...');
      await sequelize.query(`
        ALTER TABLE autos ALTER COLUMN anio SET NOT NULL
      `);

      console.log('📋 Eliminando columna "año"...');
      await sequelize.query(`
        ALTER TABLE autos DROP COLUMN "año"
      `);
      console.log('✅ Migración completada: datos copiados y columna "año" eliminada');
    } else if (hasAño && !hasAnio) {
      // Solo existe 'año': renombrarla
      console.log('📋 Renombrando columna "año" a "anio"...');
      await sequelize.query(`
        ALTER TABLE autos RENAME COLUMN "año" TO anio
      `);
      console.log('✅ Migración completada: columna renombrada');
    } else if (!hasAño && hasAnio) {
      console.log('✅ La columna ya está migrada (solo existe "anio")');
    } else {
      console.log('⚠️  No se encontraron las columnas "año" ni "anio"');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

migrateAñoToAnio();






