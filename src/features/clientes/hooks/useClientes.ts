/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { clienteService } from "../services/clientes.service";
import { Cliente } from "../types/cliente.entity";
import { GetClientesQueryDto } from "../types/cliente.dtos";
import { ClienteDetail } from "../types/cliente.response";

export const useClientes = (
  initialParams: GetClientesQueryDto = { page: 1, limit: 10 },
) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetClientesQueryDto>(initialParams);

  // Estado adicional para el cliente seleccionado en el modal
  const [selectedCliente, setSelectedCliente] = useState<ClienteDetail | null>(
    null,
  );
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { clientes: dataList, meta: metaData } =
        await clienteService.getClientes(filters);

      setClientes(dataList);
      setMeta(metaData);
    } catch {
      setError("Error al cargar los clientes");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  /**
   * Obtener detalle completo de un cliente por ID (para el modal de ver detalle)
   */
  const getClienteDetails = async (
    id: number,
  ): Promise<ClienteDetail | null> => {
    setLoadingDetail(true);
    try {
      const data = await clienteService.getClienteById(id);
      setSelectedCliente(data);
      return data;
    } catch {
      setError("Error al obtener el detalle del cliente");
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  /**
   * Limpiar el cliente seleccionado al cerrar el modal
   */
  const clearSelectedCliente = () => {
    setSelectedCliente(null);
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setFilterValues = (newFilters: Partial<GetClientesQueryDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    clientes,
    meta,
    loading,
    error,
    filters,
    selectedCliente,
    loadingDetail,
    getClienteDetails,
    clearSelectedCliente,
    setPage,
    setFilterValues,
    refetch: fetchClientes,
  };
};
