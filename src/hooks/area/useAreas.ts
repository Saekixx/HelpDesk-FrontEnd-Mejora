import { useState, useEffect, useCallback } from "react";
import { getAreas, getAreaById } from "@/services/areas/area.service";
import {
  AreaListItem,
  AreaDetail,
  GetAreasParams,
} from "@/types/area/area.types";

export const useAreas = () => {
  const [queryParams, setQueryParams] = useState<GetAreasParams>({
    page: 1,
    limit: 10,
  });

  const [areas, setAreas] = useState<AreaListItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  // Estados de listado
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para detalle por ID (VER)
  const [selectedArea, setSelectedArea] = useState<AreaDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  // 1. Obtener listado
  const fetchAreas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAreas(queryParams);

      if (response && response.data) {
        const items = response.data.data || [];
        const paginationMeta = response.data.meta || {
          total: 0,
          page: 1,
          totalPages: 1,
        };

        setAreas(items);
        setMeta({
          total: paginationMeta.total,
          page: paginationMeta.page,
          lastPage: paginationMeta.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar áreas de la API:", err);
      setError(
        err?.response?.data?.message || "Ocurrió un error al cargar las áreas.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // 2. Obtener detalle por ID (VER)
  const getDetalleArea = useCallback(async (id: number) => {
    setIsLoadingDetail(true);
    try {
      const response = await getAreaById(id);
      setSelectedArea(response.data);
      return response.data;
    } catch (err: any) {
      console.error("Error al obtener detalle del área:", err);
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

      if (updated.id_sucursal && updated.id_sucursal !== "all") {
        updated.id_sucursal = Number(updated.id_sucursal);
      } else {
        delete updated.id_sucursal;
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

      return updated as GetAreasParams;
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
    areas,
    meta,
    isLoading,
    error,
    queryParams,
    limit: queryParams.limit || 10,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch: fetchAreas,

    // Detalle
    selectedArea,
    isLoadingDetail,
    getDetalleArea,
    clearSelectedArea: () => setSelectedArea(null),
  };
};
