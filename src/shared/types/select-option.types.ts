// Estructura que retorna el Backend para la entidad Rol
export interface RoleOptionResponse {
  id_rol: number;
  nombre: string;
  createdAt?: string;
}

// Estructura genérica estandarizada para los Selects del Frontend
export interface SelectOption<T = number | string> {
  value: T;
  label: string;
}
