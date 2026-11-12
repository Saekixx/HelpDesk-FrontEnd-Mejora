import { useState } from "react";
import { toast } from "sonner";
import { createTicketRequest } from "@/types/ticket/ticket.request";
import { createTicket } from "@/services/ticket/ticket.service";

export const useTicketMutations = (onSuccessCallback?: () => void) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);

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

  return {
    createTicket: createTicketHandler,
    isCreating,
  };
};
