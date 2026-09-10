import { api } from "@/lib/axios";
import { GetUsersQueryParams, UserListItem } from "../types/user.entity";
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserProfileDto,
  AssignUserRoleDto,
} from "../types/user.dtos";
import {
  PaginationMeta,
  UsersApiResponse,
  UserDetailApiResponse,
  UserSingleApiResponse,
  UserActionApiResponse,
} from "../types/user.responses";

// GET /usuario -> Obtener lista paginada de usuarios
export const getUsersService = async (
  params?: GetUsersQueryParams,
): Promise<{ data: UserListItem[]; meta: PaginationMeta }> => {
  const response = await api.get<UsersApiResponse>("/usuario", { params });
  const paginatedData = response.data.data;

  return {
    data: paginatedData.data,
    meta: {
      total: paginatedData.total,
      page: paginatedData.page,
      limit: paginatedData.limit,
      totalPages: paginatedData.totalPages,
    },
  };
};

// GET /usuario/:id -> Obtener usuario por ID
export const getUserByIdService = async (id: number): Promise<UserListItem> => {
  const response = await api.get<UserDetailApiResponse>(`/usuario/${id}`);
  return response.data.data;
};

// POST /usuario/create -> Crear un nuevo usuario
export const createUserService = async (
  dto: CreateUserDto,
): Promise<UserListItem> => {
  const response = await api.post<UserSingleApiResponse>(
    "/usuario/create",
    dto,
  );
  return response.data.data;
};

// PATCH /usuario/:id -> Actualizar usuario por ID (Gestión Administrativa)
export const updateUserService = async (
  id: number,
  dto: UpdateUserDto,
): Promise<UserListItem> => {
  const response = await api.patch<UserSingleApiResponse>(
    `/usuario/${id}`,
    dto,
  );
  return response.data.data;
};

// PATCH /usuario/perfil -> Actualizar perfil del usuario autenticado
export const updateProfileService = async (
  dto: UpdateUserProfileDto,
): Promise<UserListItem> => {
  const response = await api.patch<UserSingleApiResponse>(
    "/usuario/perfil",
    dto,
  );
  return response.data.data;
};

// PATCH /usuario/:id/rol -> Asignar o reasignar rol a un usuario
export const assignUserRoleService = async (
  id: number,
  dto: AssignUserRoleDto,
): Promise<UserActionApiResponse> => {
  const response = await api.patch<UserActionApiResponse>(
    `/usuario/${id}/rol`,
    dto,
  );
  return response.data;
};

// PATCH /usuario/:id/status -> Activar o desactivar estado de usuario
export const toggleUserStatusService = async (
  id: number,
): Promise<UserActionApiResponse> => {
  const response = await api.patch<UserActionApiResponse>(
    `/usuario/${id}/status`,
  );
  return response.data;
};
