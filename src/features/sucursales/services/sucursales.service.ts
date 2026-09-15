import { api } from "@/lib/axios";
import { SucursalListItem } from "../types/sucursal.entity";
import {
  CreateSucursalDto,
  UpdateSucursalDto,
  GetSucursalesFilterDto,
  OptionDto,
} from "../types/sucursal.dtos";
import {
  PaginatedSucursalesResponse,
  SucursalMutationResponse,
} from "../types/sucursal.response";

export const sucursalService = {
  /**
   * GET /sucursales
   * Listar sucursales con paginación y filtros
   */
  getSucursales: async (filters: GetSucursalesFilterDto) => {
    const { data } = await api.get<PaginatedSucursalesResponse>("/sucursales", {
      params: filters,
    });

    return {
      sucursales: data?.data?.data || [],
      meta: {
        total: data?.data?.total ?? 0,
        page: data?.data?.page ?? 1,
        limit: data?.data?.limit ?? 10,
        totalPages: data?.data?.totalPages ?? 1,
      },
    };
  },

  /**
   * POST /sucursales
   * Crear una sucursal
   */
  createSucursal: async (
    data: CreateSucursalDto,
  ): Promise<SucursalListItem> => {
    const response = await api.post<SucursalMutationResponse>(
      "/sucursales",
      data,
    );
    return response.data.data;
  },

  /**
   * GET /sucursales/{clienteId}/options
   * Listar sucursales de un cliente en formato opción
   */
  getSucursalesOptions: async (clienteId: number): Promise<OptionDto[]> => {
    const response = await api.get<OptionDto[]>(
      `/sucursales/${clienteId}/options`,
    );
    return response.data;
  },

  /**
   * GET /sucursales/{id}
   * Obtener sucursal por ID
   */
  getSucursalById: async (id: number): Promise<SucursalListItem> => {
    const response = await api.get<SucursalMutationResponse>(
      `/sucursales/${id}`,
    );
    return response.data.data;
  },

  /**
   * PATCH /sucursales/{id}
   * Actualizar una sucursal
   */
  updateSucursal: async (
    id: number,
    data: UpdateSucursalDto,
  ): Promise<SucursalListItem> => {
    const response = await api.patch<SucursalMutationResponse>(
      `/sucursales/${id}`,
      data,
    );
    return response.data.data;
  },

  /**
   * PATCH /sucursales/{id}/toggle-status
   * Activar / desactivar sucursal
   */
  toggleSucursalStatus: async (id: number): Promise<SucursalListItem> => {
    const response = await api.patch<SucursalMutationResponse>(
      `/sucursales/${id}/toggle-status`,
    );
    return response.data.data;
  },
};
