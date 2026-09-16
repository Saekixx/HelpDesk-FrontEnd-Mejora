import { TipoCliente } from "./cliente.entity";

// Estructura para la sucursal principal al crear (requiere campos base)
export interface SucursalPrincipalCreateDto {
  nombre?: string;
  telefono?: string;
}

// Estructura para la sucursal principal al actualizar (parcial)
export interface SucursalPrincipalUpdateDto {
  nombre?: string;
  telefono?: string;
}

// Estructura para sucursales adicionales
export interface SucursalAdicionalDto {
  nombre: string;
  encargado?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

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
  sucursal_principal?: SucursalPrincipalCreateDto;
  sucursales_adicionales?: SucursalAdicionalDto[];
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
  // Omitimos is_active del DTO de edición ya que se gestiona vía toggle-status
  sucursal_principal?: SucursalPrincipalUpdateDto;
  sucursales_adicionales?: SucursalAdicionalDto[];
}

export interface GetClientesQueryDto {
  search?: string;
  tipo_cliente?: TipoCliente;
  is_active?: boolean;
  page?: number;
  limit?: number;
}
