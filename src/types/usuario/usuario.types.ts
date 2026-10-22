// Zona asociada al usuario (para soporte in-situ)
export interface ZonaUsuario {
  id_zona: number;
  nombre_zona: string;
}

// Entidad principal del Usuario según tu base de datos y API
export interface UsuarioItem {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  id_rol: number;
  id_cliente: number | null;
  id_sucursal: number | null;
  id_area: number | null;
  nombre_rol: string;
  nombre_cliente: string | null;
  nombre_sucursal: string | null;
  nombre_area: string | null;
  zonas: ZonaUsuario[];
}

// Parámetros de consulta (Query Params) permitidos en el endpoint GET /usuario
export interface GetUsuariosParams {
  search?: string;
  id_rol?: number;
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
}
