// Estructura de la entidad que devuelve el backend
export interface Plan {
  id_plan: number;
  numero_plan: number;
  tipo: string;
  servicio: string[];
  precio: number;
  limite_equipos: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payload para creación (omite campos generados por el servidor)
export type CreatePlanDto = Omit<
  Plan,
  "id_plan" | "is_active" | "createdAt" | "updatedAt"
>;

// Payload para edición parcial
export type UpdatePlanDto = Partial<CreatePlanDto>;

// Respuesta genérica envuelta del backend
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
