export type TicketEstadoType =
  | "Pendiente"
  | "Asignado"
  | "En Progreso"
  | "Reabierto"
  | "Cerrado"
  | "Derivado Insitu"
  | "En Espera Repuesto";

export interface TicketEquipoInfo {
  id_equipo: number;
  nombre: string;
  marca_modelo: string;
  tipo: string;
  numero_serie: string;
}

export interface TicketClienteInfo {
  id_cliente: number;
  nombre: string;
}

export interface TicketSucursalInfo {
  id_sucursal: number;
  nombre: string;
}

export interface TicketAreaInfo {
  id_area: number;
  nombre: string;
}

export interface TicketSoporteInfo {
  id_soporte: number;
  nombre: string;
  apellido: string;
}

// Estructura de cada item en el listado
export interface TicketListItem {
  id_ticket: number;
  pin: string;
  asunto: string;
  detalle: string;
  es_software: boolean;
  estado: TicketEstadoType;
  equipo: TicketEquipoInfo | null;
  cliente: TicketClienteInfo | null;
  sucursal: TicketSucursalInfo | null;
  area: TicketAreaInfo | null;
  soporte: TicketSoporteInfo | null;
}

// Parámetros de consulta (Query Params) basados en tu Swagger
export interface GetTicketsParams {
  search?: string; // Búsqueda por PIN, asunto o detalle
  estado?: TicketEstadoType | string;
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  page?: number;
  limit?: number;
}
