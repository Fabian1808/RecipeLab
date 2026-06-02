#!/bin/bash
# Script de despliegue automatizado a Vercel

set -e

echo "🚀 Iniciando despliegue de RecipeLab a Vercel..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json no encontrado"
  exit 1
fi

# Verificar que las dependencias están instaladas
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias..."
  npm install
fi

# Ejecutar linting
echo "🔍 Ejecutando linter..."
npm run lint

# Hacer build
echo "🔨 Compilando aplicación..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
  echo "❌ Error: la compilación falló"
  exit 1
fi

echo "✅ Aplicación compilada correctamente"

# Hacer push a Git
echo "📤 Haciendo push a repositorio..."
git add .
git commit -m "chore: automated deployment build" || true
git push origin main

# Vercel deployment (si está configurado)
if command -v vercel &> /dev/null; then
  echo "🌐 Desplegando en Vercel..."
  vercel --prod
else
  echo "⚠️  Vercel CLI no encontrado. Instalalo con: npm i -g vercel"
fi

echo "✨ ¡Despliegue completado!"
