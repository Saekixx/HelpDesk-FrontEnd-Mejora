import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import {
  GetSoftwareParams,
  SoftwareBovedaResponse,
  SoftwareItem,
} from "@/types/software/software.type";
import {
  CreateSoftwareDTO,
  UpdateSoftwareDTO,
  AssignSoftwareDTO,
} from "@/types/software/software.request.type";

/**
 * Obtener listado paginado y filtrado de software
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

/**
 * Obtener la bóveda de software con sus equipos vinculados, capacidad y llave maestra
 * Endpoint: GET /software/{id}/boveda
 */
export const getSoftwareBoveda = async (
  id: number | string,
): Promise<ApiResponse<SoftwareBovedaResponse>> => {
  const response = await api.get<ApiResponse<SoftwareBovedaResponse>>(
    `/software/${id}/boveda`,
  );
  return response.data;
};

/**
 * Registrar un nuevo software
 * Endpoint: POST /software/create
 */
export const createSoftware = async (
  data: CreateSoftwareDTO,
): Promise<ApiResponse<SoftwareItem>> => {
  const response = await api.post<ApiResponse<SoftwareItem>>(
    "/software/create",
    data,
  );
  return response.data;
};

/**
 * Actualizar un software existente
 * Endpoint: PATCH /software/{id}
 */
export const updateSoftware = async (
  id: number | string,
  data: UpdateSoftwareDTO,
): Promise<ApiResponse<SoftwareItem>> => {
  const response = await api.patch<ApiResponse<SoftwareItem>>(
    `/software/${id}`,
    data,
  );
  return response.data;
};

/**
 * Asignar un equipo al software (Bóveda)
 * Endpoint: POST /software/{id}/assign
 */
export const assignSoftware = async (
  id: number | string,
  data: AssignSoftwareDTO,
): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(
    `/software/${id}/assign`,
    data,
  );
  return response.data;
};

/**
 * Liberar un equipo asignado al software (Tabla pivote software_equipos)
 * Endpoint: PATCH /software/equipment/{idAssignment}/release
 */
export const releaseSoftwareAssignment = async (
  idAssignment: number | string,
): Promise<string> => {
  const response = await api.patch<ApiResponse<any>>(
    `/software/equipment/${idAssignment}/release`,
  );
  return response.data.message || "Equipo liberado exitosamente.";
};

/**
 * Alternar estado del software (Activo/Inactivo)
 * Endpoint: PATCH /software/{id}/status
 */
export const toggleSoftwareStatus = async (
  id: number | string,
): Promise<string> => {
  const response = await api.patch<ApiResponse<any>>(`/software/${id}/status`);
  return response.data.message || "Estado actualizado correctamente.";
};
