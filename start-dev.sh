#!/bin/bash

echo "🚀 Iniciando Autoventas360 - Entorno de desarrollo"

# Verificar si PostgreSQL está corriendo
if ! docker ps | grep -q autoventas-postgres; then
    echo "📦 Iniciando PostgreSQL..."
    docker run -d --name autoventas-postgres \
        -e POSTGRES_DB=autoventas360 \
        -e POSTGRES_USER=autoventas_user \
        -e POSTGRES_PASSWORD=parol123 \
        -p 5432:5432 \
        postgres:15-alpine
    sleep 5
else
    echo "✅ PostgreSQL ya está corriendo"
fi

# Función para abrir nueva terminal
open_terminal() {
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && $1\""
}

echo "🔧 Abriendo Backend..."
open_terminal "npm run dev"

echo "🎨 Abriendo Frontend..."
open_terminal "cd frontend && npm run dev"

echo "✅ Servicios iniciados:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Backend: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "📝 Para conectar DBeaver:"
echo "   Host: localhost:5432"
echo "   DB: autoventas360"
echo "   User: autoventas_user"
echo "   Pass: parol123"