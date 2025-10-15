import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router'; // Importa UrlTree
import { Auth as FirebaseAuth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

// La función ahora es 'async' y devuelve una Promesa
export const adminGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
  const auth = inject(FirebaseAuth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  // Esperamos a tener una respuesta definitiva del estado de autenticación
  const user = await firstValueFrom(authState(auth));

  if (user) {
    const userDocRef = doc(firestore, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists() && userDocSnap.data()['role'] === 'admin') {
      return true; // ¡PERMITIDO! Es admin.
    } else {
      // NO PERMITIDO. No es admin.
      // Devolvemos un 'UrlTree' para redirigir al dashboard.
      return router.parseUrl('/dashboard');
    }
  } else {
    // NO PERMITIDO. No hay sesión iniciada.
    // Devolvemos un 'UrlTree' para redirigir al login.
    return router.parseUrl('/login');
  }
};