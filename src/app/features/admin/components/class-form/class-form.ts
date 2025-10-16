// --- ¡NUEVO! --- Se importa Input y OnInit
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Class as ClassModel } from '../../../../models/class';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './class-form.html'
})
// --- ¡NUEVO! --- Implementamos OnInit para reaccionar a los inputs iniciales.
export class ClassForm implements OnInit {
  // --- ¡NUEVO! ---
  // @Input() permite que el componente padre (class-management) nos pase datos.
  // Puede recibir una ClassModel completa o null.
  @Input() classData: ClassModel | null = null;

  @Output() save = new EventEmitter<Omit<ClassModel, 'id' | 'bookedSlots'> | ClassModel>();
  @Output() cancel = new EventEmitter<void>();

  // 'currentClass' es el objeto que enlazaremos al formulario.
  public currentClass: Omit<ClassModel, 'id' | 'bookedSlots'> | ClassModel = {
    name: '',
    description: '',
    trainer: '',
    day: 'Lunes',
    time: '08:00',
    totalSlots: 10,
    cost: 20
  };

  // --- ¡NUEVO! ---
  // El método ngOnInit se ejecuta una vez, después de que los @Input() han sido recibidos.
  ngOnInit() {
    // Si recibimos datos de una clase para editar...
    if (this.classData) {
      // ...copiamos sus propiedades a nuestro objeto del formulario.
      // Usamos '...this.classData' para crear una copia y evitar modificar el original directamente.
      this.currentClass = { ...this.classData };
    }
  }

  onSubmit() {
    // Emitimos el objeto 'currentClass' tal como está.
    // El componente padre sabrá si es una edición (si tiene 'id') o una creación.
    this.save.emit(this.currentClass);
  }

  onCancel() {
    this.cancel.emit();
  }
}