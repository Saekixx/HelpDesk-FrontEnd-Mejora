import { useState } from "react";
import { toast } from "sonner";
import { createTicketRequest } from "@/types/ticket/ticket.request";
import {
  createTicket,
  closeTicket,
  reopenTicket,
  assignSupportToTicket,
} from "@/services/ticket/ticket.service";

export const useTicketMutations = (onSuccessCallback?: () => void) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isReopening, setIsReopening] = useState<boolean>(false);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  // Crear ticket
  const createTicketHandler = async (data: createTicketRequest) => {
    setIsCreating(true);
    try {
      const response = await createTicket(data);
      toast.success("Ticket creado exitosamente");
      onSuccessCallback?.();
      return response;
    } catch (error: any) {
      console.error("Error al crear ticket:", error);
      const errorMessage =
        error?.response?.data?.message || "Ocurrió un error al crear el ticket";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Cerrar ticket
  const closeTicketHandler = async (
    ticketId: number,
    reporteCierre: string,
  ) => {
    setIsClosing(true);
    try {
      const response = await closeTicket(ticketId, reporteCierre);
      toast.success("Ticket cerrado exitosamente");
      onSuccessCallback?.();
      return response;
    } catch (error: any) {
      console.error("Error al cerrar ticket:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Ocurrió un error al cerrar el ticket";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsClosing(false);
    }
  };

  // Reabrir ticket
  const reopenTicketHandler = async (
    ticketId: number,
    motivoReapertura: string,
  ) => {
    setIsReopening(true);
    try {
      const response = await reopenTicket(ticketId, motivoReapertura);
      toast.success("Ticket reabierto exitosamente");
      onSuccessCallback?.();
      return response;
    } catch (error: any) {
      console.error("Error al reabrir ticket:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Ocurrió un error al reabrir el ticket";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsReopening(false);
    }
  };

  // Asignar soporte
  const assignSupportHandler = async (ticketId: number, idSoporte: number) => {
    setIsAssigning(true);
    try {
      const response = await assignSupportToTicket(ticketId, idSoporte);
      toast.success("Soporte asignado exitosamente");
      onSuccessCallback?.();
      return response;
    } catch (error: any) {
      console.error("Error al asignar soporte:", error);
      const errorMessage =
        error?.response?.data?.message || "Ocurrió un error al asignar soporte";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    createTicket: createTicketHandler,
    closeTicket: closeTicketHandler,
    reopenTicket: reopenTicketHandler,
    assignSupport: assignSupportHandler,
    isCreating,
    isClosing,
    isReopening,
    isAssigning,
  };
};
