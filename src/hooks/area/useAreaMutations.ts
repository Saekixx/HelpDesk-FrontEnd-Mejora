import { useState, useCallback } from "react";
import {
  crearArea,
  actualizarArea,
  toggleAreaStatus,
} from "@/services/areas/area.service";
import { AreaRequest } from "@/types/area/area.request.type";

export const useAreaMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // CREAR
  const handleCrear = useCallback(async (data: AreaRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await crearArea(data);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al crear el área.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // ACTUALIZAR
  const handleActualizar = useCallback(
    async (id: number, data: Partial<AreaRequest>) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await actualizarArea(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Error al actualizar el área.";
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
      const message = await toggleAreaStatus(id);
      return message;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Error al cambiar el estado del área.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    crearArea: handleCrear,
    actualizarArea: handleActualizar,
    toggleAreaStatus: handleToggleStatus,
    isSubmitting,
    error,
  };
};
