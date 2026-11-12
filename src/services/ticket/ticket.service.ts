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
  >("/ticket", { params });
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
