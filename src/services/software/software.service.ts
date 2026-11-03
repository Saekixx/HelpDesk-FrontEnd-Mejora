import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import {
  GetSoftwareParams,
  SoftwareItem,
} from "@/types/software/software.type";

/**
 * Obtener un listado paginado de software, con filtro opcional por texto de búsqueda y estado activo/inactivo.
 * Endpoint: GET /software
 */
export const getSoftwareList = async (
  params?: GetSoftwareParams,
): Promise<ApiResponse<NestedPaginatedResponse<SoftwareItem>>> => {
  const response = await api.get<
    ApiResponse<NestedPaginatedResponse<SoftwareItem>>
  >("/software", { params });
  return response.data;
};

/**
 * Obtener software por ID
 * Endpoint: GET /software/{id}
 */
export const getSoftwareById = async (
  id: number | string,
): Promise<ApiResponse<SoftwareItem>> => {
  const response = await api.get<ApiResponse<SoftwareItem>>(`/software/${id}`);
  return response.data;
};
