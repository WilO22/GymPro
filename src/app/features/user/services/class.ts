import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Class as ClassModel } from '../../../models/class'; // Importamos nuestra interfaz con un alias
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Class { // Angular CLI crea la clase con el nombre del archivo

  private firestore: Firestore = inject(Firestore);

  // --- MÉTODO PARA OBTENER TODAS LAS CLASES ---
  getClasses(): Observable<ClassModel[]> {
    // 1. Obtenemos una referencia a la colección 'classes' en Firestore.
    const classCollection = collection(this.firestore, 'classes');

    // 2. collectionData nos da un Observable que se actualiza en tiempo real.
    //    Le decimos que los documentos tienen la forma de nuestra interfaz 'ClassModel'.
    return collectionData(classCollection, { idField: 'id' }) as Observable<ClassModel[]>;
  }

  // (Más adelante añadiremos los métodos para crear, actualizar y borrar clases aquí)
}