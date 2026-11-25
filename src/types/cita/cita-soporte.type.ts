// Respuesta de GET /soft-lock/auto-asignar
export interface AutoAsignarResponse {
  id_tecnico: number;
  nombre_tecnico: string;
  franja_recomendada: string;
  motivo_asignacion: string;
  es_agrupado_por_sucursal: boolean;
}

// Respuesta de GET /soft-lock/disponibilidad
export interface FranjaDisponibilidad {
  franja: string;
  disponible: boolean;
}

// Request y Response de POST /soft-lock
export interface CreateSoftLockRequest {
  id_tecnico: number;
  fecha: string; // YYYY-MM-DD
  franja: string; // "09:00 - 12:00"
}

export interface SoftLockResponse {
  lock_token: string;
  expires_at: string;
}

// Request de POST /citas-soporte/derivar
export interface DerivarInSituRequest {
  lock_token: string;
  id_ticket: number;
  id_sucursal: number;
  id_usuario: number;
  observaciones?: string;
}

// --- Listado y Detalle de Citas de Soporte ---

export interface CitaTecnicoResumen {
  id_tecnico: number;
  nombre: string;
  apellido: string;
}

export interface CitaClienteResumen {
  id_cliente: number;
  nombre_principal: string;
  numero_documento: string;
}

export interface CitaSucursalResumen {
  id_sucursal: number;
  nombre_sucursal: string;
  direccion: string;
}

export interface CitaSucursalDetalle extends CitaSucursalResumen {
  latidud?: number | null;
  longitud?: number | null;
}

export interface CitaAreaResumen {
  id_area: number;
  nombre_area: string;
}

export interface CitaTrabajadorResumen {
  id_trabajador: number;
  nombre: string;
  apellido: string;
}

export interface CitaEquipoResumen {
  id_equipo: number;
  tipo: string;
  ultima_revision?: string | null;
}

// Item de GET /citas-soporte
export interface CitaSoporteListItem {
  id_cita: number;
  estado: string;
  fecha_programada: string;
  hora_inicio: string;
  hora_fin: string;
  observaciones?: string | null;
  tecnico: CitaTecnicoResumen;
  cliente: CitaClienteResumen;
  sucursal: CitaSucursalResumen;
}

// Detalle de GET /citas-soporte/:id
export interface CitaSoporteDetail extends CitaSoporteListItem {
  sucursal: CitaSucursalDetalle;
  area?: CitaAreaResumen | null;
  trabajador?: CitaTrabajadorResumen | null;
  equipo?: CitaEquipoResumen | null;
}

// Query params de GET /citas-soporte
export interface GetCitasSoporteParams {
  search?: string;
  id_cliente?: number;
  id_sucursal?: number;
  estado?: string;
  fecha_programada?: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
}

// Respuesta de GET /citas-soporte
export interface CitasSoporteListResponse {
  status?: number;
  message?: string;
  data: CitaSoporteListItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
