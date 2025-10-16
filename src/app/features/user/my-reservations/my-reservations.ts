import { Component, inject, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { Reservation } from '../services/reservation';
import { Class } from '../services/class';
import { Reservation as ReservationModel } from '../../../models/reservation';
import { Class as ClassModel } from '../../../models/class';

export interface ReservationWithClass extends ReservationModel {
  classDetails: ClassModel;
}

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [NgClass],
  templateUrl: './my-reservations.html'
})
export class MyReservations {
  private reservationService = inject(Reservation);
  private classService = inject(Class);

  // Al corregir los servicios, TypeScript ahora sabe que `reservations()` y `classes()`
  // devuelven arrays tipados, por lo que los errores de 'any' desaparecen.
  public reservations = computed(() => {
    const userReservations = this.reservationService.reservations();
    const all_classes = this.classService.classes();

    return userReservations.map(res => {
      const classDetails = all_classes.find(c => c.id === res.classId);
      return { ...res, classDetails: classDetails! };
    }).filter(res => res.classDetails);
  });


  // --- ¡NUEVO! ---
  // Método para manejar la cancelación de una reserva.
  async handleCancel(reservationId: string) {
    // Usamos un simple 'confirm' del navegador para verificar la acción del usuario.
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      try {
        // Llamamos al método 'deleteReservation' del servicio, pasándole el ID.
        await this.reservationService.deleteReservation(reservationId);
        // No necesitamos hacer nada más. El servicio detectará el cambio en Firestore
        // y nuestro 'computed signal' se actualizará automáticamente, refrescando la vista.
        alert('Reserva cancelada con éxito.');
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        alert('Hubo un error al intentar cancelar la reserva.');
      }
    }
  }
  
}