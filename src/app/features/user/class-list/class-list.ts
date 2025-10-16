// src/app/features/user/class-list/class-list.ts

import { Component, inject } from '@angular/core';
// --- ¡NUEVO! --- Importamos CommonModule para tener acceso a pipes como 'currency'.
import { CommonModule } from '@angular/common';
import { Class } from '../services/class';
import { Reservation } from '../services/reservation';
import { Class as ClassModel } from '../../../models/class';

@Component({
  selector: 'app-class-list',
  standalone: true,
  // --- ¡CAMBIO CLAVE! --- Añadimos CommonModule a los imports del componente.
  imports: [CommonModule],
  templateUrl: './class-list.html'
})
export class ClassList {
  private classService = inject(Class);
  private reservationService = inject(Reservation);

  public classes = this.classService.classes;

  async onReserve(classItem: ClassModel) {
    try {
      await this.reservationService.createReservation(classItem);
      alert('¡Tu reserva ha sido creada! Revisa la sección "Mis Reservas".');
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Hubo un error inesperado al crear tu reserva.');
      }
    }
  }
}