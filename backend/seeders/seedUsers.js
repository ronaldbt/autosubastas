require('dotenv').config();
const Usuario = require('../models/Usuario');
const { sequelize } = require('../config/database');

const seedUsers = async () => {
  try {
    const usuarios = [
      {
        nombre: 'Super Admin',
        email: 'superadmin@autoventas.com',
        password: 'superadmin123',
        telefono: '+56912345678',
        rol: 'superadmin',
        activo: true
      },
      {
        nombre: 'Admin Manager',
        email: 'admin@autoventas.com',
        password: 'admin123',
        telefono: '+56912345679',
        rol: 'admin',
        activo: true
      },
      {
        nombre: 'Juan Vendedor',
        email: 'vendedor@test.com',
        password: 'vendedor123',
        telefono: '+56912345680',
        rol: 'vendedor',
        activo: true
      },
      {
        nombre: 'María Vendedora',
        email: 'maria@test.com',
        password: 'vendedor123',
        telefono: '+56912345681',
        rol: 'vendedor',
        activo: true
      },
      {
        nombre: 'Carlos Dealer',
        email: 'dealer@test.com',
        password: 'dealer123',
        telefono: '+56912345682',
        rol: 'dealer',
        activo: true
      },
      {
        nombre: 'Ana Dealer',
        email: 'ana@test.com',
        password: 'dealer123',
        telefono: '+56912345683',
        rol: 'dealer',
        activo: true
      },
      {
        nombre: 'Pedro Perito',
        email: 'perito@test.com',
        password: 'perito123',
        telefono: '+56912345684',
        rol: 'perito',
        activo: true
      }
    ];

    for (const usuarioData of usuarios) {
      // Verificar si el usuario ya existe por email
      const usuarioExistente = await Usuario.findOne({ where: { email: usuarioData.email } });
      if (!usuarioExistente) {
        await Usuario.create(usuarioData);
        console.log(`✅ Usuario creado: ${usuarioData.email}`);
      } else {
        console.log(`⚠️  Usuario ya existe: ${usuarioData.email}`);
      }
    }

    console.log('✅ Usuarios de prueba creados exitosamente');
    console.log('\n📋 Credenciales de prueba:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin:');
    console.log('  Email: superadmin@autoventas.com');
    console.log('  Password: superadmin123');
    console.log('\nAdmin:');
    console.log('  Email: admin@autoventas.com');
    console.log('  Password: admin123');
    console.log('\nVendedor:');
    console.log('  Email: vendedor@test.com');
    console.log('  Password: vendedor123');
    console.log('\nDealer:');
    console.log('  Email: dealer@test.com');
    console.log('  Password: dealer123');
    console.log('\nPerito:');
    console.log('  Email: perito@test.com');
    console.log('  Password: perito123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
    throw error;
  }
};

// Ejecutar seeder si se llama directamente
if (require.main === module) {
  sequelize.sync({ alter: false })
    .then(() => seedUsers())
    .then(() => {
      console.log('✅ Seeder completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en seeder:', error);
      process.exit(1);
    });
}

module.exports = seedUsers;


