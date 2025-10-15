import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
// 1. Importamos herramientas de RxJS para manejar el flujo de datos
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

import { Class as ClassReaderService } from '../../user/services/class';
import { Class as ClassAdminService } from '../services/class';
import { Class as ClassModel } from '../../../models/class';
import { ClassForm } from '../components/class-form/class-form';

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [AsyncPipe, ClassForm],
  templateUrl: './class-management.html'
})
export class ClassManagement {
  private classReaderService = inject(ClassReaderService);
  private classAdminService = inject(ClassAdminService);

  // 2. Creamos un "disparador" (trigger) para refrescar los datos.
  // Un BehaviorSubject es como un tablón de anuncios que siempre tiene un valor.
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  public classes$: Observable<ClassModel[]>;
  public isModalVisible = false;

  constructor() {
    // 3. Ahora, classes$ escucha a nuestro disparador.
    // Cada vez que el disparador emita un valor, switchMap cancelará la
    // petición anterior y hará una nueva llamada a getClasses().
    this.classes$ = this.refreshTrigger$.pipe(
      switchMap(() => this.classReaderService.getClasses())
    );
  }

  openCreateModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  async handleSave(classData: Omit<ClassModel, 'id' | 'bookedSlots'>) {
    try {
      await this.classAdminService.createClass(classData);
      console.log('¡Clase creada con éxito!');
      this.closeModal();

      // 4. ¡LA MAGIA! Después de guardar, activamos el disparador.
      // Esto le dice a classes$ que tiene que volver a buscar los datos.
      this.refreshTrigger$.next();
    } catch (error) {
      console.error('Error al crear la clase:', error);
      alert('Hubo un error al crear la clase.');
    }
  }
  // ... (otros métodos)
}