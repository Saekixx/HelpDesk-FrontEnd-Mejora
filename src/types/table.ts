import { ReactNode } from "react";

// Respuesta Meta estandarizada del Backend
export interface ApiMetaResponse {
  total: number;
  page: number;
  lastPage: number;
}

// Estructura general de respuesta paginada
export interface ApiResponse<T> {
  message: string;
  data: {
    data: T[];
    meta: ApiMetaResponse;
  };
}

// Configuración genérica de columnas
export interface ColumnDef<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T) => ReactNode;
}

// Opción genérica para Selects (soporta tanto label/value como id/nombre)
export interface FilterOption {
  label?: string;
  value?: string | number | boolean;
  id?: string | number;
  nombre?: string;
  [key: string]: any; // Permite flexibilidad total con claves personalizadas (ej. id_rol, nombre_rol)
}

// Configuración de Selects dinámicos
export interface FilterDropdownConfig {
  key: string;
  label?: string;
  placeholder: string;
  options: FilterOption[];
  // Opcionales para mapear automáticamente si la data viene como { id, nombre }
  labelKey?: string;
  valueKey?: string;
}
