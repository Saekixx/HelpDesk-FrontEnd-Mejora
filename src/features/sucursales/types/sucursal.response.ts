import { SucursalListItem } from "./sucursal.entity";

export interface PaginatedSucursalesResponse {
  statusCode: number;
  message: string;
  data: {
    data: SucursalListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
