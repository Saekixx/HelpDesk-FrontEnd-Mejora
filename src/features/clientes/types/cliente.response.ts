import { Cliente } from "./cliente.entity";

export interface PaginatedClientesResponse {
  data: Cliente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OptionDto {
  value: number | string;
  label: string;
}
