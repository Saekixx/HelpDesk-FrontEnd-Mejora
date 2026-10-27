import { useState, useCallback } from "react";
import {
  crearCliente,
  actualizarCliente,
  toggleClienteStatus,
} from "@/services/clientes/cliente.service";
import { ClienteRequest } from "@/types/cliente/cliente.request.type";

export const useClienteMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrear = useCallback(async (data: ClienteRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await crearCliente(data);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al crear el cliente.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleActualizar = useCallback(
    async (id: number, data: Partial<ClienteRequest>) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await actualizarCliente(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Error al actualizar el cliente.";
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
      const message = await toggleClienteStatus(id);
      return message;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Error al cambiar el estado del cliente.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    crearCliente: handleCrear,
    actualizarCliente: handleActualizar,
    toggleClienteStatus: handleToggleStatus,
    isSubmitting,
    error,
  };
};
