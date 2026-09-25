/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { getEquiposService } from "../services/equipos.service";
import { EquipoListItem, GetEquiposQueryParams } from "../types/equipo.entity";
import { PaginationMeta } from "../types/equipo.responses";

export const useEquipos = (
  initialParams: GetEquiposQueryParams = { page: 1, limit: 10 },
) => {
  const [equipos, setEquipos] = useState<EquipoListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetEquiposQueryParams>(
    () => initialParams,
  );

  const fetchEquipos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEquiposService(filters);
      setEquipos(result.data);
      setMeta(result.meta);
    } catch {
      setError("Error al cargar la lista de equipos");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchEquipos();
  }, [fetchEquipos]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setFilterValues = (newFilters: Partial<GetEquiposQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    equipos,
    meta,
    loading,
    error,
    filters,
    setPage,
    setFilterValues,
    refetch: fetchEquipos,
  };
};
