import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth as FirebaseAuth, authState } from '@angular/fire/auth';
// 1. Importamos DocumentReference para forzar el tipo
import { Firestore, doc, docData, DocumentReference } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { User } from '../../models/user';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(FirebaseAuth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    switchMap(user => {
      if (user) {
        // 2. Forzamos el tipo de la referencia, diciéndole a TypeScript qué esperar.
        const userDocRef = doc(firestore, `users/${user.uid}`) as DocumentReference<User>;

        // Ahora, docData sabe que recibirá una referencia que coincide con su expectativa.
        return docData(userDocRef).pipe(
          map(userProfile => {
            if (userProfile && userProfile.role === 'admin') {
              return true;
            } else {
              return router.createUrlTree(['/dashboard']);
            }
          })
        );
      } else {
        return of(router.createUrlTree(['/login']));
      }
    })
  );
};