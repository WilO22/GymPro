import { Injectable, inject } from '@angular/core';
// 1. Importa 'query' y 'where' para poder filtrar
import { Firestore, collection, addDoc, query, where, collectionData } from '@angular/fire/firestore';
import { Auth as FirebaseAuth } from '@angular/fire/auth';
import { Reservation as ReservationModel } from '../../../models/reservation';
import { Class as ClassModel } from '../../../models/class';
import { Observable, of } from 'rxjs'; // Importamos 'of' para un caso especial

@Injectable({
  providedIn: 'root'
})
export class Reservation {
  private firestore: Firestore = inject(Firestore);
  private auth: FirebaseAuth = inject(FirebaseAuth);

  // --- MÉTODO PARA OBTENER LAS RESERVAS DEL USUARIO ACTUAL ---
  getUserReservations(): Observable<ReservationModel[]> {
    const user = this.auth.currentUser;
    if (!user) {
      // Si no hay usuario, devolvemos un observable de un array vacío.
      return of([]);
    }

    // 2. Creamos una consulta (query) a la colección 'reservations'
    const reservationCollection = collection(this.firestore, 'reservations');
    const q = query(reservationCollection, where("userId", "==", user.uid));

    // 3. Usamos collectionData con nuestra consulta para obtener los datos en tiempo real
    return collectionData(q, { idField: 'id' }) as Observable<ReservationModel[]>;
  }

  // --- MÉTODO PARA CREAR UNA NUEVA RESERVA (sin cambios) ---
  async createReservation(classItem: ClassModel) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado.');
    }
    const newReservation: Partial<ReservationModel> = {
      userId: user.uid,
      classId: classItem.id,
      status: 'PENDIENTE_PAGO',
      createdAt: new Date()
    };
    const reservationCollection = collection(this.firestore, 'reservations');
    return addDoc(reservationCollection, newReservation);
  }
}