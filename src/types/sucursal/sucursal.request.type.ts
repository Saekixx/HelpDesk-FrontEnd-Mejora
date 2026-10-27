export interface SucursalRequest {
  nombre_sucursal: string;
  encargado?: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
  id_cliente: number;
  id_zona?: number | null;
  is_active?: boolean;
}
