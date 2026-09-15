import { useState } from "react";
import { areaService } from "../services/areas.service";
import { CreateAreaDto, UpdateAreaDto } from "../types/areas.dtos";
import { AreaListItem } from "../types/areas.entity";

interface UseAreaMutationsOptions {
  onSuccess?: () => void;
}

export const useAreaMutations = (options?: UseAreaMutationsOptions) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear nueva área
   */
  const createArea = async (
    data: CreateAreaDto,
  ): Promise<AreaListItem | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newArea = await areaService.createArea(data);
      options?.onSuccess?.();
      return newArea;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear el área";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Actualizar área
   */
  const updateArea = async (
    id: number,
    data: UpdateAreaDto,
  ): Promise<AreaListItem | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await areaService.updateArea(id, data);
      options?.onSuccess?.();
      return updated;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al actualizar el área";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cambiar estado de activación del área
   */
  const toggleStatus = async (id: number): Promise<AreaListItem | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const toggled = await areaService.toggleAreaStatus(id);
      options?.onSuccess?.();
      return toggled;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al cambiar el estado del área";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createArea,
    updateArea,
    toggleStatus,
    isSubmitting,
    error,
  };
};
