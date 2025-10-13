import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';

import { Reservation } from '../services/reservation';
import { Class } from '../services/class';
import { Reservation as ReservationModel } from '../../../models/reservation';
import { Class as ClassModel } from '../../../models/class';

// Creamos una nueva interfaz para combinar los datos
export interface ReservationWithClass extends ReservationModel {
  classDetails: ClassModel;
}

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './my-reservations.html'
})
export class MyReservations {
  private reservationService = inject(Reservation);
  private classService = inject(Class);

  // Creamos un Observable que contendrá las reservas combinadas con los detalles de la clase
  public reservations$: Observable<ReservationWithClass[]>;

  constructor() {
    const reservations$ = this.reservationService.getUserReservations();
    const classes$ = this.classService.getClasses();

    // combineLatest es una función que toma dos "canales de noticias" (Observables)
    // y nos da el último valor de ambos en cuanto los dos hayan emitido algo.
    this.reservations$ = combineLatest([reservations$, classes$]).pipe(
      map(([reservations, classes]) => {
        // Una vez que tenemos ambas listas, las "cruzamos".
        return reservations.map(res => {
          // Para cada reserva, buscamos la clase correspondiente por su ID.
          const classDetails = classes.find(c => c.id === res.classId);
          // Devolvemos un nuevo objeto que contiene la reserva Y los detalles de la clase.
          return { ...res, classDetails: classDetails! };
        });
      })
    );
  }
}