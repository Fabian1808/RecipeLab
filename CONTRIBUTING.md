# Guía de Contribución - RecipeLab

## 🎯 Misión del Proyecto

RecipeLab es una plataforma digital donde estudiantes pueden crear, compartir y descubrir recetas. Buscamos mantener una comunidad activa, segura y bien documentada.

## ✨ Cómo Contribuir

### Reportar Bugs

1. **Antes de reportar**, verifica que el bug no exista ya
2. Usa el título descriptivo
3. Describe los pasos para reproducir
4. Incluye el comportamiento esperado vs actual
5. Incluye capturas de pantalla si es relevante
6. Menciona tu navegador y sistema operativo

**Ejemplo:**
```
Título: Las imágenes no cargan en recetas
Pasos para reproducir:
1. Ir a Crear Receta
2. Seleccionar una imagen
3. Guardar receta

Esperado: La imagen aparece en la receta
Actual: La imagen no se muestra
```

### Sugerir Mejoras

1. Usa un título descriptivo
2. Proporciona una descripción clara de la mejora
3. Explica el caso de uso
4. Lista ejemplos de cómo funcionaría
5. Menciona alternativas consideradas

### Pull Requests

#### Configurar el Ambiente

```bash
# Fork el repositorio
git clone https://github.com/tu-usuario/recipelab.git
cd recipelab

# Instalar dependencias
npm install

# Crear rama de feature
git checkout -b feature/nombre-descriptivo
```

#### Desarrollo

```bash
# Ejecutar servidor de desarrollo
npm run dev

# Ejecutar linter
npm run lint

# Corregir errores de linting
npm run lint:fix
```

#### Commits

Usa mensajes descriptivos siguiendo Conventional Commits:

```
feat: agregar validación de email
fix: corregir bug en cargar imágenes
docs: actualizar README
style: reformatear código
refactor: simplificar componente
perf: optimizar consulta de recetas
test: agregar tests para autenticación
chore: actualizar dependencias
```

#### Push y PR

```bash
# Hacer push a tu fork
git push origin feature/nombre-descriptivo

# Abrir PR desde GitHub
# - Descripción clara de cambios
# - Referencia a issues relacionados
# - Screenshots si hay cambios UI
# - Tests ejecutados
```

### Estándares de Código

#### JavaScript/React

```javascript
// ✅ Buen estilo
function obtenerRecetas() {
  const [recetas, setRecetas] = useState([])
  const { user } = useAuth()
  
  useEffect(() => {
    cargarRecetas()
  }, [])
  
  return <div>{recetas.map(r => <RecipeCard key={r.id} recipe={r} />)}</div>
}

// ❌ Evitar
function getRecipes() {
  const recetas = useState([])
  // efectos sin dependencias
  // console.log() en código
  // funciones en inline
}
```

#### Componentes

- Nombres en PascalCase
- Props bien tipadas (comentarios JSDoc)
- Lógica centralizada en hooks personalizados
- Componentes pequeños y reutilizables

#### Naming

```
Componentes: UserProfile, RecipeCard, Navbar
Funciones: obtenerRecetas(), validarEmail()
Variables: usuarioActual, esAutenticado
Constantes: CATEGORIAS_VALIDAS, MAX_FILE_SIZE
```

### Documentación

Todos los cambios públicos deben estar documentados:

```javascript
/**
 * Obtiene las recetas del usuario actual
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<Array>} Array de recetas
 */
export async function obtenerRecetasUsuario(usuarioId) {
  // ...
}
```

### Testing

Si agregas funcionalidad nueva:

```bash
# Ejecutar tests (cuando estén disponibles)
npm test

# Tests de integración
npm run test:integration
```

### Cambios Grandes

Para cambios mayores:
1. Abre un issue primero para discutir
2. Espera feedback del mantenedor
3. Luego procede con el PR

## 📋 Proceso de Review

1. **Revisor automático**: Linter y build checks
2. **Revisor humano**: Revisión de código
3. **Feedback**: Comentarios para mejoras
4. **Aprobación**: Si todo está bien
5. **Merge**: Integración a main

## 🚀 Proceso de Release

Cuando estamos listos para un release:

```bash
# Version bumping (semver)
npm version patch|minor|major

# Push tags
git push origin --tags

# GitHub release con changelog
```

## 📚 Estructura del Proyecto

```
src/
├── components/    # Componentes reutilizables
├── contexts/      # React Contexts
├── firebase/      # Configuración Firebase
├── pages/         # Páginas de la app
├── services/      # Lógica de negocios
└── utils/         # Utilidades y helpers
```

## 🎨 Guía de Estilos UI

- **Color Primario**: Orange (#f97316)
- **Dark Mode**: Soportado
- **Responsivo**: Mobile-first
- **Animaciones**: Framer Motion (suave)
- **Iconos**: Lucide React

## 🐛 Conocidos Problemas

- Imágenes grandes pueden tardar en cargar
- No hay soporte offline
- Límite de 5MB por imagen

## 💬 Código de Conducta

- Sé respetuoso
- Incluye a todos
- No tolerar acoso
- Reportar problemas al mantenedor

## 🙏 Agradecimientos

Gracias por contribuir a RecipeLab. Tu trabajo ayuda a que este proyecto sea mejor.

## 📞 Preguntas?

- Abre un Discussion
- Revisa la documentación
- Abre un Issue
