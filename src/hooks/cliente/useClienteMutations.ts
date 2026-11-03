import { useState, useCallback } from "react";
import {
  crearCliente,
  actualizarCliente,
  toggleClienteStatus,
} from "@/services/clientes/cliente.service";
import {
  CrearClientePayload,
  ActualizarClientePayload,
} from "@/types/cliente/cliente.request.type";

export const useClienteMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // CREAR CLIENTE (ATÓMICO)
  const handleCrear = useCallback(async (data: CrearClientePayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await crearCliente(data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Error al crear la empresa cliente.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // ACTUALIZAR CLIENTE
  const handleActualizar = useCallback(
    async (id: number, data: ActualizarClientePayload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await actualizarCliente(id, data);
        return response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "Error al actualizar los datos del cliente.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // TOGGLE STATUS
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
