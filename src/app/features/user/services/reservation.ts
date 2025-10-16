// src/app/features/user/services/reservation.ts

import { Injectable, inject, signal, runInInjectionContext, Injector } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
  doc,
  deleteDoc,
  runTransaction,
  increment,
  getDocs // --- ¡NUEVO! --- Importamos getDocs para la consulta única
} from '@angular/fire/firestore';
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
  private injector = inject(Injector);

  private readonly _reservations = signal<ReservationModel[]>([]);
  public readonly reservations = this._reservations.asReadonly();

  constructor() {
    runInInjectionContext(this.injector, () => {
      authState(this.auth).pipe(
        switchMap(user => {
          if (user) {
            const reservationCollection = collection(this.firestore, 'reservations');
            const q = query(reservationCollection, where("userId", "==", user.uid));
            return collectionData(q, { idField: 'id' }) as Observable<ReservationModel[]>;
          } else {
            return of([]);
          }
        })
      ).subscribe(reservationsData => {
        this._reservations.set(reservationsData);
      });
    });
  }

  async createReservation(classItem: ClassModel) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado.');
    if (!classItem.id) throw new Error('ID de clase no válido.');

    const classDocRef = doc(this.firestore, `classes/${classItem.id}`);
    const reservationCollection = collection(this.firestore, 'reservations');

    return runTransaction(this.firestore, async (transaction) => {
      // --- ¡CAMBIO CLAVE! --- Verificación de reserva duplicada
      const existingReservationQuery = query(
        reservationCollection,
        where('userId', '==', user.uid),
        where('classId', '==', classItem.id),
        where('status', 'in', ['CONFIRMADA', 'PENDIENTE_PAGO']) // Solo consideramos reservas activas
      );
      
      // Usamos getDocs para ejecutar la consulta directamente
      const existingReservationsSnapshot = await getDocs(existingReservationQuery);

      if (!existingReservationsSnapshot.empty) {
        throw new Error('¡Ya tienes una reserva activa para esta clase!');
      }
      // --- Fin del cambio clave ---

      const classDoc = await transaction.get(classDocRef);

      if (!classDoc.exists()) {
        throw new Error("¡La clase ya no existe!");
      }

      const currentBookedSlots = classDoc.data()['bookedSlots'] || 0;
      const totalSlots = classDoc.data()['totalSlots'];

      if (currentBookedSlots >= totalSlots) {
        throw new Error("¡Lo sentimos, ya no hay cupos disponibles para esta clase!");
      }
      
      const newReservationData: Omit<ReservationModel, 'id'> = {
        userId: user.uid,
        classId: classItem.id!,
        status: 'CONFIRMADA',
        createdAt: new Date()
      };
      const newReservationRef = doc(reservationCollection);
      transaction.set(newReservationRef, newReservationData);

      transaction.update(classDocRef, {
        bookedSlots: increment(1)
      });
    });
  }

  deleteReservation(reservationId: string) {
    const reservationDocRef = doc(this.firestore, `reservations/${reservationId}`);
    
    return runTransaction(this.firestore, async (transaction) => {
        const reservationDoc = await transaction.get(reservationDocRef);
        
        if (!reservationDoc.exists()) {
            throw new Error("La reserva que intentas cancelar no existe.");
        }

        const classId = reservationDoc.data()['classId'];
        const classDocRef = doc(this.firestore, `classes/${classId}`);

        transaction.delete(reservationDocRef);

        transaction.update(classDocRef, {
            bookedSlots: increment(-1)
        });
    });
  }
}