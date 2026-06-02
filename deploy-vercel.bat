@echo off
echo ========================================
echo  RecipeLab - Deploy a Vercel
echo ========================================
echo.
echo PASO 1: Instalar Vercel CLI (solo la primera vez)
call npm install -g vercel
echo.
echo PASO 2: Iniciar sesion en Vercel
echo Se abrira el navegador para que inicies sesion con tu cuenta de Google/GitHub
vercel login
echo.
echo PASO 3: Desplegar
vercel --prod
echo.
echo ========================================
echo  LISTO! Copia el link que aparece arriba
echo ========================================
pause
