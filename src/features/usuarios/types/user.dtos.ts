// Payload para crear usuario (POST /usuario/create)
export interface CreateUserDto {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  id_rol: number;
  id_cliente?: number | null;
  id_sucursal?: number | null;
  id_area?: number | null;
}

// Payload para edición administrativa por ID (PATCH /usuario/:id)
export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  resetPassword?: boolean;
  id_rol?: number;
  id_cliente?: number | null;
  id_sucursal?: number | null;
  id_area?: number | null;
}

// Payload para edición de perfil propio (PATCH /usuario/perfil)
export interface UpdateUserProfileDto {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Payload para reasignación de rol (PATCH /usuario/:id/rol)
export interface AssignUserRoleDto {
  id_rol: number;
  id_cliente?: number | null;
  id_sucursal?: number | null;
  id_area?: number | null;
}
