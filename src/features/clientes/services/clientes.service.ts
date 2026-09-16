import { api } from "@/lib/axios";
import { Cliente } from "../types/cliente.entity";
import {
  CreateClienteDto,
  UpdateClienteDto,
  GetClientesQueryDto,
} from "../types/cliente.dtos";
import {
  OptionDto,
  ClienteDetail,
  ClienteDetailApiResponse,
  ClienteMutationResponse,
} from "../types/cliente.response";

export const clienteService = {
  /**
   * GET /clientes
   * Listar clientes con paginación y filtros
   */
  getClientes: async (filters: GetClientesQueryDto) => {
    const { data } = await api.get("/clientes", { params: filters });

    return {
      clientes: (data?.data?.data as Cliente[]) || [],
      meta: {
        total: data?.data?.total ?? 0,
        page: data?.data?.page ?? 1,
        limit: data?.data?.limit ?? 10,
        totalPages: data?.data?.totalPages ?? 1,
      },
    };
  },

  /**
   * POST /clientes
   * Crear un cliente (soporta sucursal principal y adicionales)
   */
  createCliente: async (data: CreateClienteDto): Promise<ClienteDetail> => {
    const response = await api.post<ClienteMutationResponse>("/clientes", data);
    return response.data.data;
  },

  /**
   * GET /clientes/options
   * Listar clientes en formato opción (selects / autocompletes)
   */
  getClientesOptions: async (): Promise<OptionDto[]> => {
    const response = await api.get<OptionDto[]>("/clientes/options");
    return response.data;
  },

  /**
   * GET /clientes/{id}
   * Obtener el detalle completo de un cliente por su ID (incluye plan y sucursales)
   */
  getClienteById: async (id: number): Promise<ClienteDetail> => {
    const response = await api.get<ClienteDetailApiResponse>(`/clientes/${id}`);
    return response.data.data;
  },

  /**
   * PATCH /clientes/{id}
   * Actualizar un cliente existente
   */
  updateCliente: async (
    id: number,
    data: UpdateClienteDto,
  ): Promise<ClienteDetail> => {
    // Garantiza que la propiedad is_active no se envíe al endpoint de edición
    const { ...payload } = data as UpdateClienteDto & { is_active?: boolean };
    delete payload.is_active;

    const response = await api.patch<ClienteMutationResponse>(
      `/clientes/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * PATCH /clientes/{id}/toggle-status
   * Activar / desactivar el estado de un cliente
   */
  toggleClienteStatus: async (id: number): Promise<ClienteDetail> => {
    const response = await api.patch<ClienteMutationResponse>(
      `/clientes/${id}/toggle-status`,
    );
    return response.data.data;
  },
};
