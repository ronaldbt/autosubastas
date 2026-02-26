#!/bin/bash

# Script de deployment para Autoventas360
echo "🚀 Iniciando deployment de Autoventas360..."

# Cargar variables de entorno desde .env
set -a
source .env
set +a

# Detener contenedores existentes si existen
echo "🛑 Deteniendo contenedores existentes..."
docker compose down --remove-orphans

# Limpiar imágenes no utilizadas
echo "🧹 Limpiando imágenes no utilizadas..."
docker system prune -f

# Construir e iniciar servicios (variables en .env)
echo "🔨 Construyendo e iniciando servicios..."
docker compose up -d --build

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar que los contenedores estén corriendo
echo "🔍 Verificando estado de los contenedores..."
docker compose ps

# Mostrar logs
echo "📋 Mostrando logs recientes..."
docker compose logs --tail=50

echo "✅ Deployment completado!"
echo "🌐 Frontend: https://autoremates.cl"
echo "🔧 Backend API: https://api.autoremates.cl"
echo "📊 Traefik Dashboard: https://traefik.autoremates.cl"
