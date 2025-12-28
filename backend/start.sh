#!/bin/bash

echo "🚀 Iniciando backend de Autoventas2..."
echo ""

# Verificar que Docker esté corriendo
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker primero."
    exit 1
fi

# Verificar que PostgreSQL esté corriendo
if ! docker-compose ps | grep -q "Up"; then
    echo "📦 Iniciando PostgreSQL..."
    docker-compose up -d
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 5
fi

echo "✅ PostgreSQL está corriendo"
echo ""

# Verificar si hay usuarios en la base de datos
echo "📋 Verificando usuarios en la base de datos..."
USERS_COUNT=$(docker-compose exec -T postgres psql -U postgres -d subastas -t -c "SELECT COUNT(*) FROM usuarios;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$USERS_COUNT" = "0" ] || [ -z "$USERS_COUNT" ]; then
    echo "🌱 Ejecutando seeder para crear usuarios de prueba..."
    npm run seed
    echo ""
fi

echo "🚀 Iniciando servidor backend..."
echo "📡 El servidor estará disponible en http://localhost:5000"
echo ""

npm run dev

