import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import {
  GetHardwareParams,
  HardwareItem,
} from "@/types/hardware/hardware.types";

/**
 * Obtener listado paginado y filtrado de hardware
 * Endpoint: GET /hardware
 */
export const getHardwareList = async (
  params?: GetHardwareParams,
): Promise<ApiResponse<NestedPaginatedResponse<HardwareItem>>> => {
  const response = await api.get<
    ApiResponse<NestedPaginatedResponse<HardwareItem>>
  >("/hardware", { params });
  return response.data;
};

/**
 * Obtener detalle de un hardware por su ID
 * Endpoint: GET /hardware/{id}
 */
export const getHardwareById = async (
  id: number | string,
): Promise<ApiResponse<HardwareItem>> => {
  const response = await api.get<ApiResponse<HardwareItem>>(`/hardware/${id}`);
  return response.data;
};
