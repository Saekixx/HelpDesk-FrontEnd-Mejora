export interface TicketUserEntity {
  id: number;
  nombre: string;
}

export interface TicketEquipoEntity {
  id: number;
  tipo_equipo: string;
}

export interface TicketClienteEntity {
  id: number;
  nombre: string;
}

export interface TicketSucursalEntity {
  id: number;
  nombre: string;
}

export interface TicketAreaEntity {
  id: number;
  nombre: string;
}

export interface TicketSoporteEntity {
  id: number;
  nombre: string;
}

export interface TicketEntity {
  id_tickets: number;
  pin: string;
  asunto: string;
  fecha_creacion: string; // ISO Date String
  estado: string;
  usuario: TicketUserEntity;
  equipo: TicketEquipoEntity;
  cliente: TicketClienteEntity;
  sucursal: TicketSucursalEntity;
  area: TicketAreaEntity;
  soporte: TicketSoporteEntity | null;
}
