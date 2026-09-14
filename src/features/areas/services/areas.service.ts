import { api } from "@/lib/axios";
import { Area, AreaListItem } from "../types/areas.entity";
import {
  GetAreasFilterDto,
  CreateAreaDto,
  UpdateAreaDto,
  OptionDto,
} from "../types/areas.dtos";
import { PaginatedAreasApiResponse } from "../types/areas.response";

export const areaService = {
  // GET /areas
  getAreas: async (filters: GetAreasFilterDto = {}) => {
    const { data: response } = await api.get<PaginatedAreasApiResponse>(
      "/areas",
      { params: filters },
    );

    const paginatedData = response.data;

    return {
      areas: paginatedData.data,
      meta: {
        total: paginatedData.total,
        page: paginatedData.page,
        limit: paginatedData.limit,
        totalPages: paginatedData.totalPages,
      },
    };
  },

  // GET /areas/:id
  getAreaById: async (id: number): Promise<Area> => {
    const { data } = await api.get<{ data: Area }>(`/areas/${id}`);
    return data.data;
  },

  // GET /areas/:sucursalId/options
  getAreasOptions: async (sucursalId: number): Promise<OptionDto[]> => {
    const { data } = await api.get<{ data: OptionDto[] }>(
      `/areas/${sucursalId}/options`,
    );
    return data.data;
  },

  // POST /areas
  createArea: async (dto: CreateAreaDto): Promise<Area> => {
    const { data } = await api.post<{ data: Area }>("/areas", dto);
    return data.data;
  },

  // PATCH /areas/:id
  updateArea: async (id: number, dto: UpdateAreaDto): Promise<Area> => {
    const { data } = await api.patch<{ data: Area }>(`/areas/${id}`, dto);
    return data.data;
  },

  // PATCH /areas/:id/toggle-status
  toggleAreaStatus: async (id: number): Promise<AreaListItem> => {
    const { data } = await api.patch<{ data: AreaListItem }>(
      `/areas/${id}/toggle-status`,
    );
    return data.data;
  },
};
