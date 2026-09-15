import { SucursalListItem } from "./sucursal.entity";

export interface PaginatedSucursalesResponse {
  status?: number;
  statusCode?: number;
  message: string;
  data: {
    data: SucursalListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SucursalMutationResponse {
  status?: number;
  message: string;
  data: SucursalListItem;
}
