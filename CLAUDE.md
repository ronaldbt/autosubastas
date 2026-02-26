# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is Autoventas360, a car sales platform with a monorepo structure containing:

- **backend/**: Node.js/Express API with Sequelize ORM and PostgreSQL
- **frontend/**: Vue.js 3 + Vite application (legacy frontend, mostly removed)  
- **frontend/**: Nuxt 3 application (primary frontend)

### Backend Architecture

The backend follows a standard MVC pattern:
- **Models**: Located in `backend/models/` - Sequelize models for database entities
- **Controllers**: Located in `backend/controllers/` - Business logic handlers
- **Routes**: Located in `backend/routes/` - API endpoint definitions
- **Middleware**: Authentication (`verificarToken.js`) and authorization (`verificarRol.js`) middleware in `backend/middleware/`
- **Migrations**: Database migrations in `backend/migrations/`
- **Seeders**: Database seeders in `backend/seeders/`
- **Configuration**: Database config in `backend/config/config.js`

Key entities: Usuario, Vehiculo, Marca, Modelo, Automotora, Peritaje, Region, Comuna

### Frontend Architecture (Nuxt 3)

The primary frontend is built with Nuxt 3:
- **Pages**: File-based routing in `frontend/pages/`
- **Components**: Vue components in `frontend/components/`
- **Stores**: Pinia stores in `frontend/stores/`
- **Services**: API service layer in `frontend/services/`
- **Composables**: Reusable composition functions in `frontend/composables/`
- **Middleware**: Route middleware in `frontend/middleware/`
- **Plugins**: Nuxt plugins in `frontend/plugins/`
- **Utils**: Utility functions in `frontend/utils/`
- **Styling**: Tailwind CSS v4 with custom CSS in `frontend/assets/css/`

### User Roles & Authentication

The application supports multiple user roles:
- admin
- cliente (customer)
- automotora (dealership)
- publicista (advertiser)
- perito (appraiser)

Role-based access control is implemented via JWT tokens and middleware.

## Development Commands

### Backend
```bash
cd backend
npm install
# Start development server
npm run dev  # Uses nodemon for auto-reload
# Start production server
npm start   # or node index.js
# Run migrations
npx sequelize-cli db:migrate
# Run seeders
npx sequelize-cli db:seed:all
# Create new migration
npx sequelize-cli migration:generate --name migration-name
# Create new seeder
npx sequelize-cli seed:generate --name seeder-name
```

### Frontend (Nuxt 3)
```bash
cd frontend
npm install
# Development server
npm run dev
# Build for production
npm run build
# Preview production build
npm run preview
# Generate static site
npm run generate
# Run tests
npm run test  # Note: Test framework is Vitest
```

### Testing

Tests are located in `frontend/tests/` and use Vitest framework:
- Store tests: `catalogoStore.test.js`
- Composable tests: `useCatalogo.test.js`  
- Service tests: `logoService.test.js`

Run individual test files by specifying the path after the test command.

## Database

- Uses **PostgreSQL** with Sequelize ORM (not MySQL as initially specified)
- Configuration in `backend/config/config.js`
- Supports development, test, and production environments
- Migrations in `backend/migrations/`
- Seeders in `backend/seeders/`
- Models define relationships between entities

## API Structure

Base API URL: `/api/`

Key endpoints:
- `/api/auth/` - Authentication
- `/api/vehiculos/` - Vehicle management
- `/api/vehiculos-seo/` - SEO-friendly vehicle routes
- `/api/peritajes/` - Vehicle appraisal system
- `/api/dashboard/` - Protected dashboard routes
- `/api/automotoras/` - Dealership management
- Catalog endpoints: `/api/marcas/`, `/api/modelos/`, etc.

## Environment Variables

Both backend and frontend use `.env` files:
- Backend: `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`, JWT secrets
- Frontend: API base URL configuration via `NUXT_PUBLIC_API_BASE` (defaults to http://localhost:3001/api)

## Key Features

- Vehicle listing and search functionality with SEO-friendly URLs
- User authentication and role-based access control
- Dealership management system
- Vehicle appraisal (peritaje) system
- File upload handling for vehicle images with multer
- Catalog management (brands, models, regions, communes)
- Responsive design with Tailwind CSS v4

## Docker Configuration

The project is fully dockerized for both development and production environments:

### Docker Setup

- **Development**: Use `docker-compose.yml` for local development
- **Production**: Use `docker-compose.yml` with Traefik (variables en `.env`)
- **Database**: PostgreSQL container with persistent volumes
- **SSL**: Automatic SSL certificates via Let's Encrypt in production
- **Backup**: Automated database backups with retention policy

### Docker Commands

```bash
# Development setup
./scripts/setup.sh dev
# Or manually: docker compose up -d

# Production setup
./scripts/setup.sh prod
# Or manually: docker compose up -d --build

# Database operations
docker exec -it autoventas-postgres psql -U autoventas_user -d autoventas360
docker exec autoventas-backend npx sequelize-cli db:migrate
docker exec autoventas-backend npx sequelize-cli db:seed:all

# Backup database
./scripts/backup.sh
```

### Docker Services

1. **postgres**: PostgreSQL 15 with persistent data volume
2. **backend**: Node.js API with health checks
3. **frontend**: Nuxt 3 application with multi-stage build
4. **traefik**: Reverse proxy with SSL termination (production only)
5. **backup**: Automated database backup service (production only)

### Environment Configuration

- **Development**: Uses default values from `backend/.env`
- **Production**: Requires `.env` with DB, JWT, and domain variables
- **Database persistence**: Data stored in Docker volumes, prevents data loss
- **SSL certificates**: Stored in persistent Traefik volume

### URLs

**Development:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Traefik Dashboard: http://localhost:8080

**Production:**
- Frontend: https://autoremates.cl
- Backend API: https://api.autoremates.cl
- Traefik Dashboard: https://traefik.autoremates.cl

### Key Docker Files

- `docker-compose.yml` - Development environment
- `docker-compose.yml` - Development and production (Traefik, frontend, backend)
- `backend/Dockerfile` - Backend container definition
- `frontend/Dockerfile` - Frontend container with multi-stage build
- `traefik/traefik.yml` - Traefik static configuration
- `scripts/setup.sh` - Automated setup script
- `scripts/backup.sh` - Database backup script
- `README-DOCKER.md` - Complete Docker documentation

### Database Issues Resolution

If you encounter "role autoventas_user does not exist" errors:

1. **Manual fix (before Docker)**:
```bash
psql -U j -d postgres -c "CREATE USER autoventas_user WITH PASSWORD 'parol123';"
psql -U j -d postgres -c "CREATE DATABASE autoventas360 OWNER autoventas_user;"
psql -U j -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE autoventas360 TO autoventas_user;"
cd backend && npx sequelize-cli db:migrate
```

2. **Docker solution**: Use the Docker setup which prevents this issue by using persistent volumes

### Next Steps

- Install Docker Desktop to use the containerized environment
- Configure environment variables in `.env`
- Set up domain DNS to point to your server for production deployment
- Configure SSL email and Traefik dashboard authentication for production