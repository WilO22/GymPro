export interface Class {
  id?: string;        // El ID del documento en Firestore. Es opcional ('?') ya que se genera al crear el documento.
  name: string;       // El nombre de la clase, como "Yoga Avanzado" o "Spinning Intenso".
  description: string; // Un texto detallado que explica en qué consiste la clase.
  trainer: string;    // El nombre del instructor o entrenador responsable de la clase.
  day: string;        // El día de la semana en que se imparte la clase (ej: "Lunes", "Martes").
  time: string;       // La hora de inicio programada para la clase (ej: "09:00", "20:30").
  totalSlots: number; // El número total de plazas o cupos disponibles para esta clase.
  bookedSlots: number; // El número de plazas que ya han sido reservadas por los usuarios.
  cost: number;       // El precio o costo asociado a la reserva de esta clase.
}