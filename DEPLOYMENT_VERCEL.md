# GymPro - Deployment en Vercel

Este documento describe cómo deployar la aplicación GymPro en Vercel de manera gratuita.

## ✅ Checklist de Preparación

- [x] `vercel.json` configurado en la raíz
- [x] `.vercelignore` creado
- [x] `.gitignore` actualizado
- [x] `environment.prod.ts` configurado
- [x] `package.json` con scripts correctos
- [x] `angular.json` optimizado para producción

## 🚀 Opción 1: Deployment vía GitHub (Recomendado)

1. **Asegúrate de que tu código esté en GitHub:**
   ```bash
   git add .
   git commit -m "Configuración para Vercel"
   git push origin main
   ```

2. **Ve a https://vercel.com/new**

3. **Selecciona "Import Git Repository"**

4. **Busca y selecciona el repositorio `gym-pro`**

5. **Vercel detectará automáticamente:**
   - Framework: null (configuración manual)
   - Build Command: `ng build`
   - Output Directory: `dist/gym-pro/browser`
   - Install Command: `pnpm install`

6. **Click en "Deploy"**

7. **Tu app estará en vivo en una URL como:** `https://gym-pro-xxx.vercel.app`

## 🚀 Opción 2: Deployment vía CLI

1. **Instala Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Navega a tu proyecto:**
   ```powershell
   cd C:\Users\Wil\Documents\Septiembre\gym-pro
   ```

3. **Login en Vercel:**
   ```powershell
   vercel login
   ```

4. **Deploy a producción:**
   ```powershell
   vercel --prod
   ```

5. **Tu app estará en vivo en unos segundos**

## 🔧 Configuración de Vercel JSON

El archivo `vercel.json` incluye:

- **Build Command:** `ng build` - Compila Angular para producción
- **Output Directory:** `dist/gym-pro/browser` - Carpeta de salida
- **Install Command:** `pnpm install` - Instala dependencias con pnpm
- **Rewrites:** Todas las rutas van a `index.html` (SPA)
- **Headers:** Headers de seguridad
- **Clean URLs:** Las URLs se sirven sin extensión `.html`
- **Trailing Slash:** No añade `/` al final de URLs
- **Region:** `iad1` (Virginia, USA - GRATIS en Hobby)

## 📋 Variables de Entorno (si necesitas en el futuro)

Si necesitas variables de entorno adicionales:

1. Ve a tu proyecto en https://vercel.com/dashboard
2. Settings → Environment Variables
3. Añade tu variable (ej: `FIREBASE_API_KEY`)
4. Selecciona "Production" y/o "Preview"
5. Guarda

Luego accede desde tu código:
```typescript
const apiKey = process.env['FIREBASE_API_KEY'];
```

## 🧪 Prueba Local Antes de Deployar

```powershell
# Limpia builds anteriores
Remove-Item -Recurse -Force dist

# Compila como producción (lo que Vercel hará)
ng build

# Verifica que el build sea exitoso
ls dist\gym-pro\browser\index.html
```

## 📊 Límites del Plan Gratuito (Hobby)

### ✅ Incluido Gratis:
- Deployments ilimitados
- CDN global automático
- HTTPS certificado
- 1M Edge Requests/mes
- 100 GB Fast Data Transfer/mes
- Domains y redirects personalizados
- Headers y rewrites
- Observabilidad básica

### ❌ No incluido en Hobby:
- Funciones Vercel (máx 10 segundos)
- Múltiples regiones
- No puedes exceder 6 builds simultáneos

## 🔗 Recursos Útiles

- [Documentación oficial de Vercel](https://vercel.com/docs)
- [Vercel JSON Configuration](https://vercel.com/docs/project-configuration)
- [Angular Deployment](https://angular.dev/guide/deployment)
- [Vercel Pricing](https://vercel.com/pricing)

## 💡 Notas Importantes

1. **Firebase está en el código en tiempo de compilación** - Es seguro tener las API keys en `environment.prod.ts` ya que son keys públicas de Firebase.

2. **Angular SSR no está habilitado** - Tu aplicación se sirve como SPA estática, lo cual es perfecto para Vercel gratuito.

3. **Las rewrites garantizan que el router de Angular maneje todas las rutas** - Sin esto, las URLs profundas fallarían.

4. **Todos los headers de seguridad están configurados** - Vercel automáticamente añade estos headers.

---

**¿Preguntas? Revisa la documentación oficial de Vercel o tu panel de control en https://vercel.com/dashboard**
