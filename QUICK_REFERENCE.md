# Guía de Referencia Rápida - RecipeLab 🚀

## ⚡ Comandos Esenciales

### Desarrollo Local
```bash
npm install          # Instalar dependencias
npm run dev         # Iniciar servidor local
npm run build       # Compilar para producción
npm run lint        # Ejecutar linter
npm run preview     # Previsualizar build
```

### Git Inicial
```bash
git remote add origin https://github.com/USERNAME/recipelab.git
git add .
git commit -m "feat: initial commit - RecipeLab production ready"
git branch -M main
git push -u origin main
```

### Despliegue
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📁 Dónde Encontrar Qué

| Necesito | Archivo |
|----------|---------|
| Instrucciones paso a paso | [SETUP.md](SETUP.md) |
| Configurar Firebase | [SETUP.md](SETUP.md) → Sección "Configurar Firebase" |
| Desplegar en Vercel | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Comandos Git | [GIT_COMMANDS.md](GIT_COMMANDS.md) |
| Seguridad | [SECURITY.md](SECURITY.md) |
| Contribuir al proyecto | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Resumen de cambios | [PRODUCTION_READY.md](PRODUCTION_READY.md) |
| Historial de cambios | [CHANGELOG.md](CHANGELOG.md) |

---

## 🔐 Variables de Entorno Necesarias

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Obtén estos valores de Firebase Console → Project Settings

---

## ✅ Checklist de Despliegue

### Antes de Desplegar
- [ ] `npm run build` funciona
- [ ] `npm run lint` sin errores
- [ ] Variables de entorno configuradas
- [ ] Firebase rules desplegadas
- [ ] GitHub repo creado

### Despliegue
- [ ] Conectar Vercel a GitHub
- [ ] Agregar variables de entorno
- [ ] Deploy inicial exitoso
- [ ] Verificar en URL en vivo

### Post-Despliegue
- [ ] Probar autenticación
- [ ] Crear receta
- [ ] Dar like
- [ ] Agregar comentario

---

## 📊 Archivos Clave

```
src/
├── services/firebase.js       # Lógica de datos
├── contexts/AuthContext.jsx   # Autenticación
└── utils/
    ├── validation.js          # Validaciones
    └── errorHandler.js        # Manejo de errores
```

---

## 🆘 Problemas Comunes

### Build falla
```bash
npm run build --verbose  # Ver detalles
npm install             # Reinstalar
npm cache clean --force # Limpiar cache
```

### Firebase no conecta
- Verificar variables de entorno en Vercel
- Verificar reglas en Firebase Console
- Verificar que autenticación está habilitada

### Imágenes no cargan
- Verificar Storage Rules
- Verificar tamaño < 5MB
- Verificar tipo es imagen

---

## 🎯 Próximos Pasos

```
1. Leer SETUP.md (10 minutos)
   ↓
2. Configurar Firebase (15 minutos)
   ↓
3. Hacer Git push (5 minutos)
   ↓
4. Desplegar en Vercel (10 minutos)
   ↓
5. Verificar en vivo (5 minutos)
   ↓
6. ¡Compartir con el mundo! 🎉
```

---

## 📖 Documentos Principales

**Para empezar:** [SETUP.md](SETUP.md)  
**Para desplegar:** [DEPLOYMENT.md](DEPLOYMENT.md)  
**Para seguridad:** [SECURITY.md](SECURITY.md)  

---

## 💡 Tips Útiles

- Usar `npm run dev` para desarrollo
- Usar `npm run lint:fix` para auto-formatear
- Revisar `.env.example` como referencia
- Los errores en Vercel se ven en los logs de despliegue
- Usar `git status` frecuentemente

---

**¡Necesitas ayuda? Revisa el archivo correspondiente en la tabla "Dónde Encontrar Qué"**
