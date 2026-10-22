import { api } from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { GetUsuariosParams, UsuarioItem } from "@/types/usuario/usuario.types";
import { EstadisticaUsuarios } from "@/types/usuario/estadistica.type";
import { UsuarioRequest } from "@/types/usuario/usuario.request.type";

/**
 * Obtener lista paginada y filtrada de usuarios
 * Endpoint: GET /usuario
 */
export const getUsuarios = async (
  params?: GetUsuariosParams,
): Promise<ApiResponse<PaginatedResponse<UsuarioItem>>> => {
  const response = await api.get<ApiResponse<PaginatedResponse<UsuarioItem>>>(
    "/usuario",
    { params },
  );
  return response.data;
};

/**
 * Retorna las estadísticas de usuarios (totales, activos, inactivos)
 * Endpoint: GET /usuario/estadisticas
 */
export const getEstadisticasUsuarios = async (): Promise<
  ApiResponse<EstadisticaUsuarios>
> => {
  const response = await api.get<ApiResponse<EstadisticaUsuarios>>(
    "/usuario/estadisticas",
  );
  return response.data;
};

/**
 * Crea un nuevo usuario en el sistema
 * Endpoint: POST /usuario
 */
export const crearUsuario = async (
  data: UsuarioRequest,
): Promise<ApiResponse<UsuarioItem>> => {
  const response = await api.post<ApiResponse<UsuarioItem>>(
    "/usuario/create",
    data,
  );
  return response.data;
};

/**
 * Actualiza un usuario existente por ID
 * Endpoint: PATCH /usuario/{id}
 */
export const actualizarUsuario = async (
  id: number,
  data: Partial<UsuarioRequest> & { resetPassword?: boolean },
): Promise<ApiResponse<UsuarioItem>> => {
  const response = await api.patch<ApiResponse<UsuarioItem>>(
    `/usuario/${id}`,
    data,
  );
  return response.data;
};

/**
 * Toggle el estado activo/inactivo de un usuario por ID
 * Endpoint: PATCH /usuario/{id}/status
 */
export const toggleUsuarioStatus = async (id: number): Promise<string> => {
  const response = await api.patch<ApiResponse<null>>(`/usuario/${id}/status`);
  return response.data.message;
};
