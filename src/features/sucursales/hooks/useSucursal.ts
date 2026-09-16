/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { sucursalService } from "../services/sucursales.service";
import { SucursalListItem } from "../types/sucursal.entity";
import { GetSucursalesFilterDto } from "../types/sucursal.dtos";

export const useSucursales = (
  initialParams: GetSucursalesFilterDto = { page: 1, limit: 10 },
) => {
  const [sucursales, setSucursales] = useState<SucursalListItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetSucursalesFilterDto>(
    () => initialParams,
  );

  const fetchSucursales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { sucursales: dataList, meta: metaData } =
        await sucursalService.getSucursales(filters);

      setSucursales(dataList);
      setMeta(metaData);
    } catch {
      setError("Error al cargar las sucursales");
      setSucursales([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setFilterValues = (newFilters: Partial<GetSucursalesFilterDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    sucursales,
    meta,
    loading,
    error,
    filters,
    setPage,
    setFilterValues,
    refetch: fetchSucursales,
  };
};
