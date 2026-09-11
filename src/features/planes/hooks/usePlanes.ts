/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { Plan, CreatePlanDto, UpdatePlanDto } from "../types/planes.types";
import {
  getPlanesService,
  togglePlanStatusService,
  createPlanService,
  updatePlanService,
} from "../services/planes.service";

export const usePlanes = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlanesService();
      setPlanes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al cargar los planes");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = async (data: CreatePlanDto): Promise<Plan> => {
    try {
      const newPlan = await createPlanService(data);
      if (newPlan && newPlan.id_plan) {
        setPlanes((prev) => [...prev, newPlan]);
      } else {
        await fetchPlanes();
      }
      return newPlan;
    } catch (err: any) {
      console.error("Error al crear el plan:", err);
      throw err;
    }
  };

  const updatePlan = async (id: number, data: UpdatePlanDto): Promise<Plan> => {
    try {
      const updatedPlan = await updatePlanService(id, data);

      // Si la API retorna el objeto Plan completo con su id_plan
      if (updatedPlan && updatedPlan.id_plan) {
        setPlanes((prev) =>
          prev.map((p) => (p.id_plan === id ? { ...p, ...updatedPlan } : p)),
        );
      } else {
        // Si el backend no envía el objeto completo, reconsultamos los datos
        await fetchPlanes();
      }

      return updatedPlan;
    } catch (err: any) {
      console.error("Error al actualizar el plan:", err);
      throw err;
    }
  };

  const toggleStatus = async (id: number): Promise<string> => {
    try {
      const messageResponse = await togglePlanStatusService(id);

      setPlanes((prev) =>
        prev.map((p) =>
          p.id_plan === id ? { ...p, is_active: !p.is_active } : p,
        ),
      );

      return messageResponse;
    } catch (err: any) {
      console.error("Error al cambiar estado del plan", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  return {
    planes,
    loading,
    error,
    refetch: fetchPlanes,
    createPlan,
    updatePlan,
    toggleStatus,
  };
};
