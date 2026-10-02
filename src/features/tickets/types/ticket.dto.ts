// Query params para GET /ticket
export interface GetTicketsQueryParamsDto {
  search?: string;
  estado?: string;
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  page?: number;
  limit?: number;
  id_soporte?: number;
}

// Request body para POST /ticket
export interface CreateTicketDto {
  asunto: string;
  detalle: string;
  equipoId: number;
  essoftware: boolean;
}

// Request body para PATCH /ticket/assign-support
export interface AssignSupportDto {
  id_ticket: number;
  id_soporte: number;
}
