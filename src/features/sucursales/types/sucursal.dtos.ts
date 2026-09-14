export interface CreateSucursalDto {
  nombre_sucursal: string;
  encargado: string;
  telefono: string;
  direccion: string;
  correo: string;
  id_cliente: number;
  is_active?: boolean;
}

export type UpdateSucursalDto = Partial<CreateSucursalDto>;

export interface GetSucursalesFilterDto {
  id_cliente?: number;
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface OptionDto {
  value: number | string;
  label: string;
}
