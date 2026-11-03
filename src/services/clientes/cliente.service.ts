import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import {
  ActualizarClientePayload,
  CrearClientePayload,
} from "@/types/cliente/cliente.request.type";
import {
  GetClientesParams,
  ClienteListItem,
  ClienteDetail,
  ClienteDetailData,
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
 * Obtiene el detalle completo del cliente/empresa para el modal de vista.
 * Endpoint: GET /clientes/{id}
 */
export const getClienteDetailById = async (
  id: number,
): Promise<ApiResponse<ClienteDetailData>> => {
  const response = await api.get<ApiResponse<ClienteDetailData>>(
    `/clientes/${id}`,
  );
  return response.data;
};

/**
 * Registra una empresa cliente y su cuenta principal (Operación atómica)
 * Endpoint: POST /clientes/create
 */
export const crearCliente = async (
  data: CrearClientePayload,
): Promise<ApiResponse<ClienteDetail>> => {
  const response = await api.post<ApiResponse<ClienteDetail>>(
    "/clientes",
    data,
  );
  return response.data;
};

/**
 * Actualiza los datos parciales de un cliente existente por ID
 * Endpoint: PATCH /clientes/{id}
 */
export const actualizarCliente = async (
  id: number,
  data: ActualizarClientePayload,
): Promise<ApiResponse<ClienteDetail>> => {
  const response = await api.patch<ApiResponse<ClienteDetail>>(
    `/clientes/${id}`,
    data,
  );
  return response.data;
};

/**
 * Alterna el estado (Activo/Inactivo) de un cliente por ID
 * Endpoint: PATCH /clientes/{id}/toggle-status
 */
export const toggleClienteStatus = async (id: number): Promise<string> => {
  const response = await api.patch<ApiResponse<null>>(
    `/clientes/${id}/toggle-status`,
  );
  return response.data.message;
};
