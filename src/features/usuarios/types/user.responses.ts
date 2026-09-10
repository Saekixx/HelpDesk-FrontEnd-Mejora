import { UserListItem } from "./user.entity";

// Paginación
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersPaginatedData {
  data: UserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Respuestas de la API
export interface UsersApiResponse {
  status: number;
  message: string;
  data: UsersPaginatedData;
}

export interface UserDetailApiResponse {
  status: number;
  message: string;
  data: UserListItem;
}

export interface UserSingleApiResponse {
  status: number;
  message: string;
  data: UserListItem;
}

export interface UserActionApiResponse {
  status: number;
  message: string;
}
