/**
 * Script para generar archivos de ambiente desde variables de entorno
 * Se ejecuta antes del build en Vercel
 * 
 * Uso: node scripts/generate-env.js
 */

const fs = require('fs');
const path = require('path');

// Directorio de environments
const envDir = path.join(__dirname, '../src/environments');

// Crear el directorio si no existe
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Valores por defecto (fallback)
const defaultEnv = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.firebasestorage.app',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:1e6f0280feb1dad343a486'
};

// Leer variables de entorno o usar defaults
const firebaseConfig = {
  apiKey: process.env.NG_APP_FIREBASE_API_KEY || defaultEnv.apiKey,
  authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN || defaultEnv.authDomain,
  projectId: process.env.NG_APP_FIREBASE_PROJECT_ID || defaultEnv.projectId,
  storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET || defaultEnv.storageBucket,
  messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID || defaultEnv.messagingSenderId,
  appId: process.env.NG_APP_FIREBASE_APP_ID || defaultEnv.appId
};

// Generar environment.prod.ts
const prodContent = `export const environment = {
  production: true,
  firebase: {
    apiKey: "${firebaseConfig.apiKey}",
    authDomain: "${firebaseConfig.authDomain}",
    projectId: "${firebaseConfig.projectId}",
    storageBucket: "${firebaseConfig.storageBucket}",
    messagingSenderId: "${firebaseConfig.messagingSenderId}",
    appId: "${firebaseConfig.appId}"
  }
};
`;

// Generar environment.ts (development)
const devContent = `export const environment = {
  production: false,
  firebase: {
    apiKey: "${firebaseConfig.apiKey}",
    authDomain: "${firebaseConfig.authDomain}",
    projectId: "${firebaseConfig.projectId}",
    storageBucket: "${firebaseConfig.storageBucket}",
    messagingSenderId: "${firebaseConfig.messagingSenderId}",
    appId: "${firebaseConfig.appId}"
  }
};
`;

// Escribir archivos
try {
  fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), prodContent);
  console.log('✅ environment.prod.ts generated successfully');
  
  fs.writeFileSync(path.join(envDir, 'environment.ts'), devContent);
  console.log('✅ environment.ts generated successfully');
  
  console.log('Firebase configuration:');
  console.log(`  - projectId: ${firebaseConfig.projectId}`);
  console.log(`  - authDomain: ${firebaseConfig.authDomain}`);
  console.log(`  - Using ${process.env.NG_APP_FIREBASE_API_KEY ? 'environment variables' : 'default values'}`);
} catch (error) {
  console.error('❌ Error generating environment files:', error);
  process.exit(1);
}
