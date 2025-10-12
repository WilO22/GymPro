import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common'; // Importamos AsyncPipe
import { Class } from '../services/class'; // Nuestro servicio de Clases
import { Reservation } from '../services/reservation';
import { Class as ClassModel } from '../../../models/class'; // Nuestra interfaz/modelo
import { Observable } from 'rxjs';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [AsyncPipe], // Lo necesitamos para el 'pipe' | async en el HTML
  templateUrl: './class-list.html'
})
export class ClassList {
  // Inyectamos nuestro servicio de Clases
  private classService = inject(Class);
  private reservationService = inject(Reservation); // <-- 2. Inyéctalo aquí

  // Creamos un observable que contendrá la lista de clases.
  // El '$' al final del nombre es una convención para indicar que es un Observable.
  public classes$: Observable<ClassModel[]>;

  constructor() {
    // En el constructor, llamamos al método del servicio para obtener las clases.
    this.classes$ = this.classService.getClasses();
  }

  // --- 3. NUEVO MÉTODO PARA MANEJAR LA RESERVA ---
  async onReserve(classItem: ClassModel) {
    try {
      // Llama al método de nuestro servicio de reservas
      const docRef = await this.reservationService.createReservation(classItem);
      console.log("¡Reserva creada con éxito! ID del documento:", docRef.id);
      alert('¡Tu reserva ha sido creada! Revisa la sección "Mis Reservas" para continuar con el pago.');
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert('Hubo un error al crear tu reserva. Por favor, intenta de nuevo.');
    }
  }
}