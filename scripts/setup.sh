#!/bin/bash

# Autoventas360 Docker Setup Script

echo "🚀 Setting up Autoventas360 with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backup
mkdir -p traefik
mkdir -p backend/uploads
mkdir -p frontend/.output

# Set permissions
chmod +x scripts/*.sh

# Development setup
if [ "$1" = "dev" ]; then
    echo "🔧 Starting development environment..."
    docker-compose up -d postgres
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
    
    echo "🗃️ Running migrations..."
    cd backend && npx sequelize-cli db:migrate && cd ..
    
    echo "🌱 Running seeders..."
    cd backend && npx sequelize-cli db:seed:all && cd ..
    
    echo "🐳 Starting all services..."
    docker-compose up -d
    
    echo "✅ Development environment ready!"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:3001"
    echo "Traefik Dashboard: http://localhost:8080"

# Production setup
elif [ "$1" = "prod" ]; then
    echo "🏭 Setting up production environment..."
    
    if [ ! -f .env ]; then
        echo "❌ .env file not found. Create .env with your configuration."
        exit 1
    fi
    
    echo "🔐 Loading environment from .env..."
    source .env
    
    echo "🐳 Building and starting services..."
    docker compose up -d --build
    
    echo "⏳ Waiting for services to start..."
    sleep 20
    
    echo "✅ Production environment ready!"
    echo "Application: https://$DOMAIN"
    echo "API: https://api.$DOMAIN"
    echo "Traefik Dashboard: https://traefik.$DOMAIN"

else
    echo "Usage: $0 [dev|prod]"
    echo "  dev  - Start development environment"
    echo "  prod - Start production environment"
    exit 1
fi

echo "🎉 Setup complete!"