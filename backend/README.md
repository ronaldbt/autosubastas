# Backend - Sistema de Remates de Autos (autoventas2)

Backend desarrollado con Node.js, Express y PostgreSQL para el sistema de remates de autos.

## 🚀 Características

- API RESTful completa
- Autenticación con JWT
- Sistema de pujas en tiempo real
- Subida de imágenes de autos
- Base de datos PostgreSQL con Sequelize
- Dockerizado con Docker Compose
- Validación de datos
- Manejo de errores
- Sistema de roles: superadmin, admin, vendedor, dealer

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- npm o yarn

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. El archivo `.env` ya está configurado con los valores por defecto para PostgreSQL.

3. Iniciar PostgreSQL con Docker:
```bash
docker-compose up -d
```

Esto iniciará PostgreSQL en el puerto 5432 con:
- Contenedor: `subastas_postgres`
- Base de datos: `subastas`
- Usuario: `postgres`
- Contraseña: `postgres`

4. **Ejecutar el seeder para crear usuarios de prueba:**
```bash
npm run seed
```

Esto creará usuarios de prueba con las siguientes credenciales:

**Super Admin:**
- Email: `superadmin@autoventas.com`
- Password: `superadmin123`

**Admin:**
- Email: `admin@autoventas.com`
- Password: `admin123`

**Vendedor:**
- Email: `vendedor@test.com`
- Password: `vendedor123`

**Dealer:**
- Email: `dealer@test.com`
- Password: `dealer123`

5. Iniciar el servidor:
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 🐳 Docker

### Iniciar PostgreSQL
```bash
docker-compose up -d
```

### Detener PostgreSQL
```bash
docker-compose down
```

### Ver logs de PostgreSQL
```bash
docker-compose logs -f postgres
```

### Eliminar volúmenes (⚠️ Esto borrará todos los datos)
```bash
docker-compose down -v
```

## 📁 Estructura del Proyecto

```
backend/
├── config/          # Configuraciones (base de datos, etc.)
├── controllers/     # Controladores (lógica de negocio)
├── middleware/      # Middlewares (auth, upload, etc.)
├── models/          # Modelos de Sequelize
├── routes/          # Rutas de la API
├── seeders/         # Seeders para datos de prueba
├── uploads/         # Archivos subidos (imágenes)
├── docker-compose.yml # Configuración de Docker
├── server.js        # Archivo principal del servidor
└── package.json     # Dependencias del proyecto
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario (solo vendedor o dealer)
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)

### Autos
- `GET /api/autos` - Obtener todos los autos (con filtros)
- `GET /api/autos/:id` - Obtener un auto por ID
- `POST /api/autos` - Crear un nuevo auto (requiere auth admin)
- `PUT /api/autos/:id` - Actualizar un auto (requiere auth admin)
- `DELETE /api/autos/:id` - Eliminar un auto (requiere auth admin)

### Remates
- `GET /api/remates` - Obtener todos los remates
- `GET /api/remates/:id` - Obtener un remate por ID
- `POST /api/remates` - Crear una nueva puja (requiere auth)
- `PUT /api/remates/:id/iniciar` - Iniciar remate (requiere auth admin)
- `PUT /api/remates/:id/finalizar` - Finalizar remate (requiere auth admin)

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios (requiere auth admin)
- `GET /api/usuarios/:id` - Obtener un usuario por ID (requiere auth)
- `PUT /api/usuarios/:id` - Actualizar usuario (requiere auth)

## 🔐 Autenticación

Para acceder a rutas protegidas, incluir el token JWT en el header:
```
Authorization: Bearer <token>
```

## 👥 Roles del Sistema

- **superadmin**: Dueño de la plataforma, acceso completo
- **admin**: Gestores/vendedores, gestionan autos y remates
- **vendedor**: Personas que quieren subastar sus autos
- **dealer**: Compradores que participan en remates

## 📝 Variables de Entorno

El archivo `.env` contiene las siguientes variables:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=subastas
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_secret_key_super_segura_aqui_cambiar_en_produccion
JWT_EXPIRE=7d
UPLOAD_MAX_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 🗄️ Base de Datos

La base de datos PostgreSQL se crea automáticamente al iniciar Docker. Los modelos se sincronizan automáticamente en modo desarrollo.

### Conectarse a la base de datos manualmente

```bash
docker exec -it subastas_postgres psql -U postgres -d subastas
```

## 📝 Notas

- Las imágenes se guardan en la carpeta `uploads/`
- El formato de fecha debe ser ISO 8601
- Los precios se manejan en números decimales
- En producción, cambiar el `JWT_SECRET` y las credenciales de la base de datos
- El seeder solo crea usuarios si la base de datos está vacía
