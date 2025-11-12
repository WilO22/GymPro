# 🚀 COMANDOS LISTOS PARA COPIAR Y PEGAR

## Opción 1: Deployment vía GitHub + Vercel (RECOMENDADO)

### Paso 1: Commit y Push a GitHub
Ejecuta estos comandos en PowerShell:

```powershell
cd "C:\Users\Wil\Documents\Septiembre\gym-pro"
git add .
git commit -m "Configuración para Vercel - Deployment gratuito"
git push origin main
```

### Paso 2: Deploy en Vercel
1. Abre: https://vercel.com/new
2. Click en "Import Git Repository"
3. Busca "gym-pro" en tu lista de repos
4. Click en "Import"
5. Vercel auto-detectará todo
6. Click en "Deploy"
7. Espera 2-3 minutos
8. ¡Tu app estará en vivo!

---

## Opción 2: Deployment vía CLI (Alternativa)

### Paso 1: Instalar Vercel CLI
```powershell
npm install -g vercel
```

### Paso 2: Login en Vercel
```powershell
vercel login
```

### Paso 3: Deploy a Producción
```powershell
cd "C:\Users\Wil\Documents\Septiembre\gym-pro"
vercel --prod
```

---

## Verificación Local Antes de Deployar

### Limpiar build anterior
```powershell
cd "C:\Users\Wil\Documents\Septiembre\gym-pro"
Remove-Item -Recurse -Force dist
```

### Compilar como producción
```powershell
ng build
```

### Verificar que se compiló correctamente
```powershell
Test-Path ".\dist\gym-pro\browser\index.html"
```

Si la última línea muestra "True", ¡todo está bien!

---

## Comandos de Verificación

### Verificar que vercel.json existe
```powershell
Test-Path ".\vercel.json"
```

### Verificar todos los archivos de configuración
```powershell
powershell -ExecutionPolicy Bypass -File verify-vercel-setup.ps1
```

### Ver estado de Git
```powershell
git status
```

### Ver commits pendientes
```powershell
git log --oneline -5
```

---

## Después del Deployment

### Ver URL de tu app
1. Abre https://vercel.com/dashboard
2. Click en "gym-pro"
3. Verás algo como: `https://gym-pro-xxx.vercel.app`

### Ver logs de deployment
```powershell
vercel logs
```

### Redeploy (si necesitas)
```powershell
vercel --prod
```

### Ver dominio personalizado (opcional)
1. Dashboard → Gym Pro project
2. Settings → Domains
3. Añade tu dominio personalizado

---

## Solución de Problemas

### Si algo falla en el deployment:

1. **Revisa los logs en Vercel:**
   - Dashboard → Deployments → Click en el deployment fallido
   - Ver "Build Logs"

2. **Verifica localmente:**
   ```powershell
   Remove-Item -Recurse -Force dist
   ng build
   ```

3. **Si los logs muestran error con pnpm:**
   ```powershell
   pnpm install
   pnpm run build
   ```

4. **Si hay error de outputDirectory:**
   - Verifica que `dist/gym-pro/browser/index.html` existe después de compilar

---

## Comandos Útiles para el Futuro

### Actualizar código y redeploy
```powershell
git add .
git commit -m "Tu mensaje aquí"
git push origin main
# Vercel automáticamente hace el deploy
```

### Ver ambiente de variables
```powershell
vercel env ls
```

### Añadir variable de entorno
```powershell
vercel env add NOMBRE_VARIABLE
```

### Listar tus proyectos en Vercel
```powershell
vercel projects ls
```

---

## 📞 Links Importantes

- **Dashboard de Vercel:** https://vercel.com/dashboard
- **Documentación:** https://vercel.com/docs
- **Pricing:** https://vercel.com/pricing
- **Tu proyecto:** https://vercel.com/dashboard/gym-pro (después del primer deploy)

---

## ✅ Checklist Final

Antes de ejecutar los comandos, asegúrate de:

- [ ] He revisado DEPLOYMENT_VERCEL.md
- [ ] He verificado que vercel.json existe
- [ ] He hecho git add . y git commit localmente (opcional)
- [ ] Mi código está en GitHub
- [ ] Tengo cuenta en Vercel (https://vercel.com)
- [ ] Tengo GitHub conectado a Vercel

¡Listo para deployar! 🚀
