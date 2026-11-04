import { useState, useEffect, useCallback } from "react";
import {
  getHardwareById,
  getHardwareList,
} from "@/services/hardware/hardware.service";
import {
  GetHardwareParams,
  HardwareDetailResponse,
  HardwareItem,
} from "@/types/hardware/hardware.types";

interface UseHardwareOptions {
  initialParams?: GetHardwareParams;
}

/**
 * Hook para la tabla y listado paginado de Hardware
 */
export const useHardware = (options?: UseHardwareOptions) => {
  const [queryParams, setQueryParams] = useState<GetHardwareParams>({
    page: 1,
    limit: 10,
    ...(options?.initialParams || {}),
  });

  const [hardwareList, setHardwareList] = useState<HardwareItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHardware = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHardwareList(queryParams);
      if (response && response.data) {
        setHardwareList(response.data.data || []);
        const paginationMeta = response.data.meta || {
          total: 0,
          page: 1,
          totalPages: 1,
        };
        setMeta({
          total: paginationMeta.total,
          page: paginationMeta.page,
          lastPage: paginationMeta.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar la lista de hardware:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al obtener el hardware.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchHardware();
  }, [fetchHardware]);

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
    setQueryParams({
      page: 1,
      limit: 10,
    });
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
    refetch: fetchHardware,
    resetQuery,
  };
};

/**
 * Hook para obtener la Hoja de Vida / Detalle completo de un hardware por ID
 */
export const useHardwareDetail = (id: number | string | undefined) => {
  const [hardware, setHardware] = useState<HardwareDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHardwareById(id);
      if (response && response.data) {
        setHardware(response.data);
      }
    } catch (err: any) {
      console.error("Error al obtener el detalle del hardware:", err);
      setError(
        err?.response?.data?.message || "No se pudo obtener el hardware.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    hardware,
    isLoading,
    error,
    refetchDetail: fetchDetail,
  };
};
