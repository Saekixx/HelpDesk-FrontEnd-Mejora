import { api } from "@/lib/axios";
import {
  EquipoDetail,
  EquipoListItem,
  GetEquiposQueryParams,
} from "../types/equipo.entity";
import { CreateEquipoDto, UpdateEquipoDto } from "../types/equipo.dtos";
import {
  EquiposApiResponse,
  EquipoSingleApiResponse,
  EquipoDetailApiResponse,
  EquipoActionApiResponse,
  PaginationMeta,
} from "../types/equipo.responses";

// GET /equipos -> Listar equipos con filtrado y paginación
export const getEquiposService = async (
  params?: GetEquiposQueryParams,
): Promise<{ data: EquipoListItem[]; meta: PaginationMeta }> => {
  const response = await api.get<EquiposApiResponse>("/equipos", { params });
  const paginatedData = response.data.data;

  return {
    data: paginatedData.data,
    meta: {
      total: paginatedData.total,
      page: paginatedData.page,
      limit: paginatedData.limit,
      totalPages: paginatedData.totalPages,
    },
  };
};

// GET /equipos/:id -> Obtener detalle completo del equipo
export const getEquipoByIdService = async (
  id: number,
): Promise<EquipoDetail> => {
  const response = await api.get<EquipoDetailApiResponse>(`/equipos/${id}`);
  return response.data.data;
};

// POST /equipos -> Registrar nuevo equipo
export const createEquipoService = async (
  dto: CreateEquipoDto,
): Promise<EquipoListItem> => {
  const response = await api.post<EquipoSingleApiResponse>("/equipos", dto);
  return response.data.data;
};

// PUT /equipos/:id -> Actualizar equipo existente
export const updateEquipoService = async (
  id: number,
  dto: UpdateEquipoDto,
): Promise<EquipoListItem> => {
  const response = await api.put<EquipoSingleApiResponse>(
    `/equipos/${id}`,
    dto,
  );
  return response.data.data;
};

// PATCH /equipos/:id/toggle-status -> Activar/desactivar estado
export const toggleEquipoStatusService = async (
  id: number,
): Promise<EquipoActionApiResponse> => {
  const response = await api.patch<EquipoActionApiResponse>(
    `/equipos/${id}/toggle-status`,
  );
  return response.data;
};
