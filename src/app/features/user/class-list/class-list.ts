import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common'; // Importamos AsyncPipe
import { Class } from '../services/class'; // Nuestro servicio de Clases
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

  // Creamos un observable que contendrá la lista de clases.
  // El '$' al final del nombre es una convención para indicar que es un Observable.
  public classes$: Observable<ClassModel[]>;

  constructor() {
    // En el constructor, llamamos al método del servicio para obtener las clases.
    this.classes$ = this.classService.getClasses();
  }
}