import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import { ClienteRequest } from "@/types/cliente/cliente.request.type";
import {
  GetClientesParams,
  ClienteListItem,
  ClienteDetail,
} from "@/types/cliente/cliente.types";

/**
 * Obtener lista paginada y filtrada de clientes (Listado Avanzado)
 * Endpoint: GET /clientes
 */
export const getClientes = async (
  params?: GetClientesParams,
): Promise<ApiResponse<NestedPaginatedResponse<ClienteListItem>>> => {
  const response = await api.get<
    ApiResponse<NestedPaginatedResponse<ClienteListItem>>
  >("/clientes", { params });
  return response.data;
};

/**
 * Obtener el detalle completo de un cliente por ID (incluyendo plan y sucursales)
 * Endpoint: GET /clientes/{id}
 */
export const getClienteById = async (
  id: number,
): Promise<ApiResponse<ClienteDetail>> => {
  const response = await api.get<ApiResponse<ClienteDetail>>(`/clientes/${id}`);
  return response.data;
};

/**
 * Crea un nuevo cliente en el sistema
 * Endpoint: POST /clientes
 */
export const crearCliente = async (
  data: ClienteRequest,
): Promise<ApiResponse<ClienteDetail>> => {
  const response = await api.post<ApiResponse<ClienteDetail>>(
    "/clientes/create",
    data,
  );
  return response.data;
};

/**
 * Actualiza un cliente existente por ID
 * Endpoint: PATCH /clientes/{id}
 */
export const actualizarCliente = async (
  id: number,
  data: Partial<ClienteRequest>,
): Promise<ApiResponse<ClienteDetail>> => {
  const response = await api.patch<ApiResponse<ClienteDetail>>(
    `/clientes/${id}`,
    data,
  );
  return response.data;
};

/**
 * Alterna el estado is_active de un cliente por ID (soft toggle)
 * Endpoint: PATCH /clientes/{id}/toggle-status
 */
export const toggleClienteStatus = async (id: number): Promise<string> => {
  const response = await api.patch<ApiResponse<null>>(
    `/clientes/${id}/toggle-status`,
  );
  return response.data.message;
};
