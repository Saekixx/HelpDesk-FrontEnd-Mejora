import { api } from "@/lib/axios";
import { Sucursal } from "../types/sucursal.entity";
import {
  CreateSucursalDto,
  UpdateSucursalDto,
  GetSucursalesFilterDto,
  OptionDto,
} from "../types/sucursal.dtos";
import { PaginatedSucursalesResponse } from "../types/sucursal.response";

export const sucursalService = {
  /**
   * GET /sucursales
   * Listar sucursales con paginación, filtros y búsqueda
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
  createSucursal: async (data: CreateSucursalDto): Promise<Sucursal> => {
    const response = await api.post<Sucursal>("/sucursales", data);
    return response.data;
  },

  /**
   * GET /sucursales/{id}/options
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
   * Obtener una sucursal por ID
   */
  getSucursalById: async (id: number): Promise<Sucursal> => {
    const response = await api.get<Sucursal>(`/sucursales/${id}`);
    return response.data;
  },

  /**
   * PATCH /sucursales/{id}
   * Actualizar una sucursal
   */
  updateSucursal: async (
    id: number,
    data: UpdateSucursalDto,
  ): Promise<Sucursal> => {
    const response = await api.patch<Sucursal>(`/sucursales/${id}`, data);
    return response.data;
  },

  /**
   * PATCH /sucursales/{id}/toggle-status
   * Activar / desactivar sucursal
   */
  toggleSucursalStatus: async (id: number): Promise<Sucursal> => {
    const response = await api.patch<Sucursal>(
      `/sucursales/${id}/toggle-status`,
    );
    return response.data;
  },
};
