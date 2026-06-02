Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RecipeLab - Deploy a Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PASO 1: Instalar Vercel CLI (solo la primera vez)" -ForegroundColor Yellow
npm install -g vercel
Write-Host ""
Write-Host "PASO 2: Iniciar sesion en Vercel" -ForegroundColor Yellow
Write-Host "Se abrira el navegador. Inicia sesion con Google o GitHub."
vercel login
Write-Host ""
Write-Host "PASO 3: Desplegar la aplicacion" -ForegroundColor Yellow
vercel --prod
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  LISTO! Copia el link que aparece arriba" -ForegroundColor Green
Write-Host "  y compartelo con tus estudiantes" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
pause
