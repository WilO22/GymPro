import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Class as ClassModel } from '../../../models/class';

@Injectable({
  providedIn: 'root'
})
export class Class {

  private firestore: Firestore = inject(Firestore);
  // Creamos una referencia a la colección 'classes' para reutilizarla
  private classCollection = collection(this.firestore, 'classes');

  // --- MÉTODO PARA CREAR UNA NUEVA CLASE ---
  createClass(classData: Omit<ClassModel, 'id' | 'bookedSlots'>) {
    const newClass = {
      ...classData,
      bookedSlots: 0 // Una clase nueva siempre empieza con 0 cupos reservados
    };
    // addDoc añade un nuevo documento a la colección 'classes'
    return addDoc(this.classCollection, newClass);
  }

  // --- MÉTODO PARA ACTUALIZAR UNA CLASE EXISTENTE ---
  updateClass(classId: string, classData: Partial<ClassModel>) {
    // Creamos una referencia al documento específico que queremos actualizar
    const classDocRef = doc(this.firestore, `classes/${classId}`);
    // updateDoc actualiza los campos del documento
    return updateDoc(classDocRef, classData);
  }

  // --- MÉTODO PARA ELIMINAR UNA CLASE ---
  deleteClass(classId: string) {
    // Creamos una referencia al documento que queremos eliminar
    const classDocRef = doc(this.firestore, `classes/${classId}`);
    // deleteDoc elimina el documento de Firestore
    return deleteDoc(classDocRef);
  }
}