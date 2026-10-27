import { useState, useCallback } from "react";
import {
  crearSucursal,
  actualizarSucursal,
  toggleSucursalStatus,
} from "@/services/sucursales/sucursal.service";
import { SucursalRequest } from "@/types/sucursal/sucursal.request.type";

export const useSucursalMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // CREAR
  const handleCrear = useCallback(async (data: SucursalRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await crearSucursal(data);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al crear la sucursal.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // ACTUALIZAR / EDITAR
  const handleActualizar = useCallback(
    async (id: number, data: Partial<SucursalRequest>) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await actualizarSucursal(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Error al actualizar la sucursal.";
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
      const message = await toggleSucursalStatus(id);
      return message;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Error al cambiar el estado de la sucursal.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    crearSucursal: handleCrear,
    actualizarSucursal: handleActualizar,
    toggleSucursalStatus: handleToggleStatus,
    isSubmitting,
    error,
  };
};
