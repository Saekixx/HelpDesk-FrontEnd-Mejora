export interface GetAreasFilterDto {
  id_cliente?: number;
  id_sucursal?: number;
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateAreaDto {
  nombre_area: string;
  contacto: string;
  telefono: string;
  correo: string;
  id_sucursal: number;
  is_active?: boolean;
}

export type UpdateAreaDto = Partial<CreateAreaDto>;

export interface OptionDto {
  value: number;
  label: string;
}
