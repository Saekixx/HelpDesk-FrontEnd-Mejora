import { api } from "@/lib/axios";
import { TicketEntity } from "../types/ticket.entity";
import {
  GetTicketsQueryParamsDto,
  CreateTicketDto,
  AssignSupportDto,
} from "../types/ticket.dto";
import {
  GetTicketsResponse,
  CreateTicketResponse,
} from "../types/ticket.response";

export const ticketService = {
  /**
   * GET /ticket
   * Obtener lista de tickets con filtros y paginación
   */
  getTickets: async (filters?: GetTicketsQueryParamsDto) => {
    const { data } = await api.get<GetTicketsResponse>("/ticket", {
      params: filters,
    });

    return {
      tickets: data?.data?.data || [],
      meta: {
        total: data?.data?.total ?? 0,
        page: data?.data?.page ?? 1,
        limit: data?.data?.limit ?? 10,
        totalPages: data?.data?.totalPages ?? 1,
      },
    };
  },

  /**
   * POST /ticket
   * Crear un nuevo ticket de soporte
   */
  createTicket: async (
    data: CreateTicketDto,
  ): Promise<TicketEntity | undefined> => {
    const response = await api.post<CreateTicketResponse>("/ticket", data);
    return response.data.data;
  },

  /**
   * PATCH /ticket/assign-support
   * Asignar personal de soporte a un ticket
   */
  assignSupport: async (data: AssignSupportDto): Promise<void> => {
    await api.patch("/ticket/assign-support", data);
  },

  /**
   * PATCH /ticket/{id}/start-chat
   * Iniciar la atención/chat de un ticket (cambia estado a En Progreso)
   */
  startChat: async (id: number): Promise<void> => {
    await api.patch(`/ticket/${id}/start-chat`);
  },

  /**
   * PATCH /ticket/{id}/reopen
   * Reabrir un ticket cerrado
   */
  reopenTicket: async (id: number): Promise<void> => {
    await api.patch(`/ticket/${id}/reopen`);
  },

  /**
   * PATCH /ticket/{id}/close
   * Cerrar un ticket
   */
  closeTicket: async (id: number): Promise<void> => {
    await api.patch(`/ticket/${id}/close`);
  },
};
