// --- SECCIÓN DE IMPORTACIONES: Cargamos las herramientas y configuraciones necesarias ---

// Importamos la interfaz 'ApplicationConfig' para asegurar la estructura correcta de nuestro objeto de configuración.
import { ApplicationConfig } from '@angular/core';

// Importamos la función 'provideRouter' para configurar el sistema de enrutamiento de la aplicación.
import { provideRouter } from '@angular/router';

// Importamos funciones de AngularFire: 'provideFirebaseApp' para registrar el servicio y 'initializeApp' para la conexión inicial.
import { provideFirebaseApp, initializeApp  } from '@angular/fire/app';

// Importamos las herramientas para el módulo de Autenticación: 'provideAuth' registra y 'getAuth' obtiene la instancia del servicio.
import { provideAuth, getAuth } from '@angular/fire/auth';

// Análogamente, importamos las herramientas para el servicio de base de datos Firestore.
import { provideFirestore, getFirestore  } from '@angular/fire/firestore';

// Importamos nuestro array de rutas, que es la configuración de navegación definida localmente.
import { routes } from './app.routes';

// Importamos el objeto de configuración del entorno actual (que será reemplazado en producción).
import { environment } from '../environments/environment';

// --- SECCIÓN DE CONFIGURACIÓN PRINCIPAL DE LA APLICACIÓN ---

// Exportamos el objeto de configuración principal, tipado con 'ApplicationConfig' para seguridad de tipos.
export const appConfig: ApplicationConfig = {
  // El array 'providers' registra los servicios globales en el sistema de Inyección de Dependencias de Angular.
  providers: [
    // 1. Activamos el enrutador de Angular, pasándole nuestro mapa de rutas.
    provideRouter(routes),

    // 2. Inicializamos la conexión principal a Firebase usando las credenciales del archivo de entorno.
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // 3. Habilitamos el servicio de Autenticación de Firebase para que esté disponible en toda la app.
    provideAuth(() => getAuth()),

    // 4. Habilitamos el servicio de base de datos Firestore para poder interactuar con ella.
    provideFirestore(() => getFirestore())
  ]
};