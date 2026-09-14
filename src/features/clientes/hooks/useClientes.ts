/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { clienteService } from "../services/clientes.service";
import { Cliente } from "../types/cliente.entity";
import { GetClientesQueryDto } from "../types/cliente.dtos";

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
    setPage,
    setFilterValues,
    refetch: fetchClientes,
  };
};
