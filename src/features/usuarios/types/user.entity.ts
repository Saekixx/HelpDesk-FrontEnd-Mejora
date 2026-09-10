// Entidad e información base de un usuario
export interface UserListItem {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;

  // IDs de relaciones
  id_rol: number;
  id_cliente: number | null;
  id_sucursal: number | null;
  id_area: number | null;

  // Nombres descriptivos que retorna el backend (propiedades planas)
  nombre_rol: string | null;
  nombre_cliente: string | null;
  nombre_sucursal: string | null;
  nombre_area: string | null;
}

// Parámetros de consulta para filtrado y paginación
export interface GetUsersQueryParams {
  search?: string;
  id_rol?: number;
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
}
