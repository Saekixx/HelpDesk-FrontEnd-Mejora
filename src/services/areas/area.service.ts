import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import { AreaRequest } from "@/types/area/area.request.type";
import {
  GetAreasParams,
  AreaListItem,
  AreaDetail,
} from "@/types/area/area.types";

/**
 * Obtener lista paginada y filtrada de áreas
 * Endpoint: GET /areas
 */
export const getAreas = async (
  params?: GetAreasParams,
): Promise<ApiResponse<NestedPaginatedResponse<AreaListItem>>> => {
  const response = await api.get<
    ApiResponse<NestedPaginatedResponse<AreaListItem>>
  >("/areas", { params });
  return response.data;
};

/**
 * Obtener el detalle completo de un área por ID
 * Endpoint: GET /areas/{id}
 */
export const getAreaById = async (
  id: number,
): Promise<ApiResponse<AreaDetail>> => {
  const response = await api.get<ApiResponse<AreaDetail>>(`/areas/${id}`);
  return response.data;
};

/**
 * Crea un nueva área en el sistema
 * Endpoint: POST /areas
 */
export const crearArea = async (
  data: AreaRequest,
): Promise<ApiResponse<AreaDetail>> => {
  const response = await api.post<ApiResponse<AreaDetail>>("/areas", data);
  return response.data;
};

/**
 * Actualiza un área existente por ID
 * Endpoint: PATCH /areas/{id}
 */
export const actualizarArea = async (
  id: number,
  data: Partial<AreaRequest>,
): Promise<ApiResponse<AreaDetail>> => {
  const response = await api.patch<ApiResponse<AreaDetail>>(
    `/areas/${id}`,
    data,
  );
  return response.data;
};

/**
 * Alterna el estado is_active de un área por ID (soft toggle)
 * Endpoint: PATCH /areas/{id}/toggle-status
 */
export const toggleAreaStatus = async (id: number): Promise<string> => {
  const response = await api.patch<ApiResponse<null>>(
    `/areas/${id}/toggle-status`,
  );
  return response.data.message;
};
