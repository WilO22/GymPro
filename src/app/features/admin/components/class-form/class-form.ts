import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Class as ClassModel } from '../../../../models/class';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [FormsModule], // Necesitamos FormsModule para [(ngModel)]
  templateUrl: './class-form.html'
})
export class ClassForm {
  // @Output() es un decorador que crea un "evento" personalizado.
  // Le estamos diciendo a Angular: "Este componente puede emitir un evento llamado 'save'".
  // El 'EventEmitter' enviará los datos de la clase.
  @Output() save = new EventEmitter<Omit<ClassModel, 'id' | 'bookedSlots'>>();

  // @Output() para emitir un evento cuando se cancele.
  @Output() cancel = new EventEmitter<void>();

  // 'newClass' es el objeto que enlazaremos a nuestro formulario con ngModel.
  // Lo inicializamos con valores por defecto.
  public newClass: Omit<ClassModel, 'id' | 'bookedSlots'> = {
    name: '',
    description: '',
    trainer: '',
    day: 'Lunes',
    time: '08:00',
    totalSlots: 10,
    cost: 20
  };

  // Esta función se llamará cuando el formulario se envíe.
  onSubmit() {
    // Emite el evento 'save' con los datos del formulario.
    this.save.emit(this.newClass);
  }

  // Esta función se llamará al hacer clic en cancelar.
  onCancel() {
    this.cancel.emit();
  }
}