import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Auth as FirebaseAuth, authState } from '@angular/fire/auth';
import { Reservation as ReservationModel } from '../../../models/reservation';
import { Class as ClassModel } from '../../../models/class';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Reservation {
  private firestore: Firestore = inject(Firestore);
  private auth: FirebaseAuth = inject(FirebaseAuth);

  // 1. Creamos un Signal PRIVADO y escribible. Nadie fuera de este servicio puede modificarlo.
  private readonly _reservations = signal<ReservationModel[]>([]);
  // 2. Exponemos una versión PÚBLICA y de SOLO LECTURA del signal.
  public readonly reservations = this._reservations.asReadonly();

  constructor() {
    // 3. En el constructor, nos suscribimos al flujo de datos de Firebase.
    authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          // Si hay usuario, obtenemos sus reservas en tiempo real.
          const reservationCollection = collection(this.firestore, 'reservations');
          const q = query(reservationCollection, where("userId", "==", user.uid));
          return collectionData(q, { idField: 'id' }) as Observable<ReservationModel[]>;
        } else {
          // Si no hay usuario, devolvemos un array vacío.
          return of([]);
        }
      })
    ).subscribe(reservationsData => {
      // 4. CADA VEZ que Firebase nos envía una lista actualizada (ya sea por carga inicial o un cambio),
      // actualizamos nuestro signal privado con .set().
      this._reservations.set(reservationsData);
    });
  }

  // El método para crear una reserva no necesita cambios. Al ejecutarse, Firestore
  // notificará a nuestra suscripción en el constructor, y el signal se actualizará solo.
  async createReservation(classItem: ClassModel) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado.');

    const newReservation: Omit<ReservationModel, 'id'> = {
      userId: user.uid,
      classId: classItem.id!,
      status: 'PENDIENTE_PAGO',
      createdAt: new Date()
    };
    const reservationCollection = collection(this.firestore, 'reservations');
    return addDoc(reservationCollection, newReservation);
  }

  // Lo mismo para borrar. Al eliminar el documento, Firestore avisará y el signal se actualizará.
  deleteReservation(reservationId: string) {
    const reservationDocRef = doc(this.firestore, `reservations/${reservationId}`);
    return deleteDoc(reservationDocRef);
  }
}