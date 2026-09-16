/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { areaService } from "../services/areas.service";
import { AreaListItem } from "../types/areas.entity";
import { GetAreasFilterDto } from "../types/areas.dtos";

export const useAreas = (
  initialParams: GetAreasFilterDto = { page: 1, limit: 10 },
) => {
  const [areas, setAreas] = useState<AreaListItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetAreasFilterDto>(
    () => initialParams,
  );

  const fetchAreas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { areas: dataList, meta: metaData } =
        await areaService.getAreas(filters);

      setAreas(dataList);
      setMeta(metaData);
    } catch {
      setError("Error al cargar las áreas");
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setFilterValues = (newFilters: Partial<GetAreasFilterDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    areas,
    meta,
    loading,
    error,
    filters,
    setPage,
    setFilterValues,
    refetch: fetchAreas,
  };
};
