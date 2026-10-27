import { useState, useEffect, useCallback } from "react";
import { getClientes } from "@/services/clientes/cliente.service";
import {
  ClienteListItem,
  GetClientesParams,
} from "@/types/cliente/cliente.types";

export const useClientes = () => {
  // Estado para los parámetros de consulta (búsqueda, filtros, paginación)
  const [queryParams, setQueryParams] = useState<GetClientesParams>({
    page: 1,
    limit: 10,
  });

  const [clientes, setClientes] = useState<ClienteListItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los clientes desde la API
  const fetchClientes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getClientes(queryParams);

      if (response && response.data) {
        // Extraemos 'data' (array de clientes) y 'meta' (objeto de paginación)
        const items = response.data.data || [];
        const paginationMeta = response.data.meta || {
          total: 0,
          page: 1,
          totalPages: 1,
        };

        setClientes(items);
        setMeta({
          total: paginationMeta.total,
          page: paginationMeta.page,
          lastPage: paginationMeta.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar clientes de la API:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al cargar los clientes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Ejecutar la consulta cada vez que cambien los filtros o la paginación
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Actualizar filtros y reiniciar siempre a la página 1
  const updateQuery = (newFilters: Record<string, any>) => {
    setQueryParams((prev) => {
      const updated: Record<string, any> = { ...prev, ...newFilters, page: 1 };

      // CORRECCIÓN: Si el filtro manda 'estado' (ej. desde un Select), lo transformamos a 'is_active'
      if (updated.estado !== undefined) {
        if (updated.estado === "true" || updated.estado === true) {
          updated.is_active = true;
        } else if (updated.estado === "false" || updated.estado === false) {
          updated.is_active = false;
        } else {
          delete updated.is_active;
        }
        // Eliminamos la clave 'estado' para que la URL no la envíe
        delete updated.estado;
      }

      // Normalizar el estado (is_active) si se manda directamente
      if (updated.is_active !== undefined) {
        if (updated.is_active === "true") updated.is_active = true;
        else if (updated.is_active === "false") updated.is_active = false;
        else if (updated.is_active === "all") delete updated.is_active;
      }

      // Normalizar el tipo de cliente si aplica
      if (updated.tipo_cliente === "all" || !updated.tipo_cliente) {
        delete updated.tipo_cliente;
      }

      // Limpiar claves vacías, nulas o con valor "all"
      Object.keys(updated).forEach((key) => {
        if (
          updated[key] === undefined ||
          updated[key] === null ||
          updated[key] === "all" ||
          updated[key] === ""
        ) {
          delete updated[key];
        }
      });

      return updated as GetClientesParams;
    });
  };

  const setPage = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const setLimit = (newLimit: number) => {
    setQueryParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const resetQuery = () => {
    setQueryParams({ page: 1, limit: 10 });
  };

  return {
    clientes,
    meta,
    isLoading,
    error,
    queryParams,
    limit: queryParams.limit || 10,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch: fetchClientes,
  };
};
