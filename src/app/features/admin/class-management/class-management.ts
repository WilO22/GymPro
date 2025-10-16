import { Component, inject, signal } from '@angular/core';
// Ya no necesitamos firstValueFrom porque el servicio maneja la carga de datos.
// import { firstValueFrom } from 'rxjs'; 

import { Class as ClassReaderService } from '../../user/services/class';
import { Class as ClassAdminService } from '../services/class';
import { Class as ClassModel } from '../../../models/class';
import { ClassForm } from '../components/class-form/class-form';

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [ClassForm],
  templateUrl: './class-management.html'
})
export class ClassManagement {
  private classReaderService = inject(ClassReaderService);
  private classAdminService = inject(ClassAdminService);

  // --- ¡CORRECCIÓN CLAVE! ---
  // El componente ya no tiene su propio signal de clases.
  // Ahora, simplemente lee el signal PÚBLICO que expone el servicio.
  public classes = this.classReaderService.classes;

  public isModalVisible = signal(false);
  public classToEdit = signal<ClassModel | null>(null);

  // El constructor ahora está vacío. La carga de datos es automática en el servicio.
  constructor() {}

  // El método loadClasses() ya no es necesario y se ha eliminado.

  handleEdit(clase: ClassModel) {
    this.classToEdit.set(clase);
    this.isModalVisible.set(true);
  }

  async handleDelete(classId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
      try {
        await this.classAdminService.deleteClass(classId);
        console.log('Clase eliminada con éxito');
        // No necesitamos recargar. El servicio detectará el cambio y actualizará el signal automáticamente.
      } catch (error) {
        console.error('Error al eliminar la clase:', error);
        alert('Hubo un error al eliminar la clase.');
      }
    }
  }

  async handleSave(classData: Omit<ClassModel, 'id' | 'bookedSlots'> | ClassModel) {
    try {
      const editingClass = this.classToEdit();

      if (editingClass) {
        await this.classAdminService.updateClass(editingClass.id!, classData);
        console.log('¡Clase actualizada con éxito!');
      } else {
        await this.classAdminService.createClass(classData as Omit<ClassModel, 'id' | 'bookedSlots'>);
        console.log('¡Clase creada con éxito!');
      }

      this.closeModal();
      // No necesitamos recargar. El servicio se encargará de todo.
      
    } catch (error) {
      console.error('Error al guardar la clase:', error);
      alert('Hubo un error al guardar la clase.');
    }
  }

  openCreateModal() {
    this.classToEdit.set(null);
    this.isModalVisible.set(true);
  }

  closeModal() {
    this.isModalVisible.set(false);
  }
}