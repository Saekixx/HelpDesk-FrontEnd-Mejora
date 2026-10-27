import { useState, useCallback } from "react";
import {
  crearUsuario,
  actualizarUsuario,
  toggleUsuarioStatus,
} from "@/services/usuarios/usuario.service";
import { UsuarioRequest } from "@/types/usuario/usuario.request.type";

export const useUsuarioMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrear = useCallback(async (data: UsuarioRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await crearUsuario(data);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al crear el usuario.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleActualizar = useCallback(
    async (
      id: number,
      data: Partial<UsuarioRequest> & { resetPassword?: boolean },
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await actualizarUsuario(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Error al actualizar el usuario.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const handleToggleStatus = useCallback(async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const message = await toggleUsuarioStatus(id);
      return message;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Error al cambiar el estado del usuario.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    crearUsuario: handleCrear,
    actualizarUsuario: handleActualizar,
    toggleUsuarioStatus: handleToggleStatus,
    isSubmitting,
    error,
  };
};
