// src/app/features/user/services/reservation.ts

// --- SECCIÓN DE IMPORTACIONES ---
// Importamos las herramientas necesarias de Angular y Firebase.
import { Injectable, inject, signal, runInInjectionContext, Injector } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData, // Para escuchar cambios en una colección en tiempo real.
  doc,
  deleteDoc,
  runTransaction,   // Para realizar operaciones atómicas y seguras.
  increment,        // Para aumentar o disminuir un valor numérico de forma segura.
  getDocs           // Para ejecutar una consulta una sola vez.
} from '@angular/fire/firestore';
import { Auth as FirebaseAuth, authState } from '@angular/fire/auth';
import { Reservation as ReservationModel } from '../../../models/reservation';
import { Class as ClassModel } from '../../../models/class';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Reservation {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  // Inyectamos los servicios principales que este servicio necesita para funcionar.
  private firestore: Firestore = inject(Firestore);
  private auth: FirebaseAuth = inject(FirebaseAuth);
  private injector = inject(Injector); // Necesario para el contexto de inyección.

  // --- GESTIÓN DE ESTADO CON SIGNALS ---
  // '_reservations' es un signal privado que contiene el array de reservas del usuario.
  private readonly _reservations = signal<ReservationModel[]>([]);
  // 'reservations' es la versión pública y de solo lectura del signal. Los componentes lo leerán.
  public readonly reservations = this._reservations.asReadonly();

  constructor() {
    // runInInjectionContext es necesario porque estamos ejecutando código asíncrono (suscripción a Firebase)
    // dentro del constructor de un servicio. Asegura que el código tenga acceso al contexto de inyección de Angular.
    runInInjectionContext(this.injector, () => {
      // 'authState' es un Observable que emite el estado del usuario (logueado o no).
      authState(this.auth).pipe(
        // 'switchMap' es un operador de RxJS. Si el usuario se desloguea y vuelve a loguearse,
        // cancela la suscripción anterior y crea una nueva, evitando fugas de memoria.
        switchMap(user => {
          if (user) {
            // Si hay un usuario logueado, preparamos una consulta a Firestore.
            const reservationCollection = collection(this.firestore, 'reservations');
            // Creamos una consulta para obtener solo las reservas cuyo 'userId' coincida con el del usuario actual.
            const q = query(reservationCollection, where("userId", "==", user.uid));
            // 'collectionData' crea un Observable que escucha en tiempo real los cambios en la consulta.
            // Cada vez que se añade, modifica o elimina una reserva del usuario, este Observable emitirá la nueva lista.
            return collectionData(q, { idField: 'id' }) as Observable<ReservationModel[]>;
          } else {
            // Si no hay usuario, devolvemos un Observable con un array vacío.
            return of([]);
          }
        })
      ).subscribe(reservationsData => {
        // Cuando recibimos nuevos datos de Firestore, actualizamos el valor de nuestro signal.
        // Todos los componentes que usen este signal se actualizarán automáticamente.
        this._reservations.set(reservationsData);
      });
    });
  }

  /**
   * Crea una nueva reserva para una clase específica.
   * Utiliza una transacción para garantizar la integridad de los datos.
   * @param classItem - El objeto de la clase que se va a reservar.
   */
  async createReservation(classItem: ClassModel) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado.');
    if (!classItem.id) throw new Error('ID de clase no válido.');

    const classDocRef = doc(this.firestore, `classes/${classItem.id}`);
    const reservationCollection = collection(this.firestore, 'reservations');

    // 'runTransaction' ejecuta un grupo de operaciones como una sola unidad. O todo tiene éxito, o nada se guarda.
    // Esto es CRUCIAL para evitar que dos usuarios reserven el último cupo al mismo tiempo.
    return runTransaction(this.firestore, async (transaction) => {
      // --- Verificación de reserva duplicada ---
      // Antes de la transacción, hacemos una consulta rápida para ver si el usuario ya tiene una reserva activa.
      const existingReservationQuery = query(
        reservationCollection,
        where('userId', '==', user.uid),
        where('classId', '==', classItem.id),
        where('status', 'in', ['CONFIRMADA', 'PENDIENTE_PAGO'])
      );
      const existingReservationsSnapshot = await getDocs(existingReservationQuery);

      if (!existingReservationsSnapshot.empty) {
        // Si la consulta devuelve algo, significa que ya existe una reserva. Lanzamos un error.
        throw new Error('¡Ya tienes una reserva activa para esta clase!');
      }

      // --- Inicio de la lógica transaccional ---
      // 1. Leer el estado actual de la clase DENTRO de la transacción.
      const classDoc = await transaction.get(classDocRef);

      if (!classDoc.exists()) {
        throw new Error("¡La clase ya no existe!");
      }

      // 2. Validar la lógica de negocio.
      const currentBookedSlots = classDoc.data()['bookedSlots'] || 0;
      const totalSlots = classDoc.data()['totalSlots'];

      if (currentBookedSlots >= totalSlots) {
        throw new Error("¡Lo sentimos, ya no hay cupos disponibles para esta clase!");
      }

      // 3. Preparar las operaciones de escritura.
      const newReservationData: Omit<ReservationModel, 'id'> = {
        userId: user.uid,
        classId: classItem.id!,
        status: 'CONFIRMADA',
        createdAt: new Date()
      };
      const newReservationRef = doc(reservationCollection); // Creamos una referencia para el nuevo documento de reserva.

      // 3a. Escribir el nuevo documento de reserva.
      transaction.set(newReservationRef, newReservationData);
      // 3b. Actualizar el contador de cupos en la clase. 'increment(1)' es una operación atómica segura.
      transaction.update(classDocRef, {
        bookedSlots: increment(1)
      });
      // Firestore se encarga de confirmar (commit) todas las operaciones. Si hay un conflicto, reintentará la transacción.
    });
  }

  /**
   * Elimina una reserva existente y devuelve el cupo a la clase.
   * También se ejecuta dentro de una transacción para garantizar la consistencia.
   * @param reservationId - El ID del documento de la reserva a eliminar.
   */
  deleteReservation(reservationId: string) {
    const reservationDocRef = doc(this.firestore, `reservations/${reservationId}`);

    return runTransaction(this.firestore, async (transaction) => {
      // 1. Leer el documento de la reserva que se va a cancelar.
      const reservationDoc = await transaction.get(reservationDocRef);

      if (!reservationDoc.exists()) {
        throw new Error("La reserva que intentas cancelar no existe.");
      }

      // 2. Obtener el ID de la clase asociada para poder devolver el cupo.
      const classId = reservationDoc.data()['classId'];
      const classDocRef = doc(this.firestore, `classes/${classId}`);

      // 3. Preparar las operaciones de escritura.
      // 3a. Eliminar el documento de la reserva.
      transaction.delete(reservationDocRef);
      // 3b. Actualizar el contador de la clase, decrementando en 1.
      transaction.update(classDocRef, {
        bookedSlots: increment(-1)
      });
    });
  }
}