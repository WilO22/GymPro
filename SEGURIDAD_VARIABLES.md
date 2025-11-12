# 🔐 CONFIGURACIÓN SEGURA DE VARIABLES DE ENTORNO

## Problema
Los archivos `environment.prod.ts` y `environment.ts` contienen claves de Firebase y no deben subirse a GitHub.

## Solución

### 1. Local Development

Copia los archivos de ejemplo con tus valores reales:

```bash
cp src/environments/environment.ts.example src/environments/environment.ts
cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts
```

Luego edita ambos archivos con tus claves de Firebase reales:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBj-IbW-oXASbriQT4PKAKV2tvVDSvyflY",  // TU CLAVE REAL
    authDomain: "gympro-app-e95e0.firebaseapp.com",
    projectId: "gympro-app-e95e0",
    storageBucket: "gympro-app-e95e0.firebasestorage.app",
    messagingSenderId: "739219003379",
    appId: "1:739219003379:web:1e6f0280feb1dad343a486"
  }
};
```

### 2. Vercel Deployment

**OPCIÓN A: Variables de Entorno (RECOMENDADO)**

En el dashboard de Vercel:
1. Va a Project Settings → Environment Variables
2. Agrega estas variables con TUS VALORES:
   ```
   NG_APP_FIREBASE_API_KEY = AIzaSyBj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NG_APP_FIREBASE_AUTH_DOMAIN = tu-proyecto.firebaseapp.com
   NG_APP_FIREBASE_PROJECT_ID = tu-proyecto-id
   NG_APP_FIREBASE_STORAGE_BUCKET = tu-proyecto.firebasestorage.app
   NG_APP_FIREBASE_MESSAGING_SENDER_ID = 1234567890
   NG_APP_FIREBASE_APP_ID = 1:1234567890:web:abc123def456
   ```

**OPCIÓN B: Archivo .env.local en Vercel**

1. En tu repositorio, crea `.env.local` en la raíz:
   ```
   NG_APP_FIREBASE_API_KEY=AIzaSyBj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NG_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   NG_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
   NG_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
   NG_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
   NG_APP_FIREBASE_APP_ID=1:1234567890:web:abc123def456
   ```

2. Este archivo ya está en `.gitignore`, así que NO se subirá a GitHub

### 3. Build en Vercel

Vercel leerá estas variables durante el build y las inyectará en tu código.

El `environment.prod.ts` usará esta lógica:
```typescript
const firebaseApiKey = (globalThis as any)['NG_APP_FIREBASE_API_KEY'] || "default_value";
```

## Resumen de Seguridad

✅ **Seguro:**
- Archivos `.ts` reales en `.gitignore`
- Archivos `.ts.example` en el repositorio (sin datos sensibles)
- Variables de entorno solo en Vercel (no en GitHub)

❌ **Inseguro:**
- Subir `environment.prod.ts` o `environment.ts` a GitHub
- Escribir claves en el código fuente

## Para Otros Colaboradores

1. Clona el repositorio
2. Copia los archivos de ejemplo:
   ```bash
   cp src/environments/environment.ts.example src/environments/environment.ts
   cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts
   ```
3. Completa con tus claves de Firebase (obtenidas del proyecto Firebase)
4. ¡Listo! Los archivos `.ts` están en `.gitignore`, nunca se subirán

## Próximos Pasos

1. Copia los archivos de ejemplo localmente
2. Completa con tus datos
3. Haz `git push` (solo irán los archivos `.example`)
4. En Vercel: Project Settings → Environment Variables
5. Agrega las 6 variables de Firebase
6. Redeploy

¡Listo! Tu app estará segura y funcional. 🚀
