import { useState, useCallback } from "react";
import {
  createSoftware,
  updateSoftware,
  assignSoftware,
  releaseSoftwareAssignment,
  toggleSoftwareStatus,
} from "@/services/software/software.service";
import {
  CreateSoftwareDTO,
  UpdateSoftwareDTO,
  AssignSoftwareDTO,
} from "@/types/software/software.request.type";

export const useSoftwareMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrear = useCallback(async (data: CreateSoftwareDTO) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await createSoftware(data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Error al registrar el software.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleActualizar = useCallback(
    async (id: number | string, data: UpdateSoftwareDTO) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await updateSoftware(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Error al actualizar el software.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const handleAsignar = useCallback(
    async (id: number | string, data: AssignSoftwareDTO) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await assignSoftware(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "Error al asignar el equipo al software.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const handleLiberar = useCallback(async (idAssignment: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const mensaje = await releaseSoftwareAssignment(idAssignment);
      return mensaje;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Error al liberar la asignación del equipo.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleToggleStatus = useCallback(async (id: number | string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const mensaje = await toggleSoftwareStatus(id);
      return mensaje;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Error al alternar el estado del software.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    crearSoftware: handleCrear,
    actualizarSoftware: handleActualizar,
    asignarSoftware: handleAsignar,
    liberarSoftware: handleLiberar,
    toggleSoftwareStatus: handleToggleStatus,
    isSubmitting,
    error,
  };
};
