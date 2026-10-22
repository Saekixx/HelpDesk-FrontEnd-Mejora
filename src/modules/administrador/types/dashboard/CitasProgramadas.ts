// Estado de la cita (puedes ajustarlo según tus estados reales)
export type EstadoCita = "EN RUTA" | "AGENDADO" | "COMPLETADO" | "CANCELADO";

// Estructura de una cita individual
export interface CitaProgramada {
  id: string | number; // Identificador único de la cita
  hora: string; // Hora de la cita (ej: "14:30")
  cliente: string; // Nombre del cliente (empresa)
  sucursal: string; // Nombre de la sucursal del cliente
  descripcion: string; // Descripción breve de la cita
  tecnico: string; // Nombre del técnico asignado
  estado: EstadoCita; // Estado actual de la cita
}

// Estructura general que recibe el componente widget
export interface ResumenCitasHoy {
  total_citas: number; // Total de citas programadas para hoy
  citas: CitaProgramada[]; // Listado de citas programadas para hoy
}
