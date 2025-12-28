const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'autoventas360',
  process.env.DB_USER || 'autoventas_user',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false, // Desactivado para evitar logs excesivos de queries SQL
    dialectOptions: {
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3
    }
  }
);

const connectDB = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL conectado correctamente');
      
      // Sincronizar modelos (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        // Cargar todos los modelos y relaciones
        require('../models');
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados');
      }
      return;
    } catch (error) {
      retries--;
      console.error(`❌ Error conectando a PostgreSQL (intentos restantes: ${retries}):`, error.message);
      
      if (retries === 0) {
        console.error('❌ No se pudo conectar a PostgreSQL después de varios intentos');
        process.exit(1);
      }
      
      // Esperar 2 segundos antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

module.exports = { sequelize, connectDB };
