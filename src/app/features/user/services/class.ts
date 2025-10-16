import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Class as ClassModel } from '../../../models/class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Class {
  private firestore: Firestore = inject(Firestore);
  
  // 1. Signal privado y escribible.
  private readonly _classes = signal<ClassModel[]>([]);
  // 2. Signal público de solo lectura.
  public readonly classes = this._classes.asReadonly();

  constructor() {
    // 3. Nos suscribimos a los datos en tiempo real de las clases.
    const classCollection = collection(this.firestore, 'classes');
    const classes$ = collectionData(classCollection, { idField: 'id' }) as Observable<ClassModel[]>;
    
    classes$.subscribe(classesData => {
      // 4. Actualizamos el signal cada vez que haya un cambio en la colección de clases.
      this._classes.set(classesData);
    });
  }
}