// src/app/features/user/services/class.ts

// --- ¡NUEVO! --- Importamos inject y runInInjectionContext
import { Injectable, inject, signal, runInInjectionContext, Injector } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Class as ClassModel } from '../../../models/class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Class {
  private firestore: Firestore = inject(Firestore);
  private injector = inject(Injector); // Obtenemos el inyector

  private readonly _classes = signal<ClassModel[]>([]);
  public readonly classes = this._classes.asReadonly();

  constructor() {
    // --- ¡CAMBIO CLAVE! --- Envolvemos la suscripción.
    runInInjectionContext(this.injector, () => {
      const classCollection = collection(this.firestore, 'classes');
      const classes$ = collectionData(classCollection, { idField: 'id' }) as Observable<ClassModel[]>;
      
      classes$.subscribe(classesData => {
        this._classes.set(classesData);
      });
    });
  }
}