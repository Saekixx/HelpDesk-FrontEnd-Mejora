import { TipoCliente } from "./cliente.entity";

export interface CreateClienteDto {
  tipo_cliente: TipoCliente;
  numero_documento: string;
  nombre_principal: string;
  direccion: string;
  telefono: string;
  correo: string;
  rubro: string;
  fecha_inicio_plan: Date | string;
  fecha_finalizacion_plan: Date | string;
  costo_negociado: number;
  limite_equipos_contratado: number;
  id_plan: number;
  is_active?: boolean;
}

export interface UpdateClienteDto {
  tipo_cliente?: TipoCliente;
  numero_documento?: string;
  nombre_principal?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  rubro?: string;
  fecha_inicio_plan?: Date | string;
  fecha_finalizacion_plan?: Date | string;
  costo_negociado?: number;
  limite_equipos_contratado?: number;
  id_plan?: number;
  is_active?: boolean;
}

export interface GetClientesQueryDto {
  search?: string;
  tipo_cliente?: TipoCliente;
  is_active?: boolean;
  page?: number;
  limit?: number;
}
