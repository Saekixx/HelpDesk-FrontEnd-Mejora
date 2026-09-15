/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface SucursalCliente {
  id_cliente: number;
  nombre?: string;
  nombre_principal?: string;
}

export interface SucursalListItem {
  id_sucursal: number;
  nombre_sucursal: string;
  encargado: string;
  telefono: string;
  direccion: string;
  correo: string;
  id_cliente: number;
  is_active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  total_areas?: number;
  cliente?: SucursalCliente;
}

export interface Sucursal extends SucursalListItem {}
