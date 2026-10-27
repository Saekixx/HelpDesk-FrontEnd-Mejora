import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import { SucursalRequest } from "@/types/sucursal/sucursal.request.type";
import {
  GetSucursalesParams,
  SucursalListItem,
  SucursalDetail,
} from "@/types/sucursal/sucursal.types";

/**
 * Obtener lista paginada y filtrada de sucursales
 * Endpoint: GET /sucursales
 */
export const getSucursales = async (
  params?: GetSucursalesParams,
): Promise<ApiResponse<NestedPaginatedResponse<SucursalListItem>>> => {
  const response = await api.get<
    ApiResponse<NestedPaginatedResponse<SucursalListItem>>
  >("/sucursales", { params });
  return response.data;
};

/**
 * Obtener el detalle completo de una sucursal por ID
 * Endpoint: GET /sucursales/{id}
 */
export const getSucursalById = async (
  id: number,
): Promise<ApiResponse<SucursalDetail>> => {
  const response = await api.get<ApiResponse<SucursalDetail>>(
    `/sucursales/${id}`,
  );
  return response.data;
};

/**
 * Crea una nueva sucursal en el sistema
 * Endpoint: POST /sucursales
 */
export const crearSucursal = async (
  data: SucursalRequest,
): Promise<ApiResponse<SucursalDetail>> => {
  const response = await api.post<ApiResponse<SucursalDetail>>(
    "/sucursales",
    data,
  );
  return response.data;
};

/**
 * Actualiza una sucursal existente por ID
 * Endpoint: PATCH /sucursales/{id}
 */
export const actualizarSucursal = async (
  id: number,
  data: Partial<SucursalRequest>,
): Promise<ApiResponse<SucursalDetail>> => {
  const response = await api.patch<ApiResponse<SucursalDetail>>(
    `/sucursales/${id}`,
    data,
  );
  return response.data;
};

/**
 * Alterna el estado is_active de una sucursal por ID (soft toggle)
 * Endpoint: PATCH /sucursales/{id}/toggle-status
 */
export const toggleSucursalStatus = async (id: number): Promise<string> => {
  const response = await api.patch<ApiResponse<null>>(
    `/sucursales/${id}/toggle-status`,
  );
  return response.data.message;
};
