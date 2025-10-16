import { Component, inject } from '@angular/core';
import { Class } from '../services/class';
import { Reservation } from '../services/reservation';
import { Class as ClassModel } from '../../../models/class';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [],
  templateUrl: './class-list.html'
})
export class ClassList {
  private classService = inject(Class);
  private reservationService = inject(Reservation);

  // Leemos el Signal directamente del servicio. No más lógica de carga aquí.
  public classes = this.classService.classes;

  // onReserve ahora solo se preocupa de crear la reserva.
  // El servicio se encargará de que la UI se actualice sola.
  async onReserve(classItem: ClassModel) {
    try {
      await this.reservationService.createReservation(classItem);
      alert('¡Tu reserva ha sido creada! Revisa la sección "Mis Reservas".');
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert('Hubo un error al crear tu reserva.');
    }
  }
}