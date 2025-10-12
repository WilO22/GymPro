import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth as FirebaseAuth } from '@angular/fire/auth';
import { Reservation as ReservationModel } from '../../../models/reservation';
import { Class as ClassModel } from '../../../models/class';

@Injectable({
  providedIn: 'root'
})
export class Reservation {
  private firestore: Firestore = inject(Firestore);
  private auth: FirebaseAuth = inject(FirebaseAuth);

  // --- MÉTODO PARA CREAR UNA NUEVA RESERVA ---
  async createReservation(classItem: ClassModel) {
    // Obtenemos el usuario actual
    const user = this.auth.currentUser;

    // Si no hay usuario, no podemos hacer nada.
    if (!user) {
      throw new Error('Usuario no autenticado.');
    }

    // Creamos el objeto de la nueva reserva usando nuestras interfaces
    const newReservation: Partial<ReservationModel> = {
      userId: user.uid,
      classId: classItem.id,
      status: 'PENDIENTE_PAGO', // Toda reserva empieza como pendiente
      createdAt: new Date()
    };

    // Obtenemos una referencia a la colección 'reservations'
    const reservationCollection = collection(this.firestore, 'reservations');

    // addDoc es la función de Firebase para añadir un nuevo documento
    return addDoc(reservationCollection, newReservation);
  }
}