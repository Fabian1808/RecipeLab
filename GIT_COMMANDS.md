# Comandos Git para Despliegue - RecipeLab

## 📋 Comandos en Orden de Ejecución

### Paso 1: Verificar Estado Actual

```bash
# Ver estado del repositorio
cd ~/Documents/RecipeLab
git status

# Ver remoto actual (si existe)
git remote -v

# Ver ramas
git branch -a
```

### Paso 2: Configurar Git (primera vez)

```bash
# Configurar nombre de usuario
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Ver configuración
git config --list
```

### Paso 3: Inicializar o Configurar Repositorio

```bash
# OPCIÓN A: Si el repositorio ya existe
cd ~/Documents/RecipeLab

# OPCIÓN B: Si necesitas inicializar desde cero
git init

# Agregar remoto (reemplazar USERNAME)
git remote add origin https://github.com/USERNAME/recipelab.git

# Verificar que se agregó correctamente
git remote -v
```

### Paso 4: Agregar Archivos

```bash
# Ver qué cambios hay
git status

# Agregar todos los archivos
git add .

# Verificar que se agregaron
git status

# (Opcional) Ver qué se va a commitear
git diff --cached
```

### Paso 5: Primer Commit

```bash
# Hacer el commit inicial
git commit -m "feat: initial commit - RecipeLab production ready

- Autenticación con Firebase (Google OAuth + Email/Password)
- CRUD de recetas con likes, favoritos y comentarios
- Sistema de puntos e insignias
- Validación de datos en frontend y backend
- Firestore y Storage rules configuradas
- Optimización de bundle para producción
- Documentación completa (SECURITY.md, DEPLOYMENT.md, SETUP.md, CONTRIBUTING.md)
- Vercel ready"

# Ver el commit creado
git log --oneline
```

### Paso 6: Configurar Branch Principal

```bash
# Renombrar rama a 'main' (si está en master)
git branch -M main

# Verificar rama actual
git branch

# Ver ramas remotas
git branch -r
```

### Paso 7: Push Inicial a GitHub

```bash
# Push a GitHub (primera vez con -u)
git push -u origin main

# En futuras ocasiones, solo:
git push origin main
```

### Verificar en GitHub

1. Ir a https://github.com/USERNAME/recipelab
2. Verificar que los archivos están allí
3. Ver el commit inicial

## 📝 Comandos para Cambios Posteriores

Después del despliegue inicial, para cada cambio:

```bash
# Ver cambios
git status

# Agregar archivos específicos (o . para todos)
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: descripción del cambio"

# Push a GitHub
git push origin main

# Vercel desplegará automáticamente
```

## 🏷️ Tags de Versión (Opcional)

```bash
# Crear tag para versión
git tag -a v1.0.0 -m "RecipeLab v1.0.0 - Initial Release"

# Ver tags
git tag

# Push tags a GitHub
git push origin v1.0.0

# O push todos los tags
git push origin --tags

# Eliminar tag local (si es necesario)
git tag -d v1.0.0

# Eliminar tag remoto
git push origin --delete v1.0.0
```

## 🔍 Comandos Útiles para Debugging

```bash
# Ver historial de commits
git log --oneline

# Ver cambios no staged
git diff

# Ver cambios staged
git diff --cached

# Ver cambios de un archivo específico
git diff src/services/firebase.js

# Ver quién cambió cada línea
git blame src/utils/validation.js

# Ver información de un commit
git show abc1234

# Ver ramas
git branch -v

# Ver estado completo
git status -s
```

## 🔄 Reversiones (Si Algo Falla)

```bash
# Ver último commit
git log -1

# Revertir último commit (pero mantener cambios localmente)
git reset --soft HEAD~1

# Revertir último commit (descartar cambios)
git reset --hard HEAD~1

# Revertir commit específico
git revert abc1234

# Ver commits que se pueden revertir
git reflog
```

## 🌿 Trabajar con Branches

```bash
# Crear rama de feature
git checkout -b feature/nombre-feature

# Ver ramas locales
git branch

# Cambiar de rama
git checkout main

# Fusionar rama en main
git merge feature/nombre-feature

# Eliminar rama local
git branch -d feature/nombre-feature

# Eliminar rama remota
git push origin --delete feature/nombre-feature

# Push de rama nueva
git push -u origin feature/nombre-feature
```

## ⚠️ Configuración del .gitignore

```bash
# Ver qué archivos están ignorados
git status --ignored

# Actualizar .gitignore
# (El archivo ya está configurado correctamente)
cat .gitignore

# Si necesitas agregar un patrón nuevo
echo "nuevo_patron/\n" >> .gitignore
git add .gitignore
git commit -m "chore: update gitignore"
git push origin main
```

## 🔐 Variables Seguras en Git

```bash
# Verificar que .env NO está tracked
git ls-files | grep env

# Si .env está tracked, eliminarlo (pero solo de Git, no del disco)
git rm --cached .env

# Agregar a .gitignore si no está
echo ".env\n.env.local\n" >> .gitignore

# Commit
git add .gitignore
git commit -m "chore: exclude env files"
git push origin main
```

## 📊 Estadísticas del Repositorio

```bash
# Número de commits
git rev-list --count HEAD

# Tamaño del repositorio
du -sh .git

# Contribuciones por autor
git shortlog -sn

# Cambios por archivo
git diff --stat HEAD~1

# Commits por día
git log --format="%ai" | cut -d' ' -f1 | sort | uniq -c
```

## 🔗 Vincular con GitHub

```bash
# Si GitHub dice "fatal: remote origin already exists"
git remote remove origin
git remote add origin https://github.com/USERNAME/recipelab.git

# Si necesitas cambiar la URL
git remote set-url origin https://github.com/USERNAME/recipelab.git

# Verificar URL
git remote -v
```

## 🚀 CI/CD con GitHub Actions (Futuro)

```bash
# Crear carpeta para workflows
mkdir -p .github/workflows

# Los workflows se ejecutarán automáticamente en cada push
# Ejemplo: tests, linting, deployment
```

## 📝 Mensajes de Commit Recomendados

```
feat: agregar nueva funcionalidad
fix: corregir bug específico
docs: actualizar documentación
style: cambios de formato sin cambiar lógica
refactor: refactorizar código existente
perf: mejoras de performance
test: agregar o actualizar tests
chore: tareas de mantenimiento
ci: cambios en CI/CD
revert: revertir commit anterior
```

## ✅ Checklist Pre-Push

```bash
# Antes de hacer push, verificar:
- [ ] npm run lint  # Sin errores
- [ ] npm run build # Build exitoso
- [ ] git status    # Estado correcto
- [ ] Mensaje descriptivo en commit
- [ ] Cambios esperados en diff
- [ ] .env no está tracked
```

## 📞 Ayuda

```bash
# Documentación de git
git help <comando>

# Ejemplo
git help commit
git help push
git help branch

# En línea
# https://git-scm.com/docs
```

---

**Tip**: Puedes copiar y pegar estos comandos directamente en tu terminal (PowerShell o CMD en Windows, bash en Mac/Linux).
