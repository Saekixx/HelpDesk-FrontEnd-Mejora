// --- ESTADOS REALES Y VALORES PERMITIDOS ---
export type TicketEstadoApi =
  | "Pendiente"
  | "En Progreso"
  | "Derivado Insitu"
  | "En Espera Repuesto"
  | "Reabierto"
  | "Cerrado"
  | string;

// --- RESPUESTA REAL DEL BACKEND (GET /tickets/{id}) ---
export interface TrabajadorBackend {
  id_trabajador: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  id_cliente: number;
  nombre_cliente: string;
  id_sucursal: number;
  nombre_sucursal: string;
  id_area: number;
  nombre_area: string;
}

export interface EquipoBackend {
  id_equipo: number;
  nombre_equipo: string;
  tipo: string;
  numero_serie: string;
  marca_modelo: string;
}

export interface SoporteBackend {
  id_soporte: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  area: string;
  rol: {
    nombre: string;
  };
}

export interface TicketDetailBackend {
  id_ticket: number;
  pin: string;
  asunto: string;
  detalle: string;
  es_software: boolean;
  createdAt: string;
  updatedAt: string;
  estado: TicketEstadoApi;
  trabajador: TrabajadorBackend;
  equipo?: EquipoBackend | null;
  soporte?: SoporteBackend | null;

  // Campos opcionales o extendidos para flujos específicos si el backend los envía
  prioridad?: string;
  repuestoInfo?: {
    componente: string;
    requisicion: string;
    tiempoEstimado: string;
  };
  visitaInfo?: {
    fechaHora: string;
    sede: string;
  };
  reaperturaInfo?: {
    motivo: string;
    fechaHora: string;
    reincidenciaNum: number;
  };
  solucionInfo?: {
    fechaResolucion: string;
    tecnicoResolutor: string;
    solucionAplicada: string;
    calificacion: number;
  };
}

// --- ESTRUCTURA DE MENSAJES PARA EL CHAT ---
export interface TicketChatMessage {
  id: string;
  emisor: "SOLICITANTE" | "TECNICO" | "SISTEMA";
  autorNombre: string;
  timestamp: string;
  texto?: string;
  adjunto?: {
    nombre: string;
    peso: string;
    url: string;
  };
}
