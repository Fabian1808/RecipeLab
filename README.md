# RecipeLab - Libro Digital de Recetas

Aplicación web para estudiantes donde pueden crear, consultar y compartir recetas de cocina.

## Tecnologías

- React + Vite
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)
- React Router
- Framer Motion
- Lucide React

## Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz con tu configuración de Firebase (ver `.env.example`):
   ```
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ThemeToggle.jsx
│   ├── ProtectedRoute.jsx
│   └── RecipeCard.jsx
├── contexts/       # Contextos de React
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/          # Páginas de la aplicación
│   ├── Home.jsx
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
