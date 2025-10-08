// --- SECCIÓN DE IMPORTACIONES: Cargamos las herramientas necesarias para el guardián ---

// Importamos la función 'inject' del núcleo de Angular para solicitar dependencias.
import { inject } from '@angular/core';
// Importamos 'CanActivateFn' es una interfaz para definir el tipo de nuestra función guardián y 'Router' para redirigir.
import { CanActivateFn, Router } from '@angular/router';
// Importamos la clase 'Auth' de Firebase, que representa el servicio de autenticación principal.
// Usamos el alias 'FirebaseAuth' para evitar conflictos con nuestro propio servicio 'Auth' si lo hubiere.
// También importamos 'authState', una función que devuelve un Observable con el estado del usuario.
import { Auth as FirebaseAuth, authState } from '@angular/fire/auth';
// Importamos el operador 'map' de RxJS para transformar los datos emitidos por el Observable.
import { map } from 'rxjs/operators';

// --- DEFINICIÓN DEL GUARDIÁN DE RUTA ---

// Exportamos la función 'authGuard'. El tipo 'CanActivateFn' asegura que tenga la firma correcta que el Router espera.
export const authGuard: CanActivateFn = (route, state) => {
  // Inyectamos las dependencias necesarias: el servicio de autenticación de Firebase...
  const auth = inject(FirebaseAuth);
  // ...y el servicio Router de Angular para poder redirigir.
  const router = inject(Router);

  // Llamamos a 'authState' para obtener un Observable que emite el estado de autenticación del usuario.
  // Un Observable es un flujo de datos asíncrono que podemos observar a lo largo del tiempo.
  return authState(auth).pipe(
    // El método '.pipe()' nos permite encadenar operadores de RxJS para procesar los datos del Observable.
    map(user => {
      // El operador 'map' recibe el valor emitido por authState (el objeto 'user' o 'null').
      // Su trabajo es transformar ese valor en un booleano (true o false).

      // Verificamos si el objeto 'user' existe.
      if (user) {
        // Si 'user' no es nulo, el usuario está autenticado. Devolvemos 'true' para permitir el acceso.
        return true;
      } else {
        // Si 'user' es nulo, el usuario no está autenticado.
        // Como efecto secundario, lo redirigimos a la página de login.
        router.navigate(['/login']);
        // Devolvemos 'false' para bloquear la navegación a la ruta protegida.
        return false;
      }
    })
  );
};