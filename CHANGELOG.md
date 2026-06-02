# Changelog - RecipeLab

Todos los cambios notables de este proyecto están documentados en este archivo.

## [1.0.0] - 2026-06-02

### ✨ Agregado
- Autenticación con Firebase (Google OAuth + Email/Password)
- Sistema de recetas con CRUD completo
- Sistema de likes y favoritos
- Comentarios en recetas
- Sistema de puntos e insignias
- Modo demo con localStorage
- Tema oscuro/claro
- Ranking de usuarios
- Panel de administrador (demo)
- Validación de datos en frontend y backend
- Reglas de Firestore y Storage
- Optimización de bundle para producción
- Configuración de Vercel
- Documentación de seguridad
- Guía de despliegue
- Guía de contribución

### 🔒 Seguridad
- Validación de email y password
- Sanitización de entrada de usuario
- Reglas de Firestore restrictivas
- Reglas de Storage con límites
- Mejor manejo de errores sin exponer detalles

### 🚀 Performance
- Bundle splitting en Vite
- CSS code splitting
- Lazy loading de rutas
- Compresión de código en producción
- Sin console.logs en producción
- Sourcemaps deshabilitados en prod

### 📱 UI/UX
- Interfaz responsiva (mobile-first)
- Dark mode completo
- Animaciones suave con Framer Motion
- Navegación intuitiva
- Iconos con Lucide React

### 📚 Documentación
- README completo
- SECURITY.md
- DEPLOYMENT.md
- CONTRIBUTING.md
- Comentarios en código

### 🛠 Herramientas
- Eslint configurado
- Tailwind CSS
- Vite configurado
- Firebase SDK
- React Router v7

### 📋 Base de Datos
- Colecciones: users, recipes, comments
- Índices automáticos
- Timestamps en servidor
- Aritmética distribuida

## Roadmap Futuro

### v1.1.0
- [ ] Rating de recetas
- [ ] Búsqueda avanzada
- [ ] Filtros por tiempo de preparación
- [ ] Filtros por dificultad
- [ ] Notificaciones

### v1.2.0
- [ ] Recetas guardadas/bookmarks
- [ ] Compartir recetas en redes
- [ ] Categorías personalizadas
- [ ] Historial de recetas
- [ ] Sugerencias personalizadas

### v1.3.0
- [ ] Recetas por alérgenos
- [ ] Cálculo de calorías
- [ ] Ingredientes por persona
- [ ] Conversión de unidades
- [ ] Recetas favoritas sincronizadas

### v2.0.0
- [ ] App móvil nativa
- [ ] Offline mode completo
- [ ] Sincronización en tiempo real
- [ ] Colaboración en recetas
- [ ] Video tutoriales
