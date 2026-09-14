/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Area {
  id_area: number;
  nombre_area: string;
  contacto: string;
  telefono: string;
  correo: string;
  id_sucursal: number;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
  sucursal?: {
    id_sucursal: number;
    nombre: string;
  };
  cliente?: {
    id_cliente: number;
    nombre: string;
  };
}

export interface AreaListItem extends Area {}
