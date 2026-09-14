export interface SucursalCliente {
  id_cliente: number;
  nombre_principal: string;
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
  created_at?: string | Date;
  updated_at?: string | Date;
  total_areas?: number;
  cliente?: SucursalCliente;
}

export interface Sucursal extends SucursalListItem {
  cliente?: SucursalCliente;
}
