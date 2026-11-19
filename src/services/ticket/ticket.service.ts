import { api } from "@/lib/axios";
import { ApiResponse, NestedPaginatedResponse } from "@/types/api.types";
import { TicketDetailBackend } from "@/types/ticket/ticket-chat.type";
import { createTicketRequest } from "@/types/ticket/ticket.request";
import { GetTicketsParams, TicketListItem } from "@/types/ticket/ticket.type";

/**
 * Obtener lista paginada y filtrada de tickets
 * Endpoint: GET /ticket
 */
export const getTickets = async (
  params?: GetTicketsParams,
): Promise<ApiResponse<NestedPaginatedResponse<TicketListItem>>> => {
  const response = await api.get<
    ApiResponse<NestedPaginatedResponse<TicketListItem>>
  >("/ticket", {
    params,
    paramsSerializer: (queryParams) => {
      if (!queryParams) return "";
      return Object.entries(queryParams)
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== "",
        )
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
        )
        .join("&");
    },
  });
  return response.data;
};

/**
 * Obtener el detalle completo de un ticket por ID
 * Endpoint: GET /ticket/{id}
 */
export const getTicketById = async (
  id: number | string,
): Promise<ApiResponse<TicketDetailBackend>> => {
  const response = await api.get<ApiResponse<TicketDetailBackend>>(
    `/ticket/${id}`,
  );
  return response.data;
};

/**
 * Crear un nuevo ticket
 * Endpoint: POST /ticket
 */
export const createTicket = async (request: createTicketRequest) => {
  const response = await api.post<ApiResponse<TicketDetailBackend>>(
    "/ticket",
    request,
  );
  return response.data;
};

/**
 * Cerrar un ticket existente
 * Endpoint: PATCH /ticket/{id}/close
 */
export const closeTicket = async (ticketId: number, reporte_cierre: string) => {
  const response = await api.patch<ApiResponse<null>>(
    `/ticket/${ticketId}/close`,
    { reporte_cierre },
  );
  return response.data;
};

/**
 * Reabrir un ticket existente
 * Endpoint: PATCH /ticket/{id}/reopen
 */
export const reopenTicket = async (
  ticketId: number,
  motivo_reapertura: string,
) => {
  const response = await api.patch<ApiResponse<null>>(
    `/ticket/${ticketId}/reopen`,
    { motivo_reapertura },
  );
  return response.data;
};

/**
 * Asignar un soporte a un ticket existente
 * Endpoint: PATCH /ticket/{id}/assign-support
 */
export const assignSupportToTicket = async (
  ticketId: number,
  idSoporte: number,
) => {
  const response = await api.patch<ApiResponse<null>>(
    `/ticket/${ticketId}/assign-support`,
    { idSoporte },
  );
  return response.data;
};
