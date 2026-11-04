import { useState, useCallback } from "react";
import {
  createHardware,
  transitionHardware,
  updateHardware,
} from "@/services/hardware/hardware.service";
import {
  CreateHardwareDTO,
  TransitionHardwareDTO,
  UpdateHardwareDTO,
} from "@/types/hardware/hardware.request";

export const useHardwareMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrear = useCallback(async (data: CreateHardwareDTO) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await createHardware(data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Error al registrar el hardware.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleActualizar = useCallback(
    async (id: number | string, data: UpdateHardwareDTO) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await updateHardware(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Error al actualizar el hardware.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const handleTransicion = useCallback(
    async (id: number | string, data: TransitionHardwareDTO) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await transitionHardware(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "Error al cambiar el estado del hardware.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return {
    crearHardware: handleCrear,
    actualizarHardware: handleActualizar,
    transicionHardware: handleTransicion,
    isSubmitting,
    error,
  };
};
