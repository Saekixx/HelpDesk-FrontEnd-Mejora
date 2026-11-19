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
