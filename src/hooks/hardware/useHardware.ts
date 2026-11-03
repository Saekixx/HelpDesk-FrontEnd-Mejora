import { useState, useEffect, useCallback } from "react";
import {
  getHardwareList,
  getHardwareById,
} from "@/services/hardware/hardware.service";
import {
  HardwareItem,
  GetHardwareParams,
} from "@/types/hardware/hardware.types";

export const useHardware = () => {
  const [queryParams, setQueryParams] = useState<GetHardwareParams>({
    page: 1,
    limit: 10,
  });

  const [hardwareList, setHardwareList] = useState<HardwareItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener listado con filtros y paginación
  const fetchHardwareList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHardwareList(queryParams);

      if (response && response.data) {
        const items = response.data.data || [];
        const paginationMeta = response.data.meta || {
          total: 0,
          page: 1,
          totalPages: 1,
        };

        setHardwareList(items);
        setMeta({
          total: paginationMeta.total,
          page: paginationMeta.page,
          lastPage: paginationMeta.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar el hardware de la API:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al cargar el hardware.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchHardwareList();
  }, [fetchHardwareList]);

  // Manejo de filtros y paginación
  const updateQuery = (newFilters: Record<string, any>) => {
    setQueryParams((prev) => {
      const updated: Record<string, any> = { ...prev, ...newFilters, page: 1 };

      Object.keys(updated).forEach((key) => {
        if (
          updated[key] === undefined ||
          updated[key] === null ||
          updated[key] === "all" ||
          updated[key] === ""
        ) {
          delete updated[key];
        } else if (
          ["id_cliente", "id_sucursal", "id_area", "page", "limit"].includes(
            key,
          )
        ) {
          updated[key] = Number(updated[key]);
        }
      });

      return updated as GetHardwareParams;
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
    hardwareList,
    meta,
    isLoading,
    error,
    queryParams,
    limit: queryParams.limit || 10,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch: fetchHardwareList,
  };
};

/**
 * Hook específico para obtener un componente de hardware por ID (FindById)
 */
export const useHardwareDetail = (id: number | string | undefined) => {
  const [hardware, setHardware] = useState<HardwareItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHardwareDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHardwareById(id);
      if (response && response.data) {
        setHardware(response.data);
      }
    } catch (err: any) {
      console.error(`Error al obtener el hardware con id ${id}:`, err);
      setError(
        err?.response?.data?.message ||
          "No se pudo cargar el detalle del hardware.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHardwareDetail();
  }, [fetchHardwareDetail]);

  return {
    hardware,
    isLoading,
    error,
    refetch: fetchHardwareDetail,
  };
};
