import { useState, useCallback } from "react";
import {
  crearPlan,
  actualizarPlan,
  togglePlanStatus,
} from "@/services/planes/plan.service";
import { PlanRequest } from "@/types/planes/plan.request.type";

export const usePlanMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // CREAR
  const handleCrear = useCallback(async (data: PlanRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await crearPlan(data);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al crear el plan.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // ACTUALIZAR
  const handleActualizar = useCallback(
    async (id: number, data: Partial<PlanRequest>) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await actualizarPlan(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Error al actualizar el plan.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // CAMBIAR ESTADO (ACTIVAR / DESACTIVAR)
  const handleToggleStatus = useCallback(async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const message = await togglePlanStatus(id);
      return message;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Error al cambiar el estado del plan.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    crearPlan: handleCrear,
    actualizarPlan: handleActualizar,
    togglePlanStatus: handleToggleStatus,
    isSubmitting,
    error,
  };
};
