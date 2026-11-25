import { useState, useEffect, useCallback } from "react";
import {
  getCitasSoporte,
  getCitaSoporteById,
} from "@/services/citas/cita-soporte.service";
import {
  CitaSoporteDetail,
  CitaSoporteListItem,
  GetCitasSoporteParams,
} from "@/types/cita/cita-soporte.type";
import { toast } from "sonner";

export const useCitasSoporte = (initialParams?: GetCitasSoporteParams) => {
  const [params, setParams] = useState<GetCitasSoporteParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [citas, setCitas] = useState<CitaSoporteListItem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCitas = useCallback(
    async (overrideParams?: GetCitasSoporteParams) => {
      const queryParams = { ...params, ...overrideParams };
      setIsLoading(true);
      setError(null);

      try {
        const res = await getCitasSoporte(queryParams);
        const list = Array.isArray(res?.data) ? res.data : [];
        const meta = res?.meta;

        setCitas(list);
        setPagination({
          total: res?.total ?? meta?.total ?? list.length,
          page: res?.page ?? meta?.page ?? queryParams.page ?? 1,
          limit: res?.limit ?? meta?.limit ?? queryParams.limit ?? 10,
          totalPages: res?.totalPages ?? meta?.totalPages ?? 1,
        });
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          "No se pudieron obtener las citas de soporte.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  const updateParams = (newParams: Partial<GetCitasSoporteParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page ?? 1,
    }));
  };

  return {
    citas,
    pagination,
    params,
    isLoading,
    error,
    updateParams,
    refetch: fetchCitas,
  };
};

export const useCitaSoporteDetail = (id?: number | string | null) => {
  const [cita, setCita] = useState<CitaSoporteDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setCita(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getCitaSoporteById(id);
      setCita(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "No se pudo obtener el detalle de la cita.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    cita,
    isLoading,
    error,
    refetch: fetchDetail,
  };
};
