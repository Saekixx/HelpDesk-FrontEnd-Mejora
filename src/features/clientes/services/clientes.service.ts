import { api } from "@/lib/axios";
import { Cliente } from "../types/cliente.entity";
import {
  CreateClienteDto,
  UpdateClienteDto,
  GetClientesQueryDto,
} from "../types/cliente.dtos";
import { OptionDto } from "../types/cliente.response";

export const clienteService = {
  /**
   * GET /clientes
   * Listar clientes con paginación y filtros
   */
  getClientes: async (filters: GetClientesQueryDto) => {
    const { data } = await api.get("/clientes", { params: filters });

    // Desempaquetado del JSON de backend ({ status, message, data: { data: [], total, ... } })
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
   * Crear un cliente
   */
  createCliente: async (data: CreateClienteDto): Promise<Cliente> => {
    const response = await api.post<Cliente>("/clientes", data);
    return response.data;
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
   * Obtener un cliente por su ID
   */
  getClienteById: async (id: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  /**
   * PATCH /clientes/{id}
   * Actualizar un cliente existente
   */
  updateCliente: async (
    id: number,
    data: UpdateClienteDto,
  ): Promise<Cliente> => {
    const response = await api.patch<Cliente>(`/clientes/${id}`, data);
    return response.data;
  },

  /**
   * PATCH /clientes/{id}/toggle-status
   * Activar / desactivar el estado de un cliente
   */
  toggleClienteStatus: async (id: number): Promise<Cliente> => {
    const response = await api.patch<Cliente>(`/clientes/${id}/toggle-status`);
    return response.data;
  },
};
