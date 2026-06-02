# RecipeLab - Libro Digital de Recetas 🍳

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/tu-usuario/recipelab)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Firebase](https://img.shields.io/badge/firebase-enabled-orange)](https://firebase.google.com)
[![Vercel](https://img.shields.io/badge/vercel-deployed-black)](https://vercel.com)

Aplicación web moderna donde estudiantes pueden crear, compartir y descubrir recetas de cocina. Sistema completo con autenticación, base de datos, calificaciones y comunidad.

## 🌟 Características

### Funcionalidad Principal
- 👨‍🍳 **CRUD de Recetas**: Crear, leer, actualizar y eliminar recetas
- ❤️ **Likes y Favoritos**: Interactúa con recetas de otros usuarios
- 💬 **Comentarios**: Comunicate con otros chefs
- 📊 **Sistema de Puntos e Insignias**: Gamificación y reconocimiento
- 🏆 **Ranking**: Ve tu posición en la comunidad
- 🔍 **Búsqueda y Filtros**: Encuentra recetas fácilmente
- 🌙 **Modo Oscuro**: Interfaz adaptable a preferencias

### Seguridad
- 🔐 Autenticación con Firebase (Google OAuth + Email/Password)
- ✅ Validación de datos en frontend y backend
- 🛡️ Reglas de Firestore restrictivas
- 🖼️ Validación de imágenes
- 🚫 Protección contra XSS

### Performance
- ⚡ Vite con código splitting
- 📦 Bundle optimizado (~150KB gzipped)
- 🎨 CSS code splitting
- 🔄 Lazy loading de rutas
- 📱 Mobile-first responsive

## 🚀 Inicio Rápido

### Requisitos
- Node.js 16+
- npm 8+
- Cuenta de Firebase
- Cuenta de Vercel (para producción)

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/recipelab.git
cd recipelab

# Instalar dependencias
npm install

# Crear archivo .env.local
cp .env.example .env.local

# Rellenar variables de Firebase en .env.local
# (ver SETUP.md para instrucciones detalladas)

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Desarrollo

```bash
# Iniciar servidor con hot-reload
npm run dev

# Ejecutar linter
npm run lint

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📚 Documentación

| Documento | Descripción |
|-----------|------------|
| [SETUP.md](SETUP.md) | Guía completa de configuración y despliegue |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Instrucciones detalladas de despliegue en Vercel |
| [SECURITY.md](SECURITY.md) | Estrategia de seguridad y best practices |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guía para contribuidores |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios |
| [PRODUCTION_READY.md](PRODUCTION_READY.md) | Resumen de cambios y preparación para producción |

## 🏗️ Arquitectura

### Frontend
- **React 19.2** - Librería UI
- **Vite 8** - Build tool
- **React Router 7** - Enrutamiento
- **Tailwind CSS 4** - Estilos
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos

### Backend
- **Firebase Authentication** - Autenticación
- **Firestore** - Base de datos NoSQL
- **Firebase Storage** - Almacenamiento de imágenes

### Hosting
- **Vercel** - Hosting de aplicación
- **Firebase** - Base de datos y autenticación

### Desarrollo
- **ESLint** - Linting de código
- **Tailwind CSS** - Estilos utilitarios

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── RecipeCard.jsx
│   └── ThemeToggle.jsx
├── contexts/             # React Contexts
│   ├── AuthContext.jsx   # Autenticación
│   └── ThemeContext.jsx  # Tema
├── firebase/
│   └── config.js         # Configuración Firebase
├── pages/                # Páginas de la app
│   ├── Admin.jsx
│   ├── CreateRecipe.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Ranking.jsx
│   ├── RecipeDetail.jsx
│   └── Register.jsx
├── services/
│   ├── firebase.js       # Funciones de Firebase (con validación)
│   └── demoService.js    # Fallback local
├── utils/                # Utilidades
│   ├── validation.js     # Validación de datos
│   ├── errorHandler.js   # Manejo de errores
│   └── helpers.js        # Funciones auxiliares
├── App.jsx               # Componente principal
├── main.jsx              # Punto de entrada
└── index.css             # Estilos globales
```

## 🔐 Configuración de Firebase

### Pasos Iniciales

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Autenticación (Google + Email/Password)
3. Crear Firestore Database en modo producción
4. Crear Storage Bucket
5. Copiar credenciales a `.env.local`

### Desplegar Reglas

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage
```

Ver [SETUP.md](SETUP.md) para instrucciones completas.

## 🚀 Despliegue en Vercel

### Configuración Rápida

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Configuración Completa

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones paso a paso.

## 📊 Variables de Entorno

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# App Configuration
VITE_APP_NAME=RecipeLab
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

Ver `.env.example` para más detalles.

## 🔒 Seguridad

RecipeLab implementa múltiples capas de seguridad:

- **Autenticación**: Firebase Authentication con contraseñas fuertes
- **Autorización**: Firestore Rules restrictivas
- **Validación**: Frontend + Backend
- **Protección**: XSS prevention, HTTPS, etc.

Ver [SECURITY.md](SECURITY.md) para detalles completos.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crear una rama (`git checkout -b feature/mi-feature`)
3. Commit cambios (`git commit -m 'feat: descripción'`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abrir un Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para detalles.

## 📈 Roadmap

- [ ] Rating de recetas (estrellas)
- [ ] Búsqueda avanzada y filtros
- [ ] Notificaciones
- [ ] Recetas por alérgenos
- [ ] Cálculo de calorías
- [ ] App móvil nativa

Ver [CHANGELOG.md](CHANGELOG.md) para más detalles.

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para detalles.

## 🐛 Reportar Bugs

Encontraste un bug? Por favor abre un [Issue](https://github.com/tu-usuario/recipelab/issues) con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Capturas de pantalla (si aplica)

## 💬 Contacto

- Issues: [GitHub Issues](https://github.com/tu-usuario/recipelab/issues)
- Discussions: [GitHub Discussions](https://github.com/tu-usuario/recipelab/discussions)

## 🙏 Agradecimientos

Gracias a:
- Firebase por la infraestructura
- Vercel por el hosting
- React y la comunidad open source
- Todos los contribuidores

---

**Hecho con ❤️ por la comunidad de RecipeLab**

[Versión en Vivo](https://recipelab.vercel.app) • [GitHub](https://github.com/tu-usuario/recipelab) • [Reportar Bug](https://github.com/tu-usuario/recipelab/issues)
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CreateRecipe.jsx
│   ├── RecipeDetail.jsx
│   ├── Profile.jsx
│   ├── Ranking.jsx
│   └── Admin.jsx
├── services/       # Servicios Firebase
│   └── firebase.js
├── firebase/       # Configuración Firebase
│   └── config.js
├── App.jsx         # Componente principal
├── main.jsx        # Punto de entrada
└── index.css       # Estilos globales
```

## Funcionalidades

- Autenticación con Google y email
- CRUD de recetas con imágenes
- Búsqueda y filtrado por categorías
- Likes, favoritos y comentarios
- Gamificación con puntos e insignias
- Ranking de usuarios
- Modo claro/oscuro
- Panel de administración
- Diseño responsive
