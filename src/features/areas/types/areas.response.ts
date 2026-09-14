import { AreaListItem } from "./areas.entity";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedAreasData {
  data: AreaListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedAreasApiResponse = ApiResponse<PaginatedAreasData>;
