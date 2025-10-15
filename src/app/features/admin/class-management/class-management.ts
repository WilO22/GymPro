import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

// Importamos el SERVICIO DE LECTURA del usuario para OBTENER las clases
import { Class as ClassService } from '../../user/services/class'; 
// Importamos el MODELO para saber la forma de los datos
import { Class as ClassModel } from '../../../models/class'; 

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './class-management.html'
})
export class ClassManagement {
  // Inyectamos el servicio que sabe cómo OBTENER las clases
  private classService = inject(ClassService);

  // Creamos el observable que contendrá la lista de clases para el HTML
  public classes$: Observable<ClassModel[]>;

  constructor() {
    // Le pedimos al servicio que nos traiga todas las clases
    this.classes$ = this.classService.getClasses();
  }

  // Dejamos estas funciones listas para conectarlas más adelante
  createClass() { 
    console.log('Botón "Crear Clase" presionado.'); 
  }
  editClass(classItem: ClassModel) { 
    console.log('Editando clase:', classItem); 
  }
  deleteClass(classItem: ClassModel) { 
    console.log('Eliminando clase:', classItem); 
  }
}