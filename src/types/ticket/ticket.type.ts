// 1. Enum exacto con los valores que provienen del Backend
export enum EstadoTicketBackend {
  PENDIENTE = "PENDIENTE",
  ASIGNADO = "ASIGNADO",
  EN_PROGRESO = "EN_PROGRESO",
  REABIERTO = "REABIERTO",
  CERRADO = "CERRADO",
  DERIVADO_INSITU = "DERIVADO_INSITU",
  EN_ESPERA_REPUESTO = "EN_ESPERA_REPUESTO",
}

// 2. Tipado visual limpio para el Frontend (sin guiones bajos)
export type TicketEstadoType =
  | "Pendiente"
  | "Asignado"
  | "En Progreso"
  | "Reabierto"
  | "Cerrado"
  | "Derivado Insitu"
  | "En Espera Repuesto";

// 3. Diccionario o función helper para mapear del backend al front de forma segura
export const mapEstadoTicket = (estadoBackend: string): TicketEstadoType => {
  const mapping: Record<string, TicketEstadoType> = {
    PENDIENTE: "Pendiente",
    ASIGNADO: "Asignado",
    EN_PROGRESO: "En Progreso",
    REABIERTO: "Reabierto",
    CERRADO: "Cerrado",
    DERIVADO_INSITU: "Derivado Insitu",
    EN_ESPERA_REPUESTO: "En Espera Repuesto",
  };

  return (
    mapping[estadoBackend?.toUpperCase()] || (estadoBackend as TicketEstadoType)
  );
};

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
  estado: TicketEstadoType | string; // Permitimos ambos por seguridad temporal
  equipo: TicketEquipoInfo | null;
  cliente: TicketClienteInfo | null;
  sucursal: TicketSucursalInfo | null;
  area: TicketAreaInfo | null;
  soporte: TicketSoporteInfo | null;
}

// Parámetros de consulta (Query Params) basados en tu Swagger
export interface GetTicketsParams {
  search?: string;
  estado?: EstadoTicketBackend | TicketEstadoType | string;
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  id_trabajador?: number;
  id_soporte?: number;
  page?: number;
  limit?: number;
}
