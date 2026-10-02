import { useState } from "react";
import { ticketService } from "../services/tickets.service";
import { CreateTicketDto, AssignSupportDto } from "../types/ticket.dto";
import { TicketEntity } from "../types/ticket.entity";

interface UseTicketMutationsOptions {
  onSuccess?: () => void;
}

export const useTicketMutations = (options?: UseTicketMutationsOptions) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear ticket
   */
  const createTicket = async (
    data: CreateTicketDto,
  ): Promise<TicketEntity | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newTicket = await ticketService.createTicket(data);
      options?.onSuccess?.();
      return newTicket ?? null;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al crear el ticket";
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Asignar soporte
   */
  const assignSupport = async (data: AssignSupportDto): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await ticketService.assignSupport(data);
      options?.onSuccess?.();
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al asignar soporte";
      setError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Iniciar atención / chat
   */
  const startChat = async (id: number): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await ticketService.startChat(id);
      options?.onSuccess?.();
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al iniciar la atención del ticket";
      setError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reabrir ticket
   */
  const reopenTicket = async (id: number): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await ticketService.reopenTicket(id);
      options?.onSuccess?.();
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al reabrir el ticket";
      setError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cerrar ticket
   */
  const closeTicket = async (id: number): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await ticketService.closeTicket(id);
      options?.onSuccess?.();
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al cerrar el ticket";
      setError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createTicket,
    assignSupport,
    startChat,
    reopenTicket,
    closeTicket,
    isSubmitting,
    error,
  };
};
