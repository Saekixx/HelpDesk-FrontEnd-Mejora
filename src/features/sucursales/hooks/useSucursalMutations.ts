import { useState } from "react";
import { sucursalService } from "../services/sucursales.service";
import { CreateSucursalDto, UpdateSucursalDto } from "../types/sucursal.dtos";
import { SucursalListItem } from "../types/sucursal.entity";

interface UseSucursalMutationsOptions {
  onSuccess?: () => void;
}

export const useSucursalMutations = (options?: UseSucursalMutationsOptions) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear sucursal
   */
  const createSucursal = async (
    data: CreateSucursalDto,
  ): Promise<SucursalListItem | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newSucursal = await sucursalService.createSucursal(data);
      options?.onSuccess?.();
      return newSucursal;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al crear la sucursal";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Actualizar sucursal
   */
  const updateSucursal = async (
    id: number,
    data: UpdateSucursalDto,
  ): Promise<SucursalListItem | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await sucursalService.updateSucursal(id, data);
      options?.onSuccess?.();
      return updated;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al actualizar la sucursal";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cambiar estado activo/inactivo
   */
  const toggleStatus = async (id: number): Promise<SucursalListItem | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const toggled = await sucursalService.toggleSucursalStatus(id);
      options?.onSuccess?.();
      return toggled;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al cambiar el estado de la sucursal";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createSucursal,
    updateSucursal,
    toggleStatus,
    isSubmitting,
    error,
  };
};
