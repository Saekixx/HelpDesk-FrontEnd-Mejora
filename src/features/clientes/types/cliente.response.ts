import { Cliente } from "./cliente.entity";

export interface PaginatedClientesResponse {
  data: Cliente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OptionDto {
  value: number | string;
  label: string;
}

export interface PlanDetail {
  id_plan: number;
  nombre: string;
  tipo: string;
  precio: number;
  limite_equipos: number;
  is_active: boolean;
}

export interface SucursalDetail {
  id_sucursal: number;
  nombre: string;
  encargado?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  is_active: boolean;
}

export interface ClienteDetail extends Cliente {
  createdAt?: Date | string;
  updatedAt?: Date | string;
  fecha_registro?: Date | string;
  plan?: PlanDetail;
  sucursales?: SucursalDetail[];
}

export interface ClienteMutationResponse {
  message: string;
  data: ClienteDetail;
}

export interface ClienteDetailApiResponse {
  message: string;
  data: ClienteDetail;
}
