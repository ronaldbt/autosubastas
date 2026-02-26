const { Usuario } = require('./models');
const bcrypt = require('bcryptjs');

async function verificarYCrearUsuarios() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    // Sincronizar las tablas
    await Usuario.sequelize.sync({ force: false });
    console.log('✅ Sincronización completada');
    
    // Verificar usuarios existentes
    const usuarios = await Usuario.findAll();
    console.log(`📊 Total de usuarios en BD: ${usuarios.length}`);
    
    if (usuarios.length > 0) {
      console.log('👥 Usuarios existentes:');
      usuarios.forEach(user => {
        console.log(`- ${user.email} (${user.rol})`);
      });
      
      // Mostrar roles disponibles
      const rolesUnicos = [...new Set(usuarios.map(u => u.rol))];
      console.log(`🎭 Roles en el sistema: ${rolesUnicos.join(', ')}`);
      return;
    }
    
    console.log('🆕 Creando usuarios de prueba...');
    
    // Usuarios de prueba con roles en MAYÚSCULAS
    const usuariosPrueba = [
      {
        nombre: 'Administrator',
        email: 'admin@autoremates.cl',
        password: 'admin123',
        rol: 'ADMIN',
        telefono: '+56912345678'
      },
      {
        nombre: 'Cliente Test',
        email: 'cliente1@test.com',
        password: 'cliente123',
        rol: 'CLIENTE',
        telefono: '+56912345679'
      },
      {
        nombre: 'Automotora Test',
        email: 'automotora1@test.com',
        password: 'auto123',
        rol: 'AUTOMOTORA',
        telefono: '+56912345680'
      },
      {
        nombre: 'Publicista Test',
        email: 'publicista@test.com',
        password: 'pub123',
        rol: 'PUBLICISTA',
        telefono: '+56912345681'
      },
      {
        nombre: 'Perito Test',
        email: 'perito@test.com',
        password: 'perito123',
        rol: 'PERITO',
        telefono: '+56912345682'
      }
    ];
    
    for (const userData of usuariosPrueba) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const usuario = await Usuario.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`✅ Usuario creado: ${usuario.email} (${usuario.rol}) - Password: ${userData.password}`);
    }
    
    console.log('🎉 Todos los usuarios de prueba fueron creados exitosamente');
    
    // Verificar roles disponibles
    const rolesDisponibles = ['CLIENTE', 'AUTOMOTORA', 'PUBLICISTA', 'ADMIN', 'PERITO'];
    console.log(`🎭 Roles disponibles en el sistema: ${rolesDisponibles.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

verificarYCrearUsuarios();