import { TicketEntity } from "./ticket.entity";

// Estructura de la data paginada devuelta en GET /ticket
export interface PaginatedTicketsData {
  data: TicketEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Respuesta completa de GET /ticket
export interface GetTicketsResponse {
  status: number;
  message: string;
  data: PaginatedTicketsData;
}

// Respuesta estándar para POST /ticket u otros endpoints genéricos
export interface CreateTicketResponse {
  status: number;
  message: string;
  data?: TicketEntity; // O void/any según si tu backend retorna el objeto creado
}
