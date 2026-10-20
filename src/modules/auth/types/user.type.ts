export interface User {
  nombre: string;
  apellido: string;
  correo: string;
  role: string;
  id_empresa: number | null;
  id_sucursal: number | null;
  id_area: number | null;
}

export interface UserDetail {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string | null;
  is_active: boolean;
  id_rol: number;
  id_cliente: number | null;
  id_sucursal: number | null;
  id_area: number | null;
  createdAt: string;
  updatedAt: string;
}
