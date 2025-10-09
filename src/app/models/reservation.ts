export interface Reservation {
  id?: string;        // El ID del documento de la reserva en Firestore. Es opcional ('?') al crearse.
  userId: string;     // El ID del usuario que realiza la reserva, estableciendo la relación con el usuario.
  classId: string;    // El ID de la clase que está siendo reservada, estableciendo la relación con la clase.
  status: 'CONFIRMADA' | 'PENDIENTE_PAGO' | 'CANCELADA'; // El estado actual de la reserva, limitado a estos valores específicos.
  createdAt: Date;    // La fecha y hora exactas en que se creó el registro de la reserva.
}