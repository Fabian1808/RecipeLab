# Guía de Despliegue - RecipeLab

## 📋 Prerequisitos

- Node.js 16+ y npm 8+
- Cuenta de Firebase
- Cuenta de Vercel
- Git instalado
- Repositorio GitHub

## 🚀 Procedimiento de Despliegue

### 1. Preparación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/recipelab.git
cd recipelab

# Instalar dependencias
npm install

# Crear archivos de entorno
cp .env.example .env.local
cp .env.example .env.production

# Completar las variables de Firebase en ambos archivos
```

### 2. Variables de Entorno

Reemplazar en `.env.production`:
```
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_auth_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_production_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_messaging_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
```

### 3. Configurar Firebase

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inicializar Firebase en el proyecto
firebase init

# Desplegar reglas de Firestore
firebase deploy --only firestore:rules

# Desplegar reglas de Storage
firebase deploy --only storage
```

#### Firestore Rules
Asegúrate de copiar el contenido de `firestore.rules` a la consola de Firebase.

#### Storage Rules
Asegúrate de copiar el contenido de `storage.rules` a la consola de Firebase.

### 4. Validar Localmente

```bash
# Verificar sintaxis con linter
npm run lint

# Compilar la aplicación
npm run build

# Previsualizar el build
npm run preview
```

### 5. Configurar Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login a Vercel
vercel login

# Primer despliegue (linking)
vercel --prod

# O desde la interfaz web:
# 1. Ir a https://vercel.com/dashboard
# 2. Click en "New Project"
# 3. Importar repositorio GitHub
# 4. Configurar build settings (automático)
# 5. Agregar variables de entorno de .env.production
# 6. Deploy
```

### 6. Configurar Variables en Vercel

En el panel de Vercel, ir a Settings > Environment Variables:

```
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_auth_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_production_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_messaging_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
```

### 7. Git y GitHub

```bash
# Configurar remoto
git remote add origin https://github.com/tu-usuario/recipelab.git

# Hacer commit inicial
git add .
git commit -m "Initial commit: RecipeLab ready for production"

# Push a main branch
git push -u origin main
```

## 🔄 Despliegue Posterior

Para despliegues subsecuentes:

```bash
# Option 1: Push a GitHub (Vercel despliega automáticamente)
git add .
git commit -m "feat: description of changes"
git push origin main

# Option 2: Despliegue manual desde Vercel CLI
vercel --prod
```

## 📊 Monitoreo Post-Despliegue

### Verificar Despliegue

1. **URL en Vivo**: https://recipelab.vercel.app (o tu dominio personalizado)
2. **Test de Funcionalidad**:
   - Navegar a home
   - Registrarse con email
   - Crear receta
   - Dar like
   - Agregar comentario
   - Ver ranking

### Monitoreo

- **Vercel Analytics**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Google Analytics** (recomendado): Agregar a index.html
- **Error Tracking** (recomendado): Integrar Sentry

## 🔧 Solución de Problemas

### Build falla en Vercel

```bash
# Verificar logs locales
npm run build

# Verificar que las variables de entorno están configuradas
# en Vercel dashboard
```

### Firebase no conecta

- Verificar que las variables de entorno son correctas
- Verificar que Firebase está habilitado en GCP
- Verificar reglas de Firestore y Storage

### Errores de autenticación

- Verificar que los métodos de autenticación están habilitados en Firebase
- Verificar que Google OAuth está configurado correctamente

### Imágenes no cargan

- Verificar que Storage Rules permiten lectura pública
- Verificar que los archivos se suben correctamente
- Verificar límites de almacenamiento en Firebase

## 📱 Dominio Personalizado

1. En Vercel Dashboard → Project Settings → Domains
2. Agregar nuevo dominio
3. Configurar registros DNS según instrucciones
4. Esperar a que el SSL se genere

## 🔐 SSL/HTTPS

- Automático en Vercel
- Certificado gratuito Let's Encrypt
- Renovación automática

## 📈 Escalabilidad

### Si la aplicación crece:

1. **Caché estático** en Vercel (automático)
2. **CDN global** (automático en Vercel)
3. **Optimizar imágenes** (usar next/image o similar)
4. **Paginación** en listas largas
5. **Cloud Functions** para operaciones complejas
6. **Índices** en Firestore para queries frecuentes

## 🔄 Rollback

Si algo falla después del despliegue:

```bash
# Opción 1: Revertir en Git
git revert HEAD
git push origin main
# Vercel desplegará automáticamente

# Opción 2: En Vercel
# Dashboard → Deployments → Seleccionar versión anterior → Redeploy
```

## 📝 Checklist Final

- [ ] Variables de entorno configuradas
- [ ] Firebase Rules desplegadas
- [ ] Build local pasa sin errores
- [ ] Linter sin warnings
- [ ] Tests funcionando (si existen)
- [ ] Funcionalidades principales testeadas
- [ ] Performance aceptable
- [ ] No hay console.logs de debug en prod
- [ ] Errores no exponen información sensitiva
- [ ] HTTPS funciona correctamente

## 📞 Soporte

Para problemas:
- Revisar logs de Vercel
- Revisar logs de Firebase
- Consultar documentación oficial
- Abrir issue en GitHub
