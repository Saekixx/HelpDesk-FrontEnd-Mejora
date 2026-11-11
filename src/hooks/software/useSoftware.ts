import { useState, useEffect, useCallback } from "react";
import {
  getSoftwareList,
  getSoftwareById,
  getSoftwareBoveda,
} from "@/services/software/software.service";
import {
  SoftwareItem,
  GetSoftwareParams,
  SoftwareBovedaResponse,
} from "@/types/software/software.type";

export const useSoftware = () => {
  const [queryParams, setQueryParams] = useState<GetSoftwareParams>({
    page: 1,
    limit: 10,
  });

  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener listado con soporte para arreglo directo o paginado
  const fetchSoftwareList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSoftwareList(queryParams);

      if (response && response.data) {
        let items: SoftwareItem[] = [];
        let totalRecords = 0;
        let currentPage = queryParams.page || 1;
        let totalPages = 1;

        // Soporte si el backend devuelve un arreglo directo o un objeto con .data y .meta
        if (Array.isArray(response.data)) {
          items = response.data;
          totalRecords = items.length;
        } else if (
          typeof response.data === "object" &&
          response.data !== null
        ) {
          const paginatedData = response.data as any;
          items = paginatedData.data || [];
          totalRecords = paginatedData.meta?.total || items.length;
          currentPage = paginatedData.meta?.page || currentPage;
          totalPages = paginatedData.meta?.totalPages || totalPages;
        }

        setSoftwareList(items);
        setMeta({
          total: totalRecords,
          page: currentPage,
          lastPage: totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar el software de la API:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al cargar el software.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchSoftwareList();
  }, [fetchSoftwareList]);

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
        } else if (["page", "limit"].includes(key)) {
          updated[key] = Number(updated[key]);
        } else if (key === "is_active") {
          if (updated[key] === "true") updated[key] = true;
          if (updated[key] === "false") updated[key] = false;
        }
      });

      return updated as GetSoftwareParams;
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
    softwareList,
    meta,
    isLoading,
    error,
    queryParams,
    limit: queryParams.limit || 10,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch: fetchSoftwareList,
  };
};

/**
 * Hook específico para obtener un registro de software por ID (FindById)
 */
export const useSoftwareDetail = (id: number | string | undefined) => {
  const [software, setSoftware] = useState<SoftwareItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSoftwareDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSoftwareById(id);
      if (response && response.data) {
        setSoftware(response.data as any);
      }
    } catch (err: any) {
      console.error(`Error al obtener el software con id ${id}:`, err);
      setError(
        err?.response?.data?.message ||
          "No se pudo cargar el detalle del software.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSoftwareDetail();
  }, [fetchSoftwareDetail]);

  return {
    software,
    isLoading,
    error,
    refetch: fetchSoftwareDetail,
  };
};

export const useSoftwareBoveda = (id: number | string | undefined) => {
  const [boveda, setBoveda] = useState<SoftwareBovedaResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSoftwareBoveda = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSoftwareBoveda(id);
      if (response && response.data) {
        setBoveda(response.data);
      }
    } catch (err: any) {
      console.error(
        `Error al obtener la bóveda del software con id ${id}:`,
        err,
      );
      setError(
        err?.response?.data?.message ||
          "No se pudo cargar la bóveda del software.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSoftwareBoveda();
  }, [fetchSoftwareBoveda]);

  return {
    boveda,
    isLoading,
    error,
    refetch: fetchSoftwareBoveda,
  };
};
