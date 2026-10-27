import { useState, useEffect, useCallback } from "react";
import {
  getSucursales,
  getSucursalById,
} from "@/services/sucursales/sucursal.service";
import {
  SucursalListItem,
  SucursalDetail,
  GetSucursalesParams,
} from "@/types/sucursal/sucursal.types";

export const useSucursales = () => {
  const [queryParams, setQueryParams] = useState<GetSucursalesParams>({
    page: 1,
    limit: 10,
  });

  const [sucursales, setSucursales] = useState<SucursalListItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  // Estados para la lista
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para obtener el detalle por ID
  const [selectedSucursal, setSelectedSucursal] =
    useState<SucursalDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  // 1. Obtener listado de sucursales
  const fetchSucursales = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSucursales(queryParams);

      if (response && response.data) {
        const items = response.data.data || [];
        const paginationMeta = response.data.meta || {
          total: 0,
          page: 1,
          totalPages: 1,
        };

        setSucursales(items);
        setMeta({
          total: paginationMeta.total,
          page: paginationMeta.page,
          lastPage: paginationMeta.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar sucursales de la API:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al cargar las sucursales.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  // 2. Obtener el detalle completo de una sucursal por ID (VER)
  const getDetalleSucursal = useCallback(async (id: number) => {
    setIsLoadingDetail(true);
    try {
      const response = await getSucursalById(id);
      setSelectedSucursal(response.data);
      return response.data;
    } catch (err: any) {
      console.error("Error al obtener detalle de la sucursal:", err);
      throw err;
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // Manejo de Filtros y Paginación
  const updateQuery = (newFilters: Record<string, any>) => {
    setQueryParams((prev) => {
      const updated: Record<string, any> = { ...prev, ...newFilters, page: 1 };

      if (updated.is_active !== undefined) {
        if (updated.is_active === "true") updated.is_active = true;
        else if (updated.is_active === "false") updated.is_active = false;
        else if (updated.is_active === "all") delete updated.is_active;
      }

      if (updated.id_cliente && updated.id_cliente !== "all") {
        updated.id_cliente = Number(updated.id_cliente);
      } else {
        delete updated.id_cliente;
      }

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

      return updated as GetSucursalesParams;
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
    // Datos del listado
    sucursales,
    meta,
    isLoading,
    error,
    queryParams,
    limit: queryParams.limit || 10,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch: fetchSucursales,

    // Consulta de Detalle (VER)
    selectedSucursal,
    isLoadingDetail,
    getDetalleSucursal,
    clearSelectedSucursal: () => setSelectedSucursal(null),
  };
};
