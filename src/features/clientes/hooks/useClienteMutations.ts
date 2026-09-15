import { useState } from "react";
import { clienteService } from "../services/clientes.service";
import { CreateClienteDto, UpdateClienteDto } from "../types/cliente.dtos";
import { Cliente } from "../types/cliente.entity";

interface UseClienteMutationsOptions {
  onSuccess?: () => void;
}

export const useClienteMutations = (options?: UseClienteMutationsOptions) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear un nuevo cliente (POST /clientes)
   */
  const createCliente = async (
    data: CreateClienteDto,
  ): Promise<Cliente | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newCliente = await clienteService.createCliente(data);
      options?.onSuccess?.();
      return newCliente;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al crear el cliente";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Actualizar un cliente existente (PATCH /clientes/{id})
   */
  const updateCliente = async (
    id: number,
    data: UpdateClienteDto,
  ): Promise<Cliente | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedCliente = await clienteService.updateCliente(id, data);
      options?.onSuccess?.();
      return updatedCliente;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al actualizar el cliente";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cambiar estado activo/inactivo de un cliente (PATCH /clientes/{id}/toggle-status)
   */
  const toggleStatus = async (id: number): Promise<Cliente | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const clienteToggled = await clienteService.toggleClienteStatus(id);
      options?.onSuccess?.();
      return clienteToggled;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al cambiar el estado del cliente";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createCliente,
    updateCliente,
    toggleStatus,
    isSubmitting,
    error,
  };
};
