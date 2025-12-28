// Script para crear un auto de prueba
require('dotenv').config();
const { connectDB } = require('../config/database');
const { Auto, Usuario } = require('../models');

async function createTestAuto() {
  try {
    await connectDB();
    
    // Buscar un usuario admin o vendedor
    const usuario = await Usuario.findOne({
      where: {
        rol: ['admin', 'vendedor', 'superadmin']
      }
    });

    if (!usuario) {
      console.error('❌ No se encontró ningún usuario admin o vendedor');
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado: ${usuario.email} (${usuario.rol})`);

    // Crear auto de prueba
    const auto = await Auto.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      kilometraje: 45000,
      color: 'Blanco',
      precioBase: 8500000,
      precioActual: 8500000,
      descripcion: 'Auto de prueba en excelente estado',
      imagenes: [],
      estado: 'pendiente',
      creadoPor: usuario.id
    });

    console.log('✅ Auto de prueba creado:', {
      id: auto.id,
      marca: auto.marca,
      modelo: auto.modelo,
      anio: auto.anio,
      estado: auto.estado
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando auto de prueba:', error);
    process.exit(1);
  }
}

createTestAuto();



