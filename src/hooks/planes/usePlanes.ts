import { useState, useEffect, useCallback } from "react";
import { getPlanes, getPlanById } from "@/services/planes/plan.service";
import { PlanDetail, PlanItem } from "@/types/planes/plan.types";

export const usePlanes = () => {
  const [planes, setPlanes] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para detalle por ID (VER)
  const [selectedPlan, setSelectedPlan] = useState<PlanDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  // 1. Obtener listado de planes
  const fetchPlanes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPlanes();
      if (response && response.data) {
        setPlanes(response.data || []);
      }
    } catch (err: any) {
      console.error("Error al cargar planes de la API:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al cargar los planes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  // 2. Obtener detalle por ID (VER)
  const getDetallePlan = useCallback(async (id: number) => {
    setIsLoadingDetail(true);
    try {
      const response = await getPlanById(id);
      setSelectedPlan(response.data);
      return response.data;
    } catch (err: any) {
      console.error("Error al obtener detalle del plan:", err);
      throw err;
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  return {
    planes,
    isLoading,
    error,
    refetch: fetchPlanes,

    // Detalle
    selectedPlan,
    isLoadingDetail,
    getDetallePlan,
    clearSelectedPlan: () => setSelectedPlan(null),
  };
};
