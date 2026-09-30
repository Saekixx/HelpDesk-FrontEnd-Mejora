import {
  EquipoListItem,
  EquipoDetail,
  ComponenteHardware,
} from "./equipo.entity";

// Paginación
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EquiposPaginatedData {
  data: EquipoListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Respuestas de la API
export interface EquiposApiResponse {
  message: string;
  data: EquiposPaginatedData;
}

export interface EquipoSingleApiResponse {
  message: string;
  data: EquipoListItem;
}

export interface EquipoDetailApiResponse {
  message: string;
  data: EquipoDetail;
}

export interface EquipoActionApiResponse {
  message: string;
  data?: EquipoListItem;
}

// Respuesta al agregar o reemplazar componente de hardware
export interface HardwareComponentApiResponse {
  message: string;
  data: ComponenteHardware;
}
