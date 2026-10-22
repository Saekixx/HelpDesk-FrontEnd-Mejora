import { useMemo, useState } from "react";

interface UseTableDataOptions<T> {
  data: T[];
  filterFn?: (item: T, queryParams: Record<string, any>) => boolean;
}

export function useTableData<T>({ data, filterFn }: UseTableDataOptions<T>) {
  // Estado local para los filtros, página y límite (Adiós URL sucia)
  const [queryParams, setQueryParams] = useState<Record<string, any>>({
    page: 1,
    limit: 10,
  });

  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar filtros y reiniciar a la página 1
  const updateQuery = (newFilters: Record<string, any>) => {
    setQueryParams((prev) => {
      // Tipamos explícitamente el objeto para permitir indexación por string y borrado
      const updated: Record<string, any> = { ...prev, ...newFilters, page: 1 };

      // Limpiar valores vacíos o "all"
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

      return updated;
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

  // Filtrado y Paginación sobre los datos
  const paginatedResult = useMemo(() => {
    let filtered = [...data];

    if (filterFn) {
      filtered = filtered.filter((item) => filterFn(item, queryParams));
    } else {
      if (queryParams.search) {
        const term = queryParams.search.toLowerCase();
        filtered = filtered.filter((item) =>
          Object.values(item as any).some((val) =>
            String(val).toLowerCase().includes(term),
          ),
        );
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }, [data, queryParams, page, limit, filterFn]);

  return {
    queryParams,
    page,
    limit,
    isLoading,
    setIsLoading,
    data: paginatedResult.data,
    meta: {
      total: paginatedResult.total,
      page: paginatedResult.page,
      lastPage: paginatedResult.totalPages,
    },
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
  };
}
