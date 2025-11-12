// --- SECCIÓN DE IMPORTACIONES ---
import { Component, inject, computed } from '@angular/core';
import { NgClass } from '@angular/common'; // Importamos NgClass para poder usar clases condicionales en el HTML.
import { Reservation } from '../services/reservation'; // Importamos el servicio que maneja la lógica de las reservas.
import { Class } from '../services/class'; // Importamos el servicio que maneja la lógica de las clases.
import { Reservation as ReservationModel } from '../../../models/reservation'; // Importamos el "molde" o interfaz para un objeto Reservation.
import { Class as ClassModel } from '../../../models/class'; // Importamos la interfaz para un objeto Class.

/**
 * Creamos una nueva interfaz que extiende el modelo de Reserva.
 * Su propósito es combinar una reserva con los detalles completos de la clase a la que pertenece,
 * para poder mostrar fácilmente el nombre, entrenador, etc., en la vista.
 */
export interface ReservationWithClass extends ReservationModel {
  classDetails: ClassModel;
}

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [NgClass], // Hacemos NgClass disponible en la plantilla de este componente.
  templateUrl: './my-reservations.html'
})
export class MyReservations {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  // Inyectamos los servicios necesarios para obtener los datos de las reservas y las clases.
  private reservationService = inject(Reservation);
  private classService = inject(Class);

  // --- SIGNAL COMPUTADO PARA DATOS DERIVADOS ---
  // 'reservations' es un 'computed signal'. Es un valor reactivo que se recalcula automáticamente
  // cada vez que uno de los signals de los que depende (`reservationService.reservations()` o `classService.classes()`) cambia.
  public reservations = computed(() => {
    // 1. Obtenemos el valor actual del signal de reservas del usuario.
    const userReservations = this.reservationService.reservations();
    // 2. Obtenemos el valor actual del signal que contiene TODAS las clases.
    const all_classes = this.classService.classes();

    // 3. Combinamos los dos arrays.
    return userReservations.map(res => {
      // Para cada reserva del usuario, buscamos la clase correspondiente en el array de clases.
      const classDetails = all_classes.find(c => c.id === res.classId);
      // Creamos un nuevo objeto que contiene toda la información de la reserva (...res)
      // y le añadimos la propiedad 'classDetails' con la información completa de la clase.
      return { ...res, classDetails: classDetails! }; // El '!' indica que estamos seguros de que siempre encontrará una clase.
    }).filter(res => res.classDetails); // Filtramos por si acaso alguna reserva apunta a una clase que ya no existe.
  });

  /**
   * Maneja el evento de clic para cancelar una reserva.
   *El ID del documento de la reserva que se va a eliminar.
   */
  async handleCancel(reservationId: string) {
    // Usamos un 'confirm' del navegador para verificar que el usuario realmente quiere cancelar.
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      try {
        // Llamamos al método 'deleteReservation' del servicio, que contiene la lógica de negocio (la transacción).
        await this.reservationService.deleteReservation(reservationId);
        
        // ¡Magia Reactiva! No necesitamos hacer nada más para actualizar la vista.
        // 1. El servicio elimina el documento en Firestore.
        // 2. El listener en el constructor del servicio detecta el cambio.
        // 3. El signal `_reservations` en el servicio se actualiza.
        // 4. Nuestro `computed signal` en este componente se da cuenta del cambio y se recalcula.
        // 5. Angular actualiza la vista automáticamente.
        alert('Reserva cancelada con éxito.');
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        alert('Hubo un error al intentar cancelar la reserva.');
      }
    }
  }
}