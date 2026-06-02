# Guía Completa de Configuración y Despliegue - RecipeLab

## 📖 Tabla de Contenidos

1. [Configuración Local](#configuración-local)
2. [Configurar Firebase](#configurar-firebase)
3. [Configurar GitHub](#configurar-github)
4. [Configurar Vercel](#configurar-vercel)
5. [Comandos Git Utilizados](#comandos-git-utilizados)
6. [Pasos Finales de Publicación](#pasos-finales-de-publicación)

## 🔧 Configuración Local

### Paso 1: Preparar el Entorno

```bash
# Navegar al directorio del proyecto
cd ~/Documents/RecipeLab

# Instalar dependencias (si no está hecho)
npm install

# Verificar que Node está actualizado
node --version  # Debe ser 16+
npm --version   # Debe ser 8+
```

### Paso 2: Crear Variables de Entorno Locales

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tu editor favorito
code .env.local
```

**Contenido de .env.local:**
```
VITE_FIREBASE_API_KEY=tu_api_key_de_firebase_dev
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id_dev
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_APP_NAME=RecipeLab
VITE_APP_VERSION=1.0.0-dev
VITE_ENVIRONMENT=development
```

### Paso 3: Probar Localmente

```bash
# Iniciar servidor de desarrollo
npm run dev

# En otra terminal, ejecutar linter
npm run lint

# Compilar para producción (verificar que funciona)
npm run build

# Previsualizar build de producción
npm run preview
```

## 🔐 Configurar Firebase

### Paso 1: Crear un Proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Click en "Create Project"
3. Nombre: `recipelab-prod`
4. Desabilitar Google Analytics (opcional)
5. Crear proyecto

### Paso 2: Habilitar Autenticación

1. En Firebase Console → Authentication
2. Click en "Get Started"
3. Habilitar métodos:
   - Email/Password
   - Google

### Paso 3: Crear Firestore Database

1. Firebase Console → Firestore Database
2. Click en "Create Database"
3. Localización: Closest to you
4. Modo: **Start in production mode**
5. Crear

### Paso 4: Crear Storage Bucket

1. Firebase Console → Storage
2. Click en "Get Started"
3. Aceptar localización por defecto
4. Click "Done"

### Paso 5: Obtener Credenciales

1. Firebase Console → Project Settings (engranaje)
2. Tab "General"
3. Copiar la configuración de Firebase (firebaseConfig)
4. Guardar valores en `.env.production`

### Paso 6: Desplegar Reglas de Seguridad

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Initializar Firebase en el proyecto
firebase init

# Seleccionar:
# - Firestore
# - Storage
# - Usar .firebaserc

# Desplegar reglas
firebase deploy --only firestore:rules,storage
```

**Para verificar que las reglas se copiaron correctamente:**
1. Firebase Console → Firestore → Rules
2. Debe mostrar las reglas de validación

## 📝 Configurar GitHub

### Paso 1: Crear Repositorio en GitHub

1. Ir a [GitHub](https://github.com)
2. Click en "+" → "New repository"
3. Nombre: `recipelab`
4. Descripción: "Digital Recipe Book - Share & Discover Recipes"
5. Visibilidad: Public
6. **NO** inicializar con README (ya tenemos uno)
7. Click "Create repository"

### Paso 2: Configurar Git Localmente

```bash
# Ir al directorio del proyecto
cd ~/Documents/RecipeLab

# Inicializar Git (si no está hecho)
git init

# Agregar remoto (reemplazar usuario)
git remote add origin https://github.com/TU_USUARIO/recipelab.git

# Verificar remoto
git remote -v
```

### Paso 3: Configurar .gitignore

```bash
# El archivo ya está configurado, pero verificar que contiene:
cat .gitignore

# Debe incluir: node_modules, dist, .env, .env.local, etc.
```

### Paso 4: Hacer Commits Iniciales

```bash
# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "feat: initial commit - RecipeLab production ready

- Autenticación con Firebase (Google OAuth + Email/Password)
- CRUD de recetas con likes, favoritos y comentarios
- Sistema de puntos e insignias
- Validación de datos en frontend y backend
- Firestore y Storage rules configuradas
- Optimización de bundle para producción
- Documentación completa (SECURITY.md, DEPLOYMENT.md, CONTRIBUTING.md)
- Vercel ready"

# Verificar logs
git log --oneline
```

### Paso 5: Push a GitHub

```bash
# Push a main branch
git branch -M main
git push -u origin main

# Verificar en GitHub
# Ir a https://github.com/TU_USUARIO/recipelab
```

### Paso 6: Configurar Branch Protection (Opcional pero Recomendado)

1. GitHub → Settings → Branches
2. Click "Add rule"
3. Pattern: `main`
4. Requerir PRs antes de merge
5. Requerir reviews
6. Save

## 🚀 Configurar Vercel

### Paso 1: Conectar Vercel a GitHub

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login a Vercel
vercel login
```

### Paso 2: Crear Proyecto en Vercel

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Seleccionar repositorio `recipelab`
4. Framework: Vite (se detecta automáticamente)
5. Root Directory: `./` (default)
6. Build Command: `npm run build`
7. Output Directory: `dist`

### Paso 3: Configurar Variables de Entorno en Vercel

1. En la pantalla de configuración del proyecto, click "Environment Variables"
2. Agregar cada variable (desde `.env.production`):

```
VITE_FIREBASE_API_KEY = tu_api_key
VITE_FIREBASE_AUTH_DOMAIN = tu_auth_domain
VITE_FIREBASE_PROJECT_ID = tu_project_id
VITE_FIREBASE_STORAGE_BUCKET = tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID = tu_sender_id
VITE_FIREBASE_APP_ID = tu_app_id
VITE_APP_NAME = RecipeLab
VITE_APP_VERSION = 1.0.0
VITE_ENVIRONMENT = production
```

### Paso 4: Deploy Inicial

```bash
# Desde el CLI de Vercel
vercel --prod

# O desde Vercel Dashboard, click "Deploy"
```

### Paso 5: Verificar Despliegue

1. Esperar a que Vercel compile
2. Click en URL de despliegue
3. Verificar que funciona:
   - [ ] Home page carga
   - [ ] Puedo acceder a /login
   - [ ] Autenticación funciona
   - [ ] Puedo crear receta
   - [ ] Las imágenes se suben
   - [ ] Los likes funcionan

### Paso 6: Configurar Dominio Personalizado (Opcional)

1. Vercel → Project → Settings → Domains
2. Agregar dominio
3. Configurar DNS según instrucciones
4. Esperar propagación DNS

## 📋 Comandos Git Utilizados

```bash
# 1. Inicializar repositorio local (si no existe)
git init

# 2. Agregar remoto
git remote add origin https://github.com/TU_USUARIO/recipelab.git

# 3. Agregar todos los archivos
git add .

# 4. Crear commit inicial
git commit -m "feat: initial commit - RecipeLab production ready"

# 5. Renombrar rama a main
git branch -M main

# 6. Push inicial
git push -u origin main

# 7. Para cambios posteriores
git add .
git commit -m "feat/fix/docs: description"
git push origin main

# 8. Ver estado
git status

# 9. Ver logs
git log --oneline

# 10. Ver remoto
git remote -v
```

## ✅ Pasos Finales de Publicación

### Verificación Pre-Producción

```bash
# 1. Verificar build local
npm run build

# 2. Ejecutar linter
npm run lint

# 3. Previsualizar build
npm run preview

# 4. Verificar variables de entorno en Vercel
# Dashboard → Settings → Environment Variables

# 5. Verificar Firebase Rules están desplegadas
# Firebase Console → Firestore/Storage → Rules
```

### Pasos de Publicación Final

```bash
# 1. Asegurar que todo está commiteado
git status  # Debe decir "nothing to commit"

# 2. Crear tag de versión (opcional)
git tag -a v1.0.0 -m "RecipeLab v1.0.0 - Initial Release"
git push origin v1.0.0

# 3. Verificar que Vercel desplegó
# Ir a Vercel Dashboard → Deployments

# 4. Acceder a URL en vivo
# https://recipelab.vercel.app (o tu dominio)

# 5. Hacer pruebas finales
# - Registrarse
# - Crear receta
# - Dar like
# - Ver ranking
# - Compartir link
```

### Testing en Producción

```bash
# 1. Test de autenticación
# Registrarse con email nuevo
# Loguearse con Google
# Logout

# 2. Test de funcionalidad
# Crear receta
# Editar receta
# Eliminar receta
# Dar like/favorito
# Agregar comentario

# 3. Test de performance
# Abrir DevTools → Network
# Verificar tiempos de carga
# Verificar que no hay console errors

# 4. Test de seguridad
# Verificar que .env no está expuesto
# Verificar que tokens se envían seguro
# Verificar que HTTPS está activo
```

### Monitoreo Continuo

1. **Configurar alertas en Vercel**
   - Dashboard → Project → Settings → Alerts

2. **Monitorear Firebase**
   - Firebase Console → Realtime database usage
   - Alerts si se exceden cuotas

3. **Configurar logging (recomendado)**
   - Instalar Sentry, LogRocket, o similar
   - Monitorear errores en producción

## 🎉 ¡Felicidades!

Tu aplicación RecipeLab está ahora en producción. 

### Siguientes pasos:
- [ ] Compartir URL con amigos
- [ ] Recolectar feedback
- [ ] Monitorear performance
- [ ] Actualizar versión cuando hay cambios
- [ ] Mantener dependencias actualizadas

## 📞 Troubleshooting

### Build falla en Vercel
```bash
# Verificar logs
npm run build 2>&1 | head -50

# Limpiar cache de Vercel
# Dashboard → Settings → Git
# Rebuild without cache
```

### Firebase no conecta
- Verificar variables de entorno en Vercel
- Verificar que la IP no está bloqueada en Firebase
- Verificar que los métodos de autenticación están habilitados

### Imágenes no se suben
- Verificar Storage Rules permiten escritura autenticada
- Verificar que el tamaño de archivo es < 5MB
- Verificar tipo MIME es imagen

## 📚 Recursos

- [Firebase Docs](https://firebase.google.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
