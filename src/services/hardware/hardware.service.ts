import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import {
  CreateHardwareDTO,
  TransitionHardwareDTO,
  UpdateHardwareDTO,
} from "@/types/hardware/hardware.request";
import {
  EstadoHardwareApi,
  GetHardwareParams,
  HardwareDetailResponse,
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
 * Obtener hoja de vida / detalle completo de un hardware por su ID
 * Endpoint: GET /hardware/{id}
 */
export const getHardwareById = async (
  id: number | string,
): Promise<ApiResponse<HardwareDetailResponse>> => {
  const response = await api.get<ApiResponse<HardwareDetailResponse>>(
    `/hardware/${id}`,
  );
  return response.data;
};

/**
 * Registrar un nuevo componente de hardware
 * Endpoint: POST /hardware
 */
export const createHardware = async (
  data: CreateHardwareDTO,
): Promise<ApiResponse<HardwareItem>> => {
  const response = await api.post<ApiResponse<HardwareItem>>("/hardware", data);
  return response.data;
};

/**
 * Actualizar la ficha técnica de un componente de hardware
 * Endpoint: PATCH /hardware/{id}
 */
export const updateHardware = async (
  id: number | string,
  data: UpdateHardwareDTO,
): Promise<ApiResponse<HardwareItem>> => {
  const response = await api.patch<ApiResponse<HardwareItem>>(
    `/hardware/${id}`,
    data,
  );
  return response.data;
};

/**
 * Cambiar el estado de un hardware con trazabilidad (Instalar, Enviar a Mantenimiento, Disponible, Baja)
 * Endpoint: PATCH /hardware/{id}/transition
 */
export const transitionHardware = async (
  id: number | string,
  data: TransitionHardwareDTO,
): Promise<ApiResponse<HardwareItem>> => {
  const response = await api.patch<ApiResponse<HardwareItem>>(
    `/hardware/${id}/transition`,
    data,
  );
  return response.data;
};
