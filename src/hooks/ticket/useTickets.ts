import { useState, useEffect, useCallback } from "react";
import { getTicketById, getTickets } from "@/services/ticket/ticket.service";
import {
  TicketListItem,
  GetTicketsParams,
  mapEstadoTicket,
} from "@/types/ticket/ticket.type";
import { TicketDetailBackend } from "@/types/ticket/ticket-chat.type";
import { createSocketConnection } from "@/lib/socket";

interface UseTicketsOptions {
  initialParams?: GetTicketsParams;
  userId?: string | number;
}

export const useTickets = (options?: UseTicketsOptions) => {
  const [queryParams, setQueryParams] = useState<GetTicketsParams>({
    page: 1,
    limit: 10,
    ...(options?.initialParams || {}),
  });

  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener listado de tickets con mapeo de estados limpios
  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const paramsToSend = { ...queryParams };
      const response = await getTickets(paramsToSend);

      if (response && response.data) {
        const rawItems = response.data.data || [];

        // Mapeamos los estados del backend (ej: EN_PROGRESO) al formato limpio del frontend (En Progreso)
        const items: TicketListItem[] = rawItems.map((t: any) => ({
          ...t,
          estado: mapEstadoTicket(t.estado),
        }));

        const paginationMeta = response.data.meta || {
          total: 0,
          page: 1,
          totalPages: 1,
        };

        setTickets(items);
        setMeta({
          total: paginationMeta.total,
          page: paginationMeta.page,
          lastPage: paginationMeta.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar los tickets de la API:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al cargar los tickets.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Cargar tickets al montar el componente y cuando cambian los parámetros de consulta
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Refrescar tickets en tiempo real mediante Sockets
  useEffect(() => {
    const userId = options?.userId;
    if (!userId) return;

    const socket = createSocketConnection(String(userId), "tickets");

    socket.on("connect", () => {
      console.log("Conectado al namespace de tickets:", socket.id);
      socket.emit("join_tickets_room", { roomId: "tickets_dashboard" });
      socket.emit("join_tickets_room", { roomId: `user_${userId}` });
    });

    socket.on("refresh_tickets_list", (data) => {
      console.log("Actualización de tickets recibida:", data);
      fetchTickets();
    });

    socket.on("ticket_assigned", (data) => {
      console.log("Te asignaron un ticket:", data);
      fetchTickets();
    });

    return () => {
      socket.disconnect();
    };
  }, [options?.userId, fetchTickets]);

  // Manejo de filtros y paginación
  const updateQuery = (newFilters: Record<string, any>) => {
    setQueryParams((prev) => {
      const updated: Record<string, any> = { ...prev, ...newFilters, page: 1 };

      Object.keys(updated).forEach((key) => {
        if (
          updated[key] === undefined ||
          updated[key] === null ||
          updated[key] === "all" ||
          updated[key] === "" ||
          updated[key] === "Todos"
        ) {
          delete updated[key];
        } else if (
          [
            "id_cliente",
            "id_sucursal",
            "id_area",
            "id_trabajador",
            "id_soporte",
            "page",
            "limit",
          ].includes(key)
        ) {
          updated[key] = Number(updated[key]);
        }
      });

      return updated as GetTicketsParams;
    });
  };

  const setPage = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const setLimit = (newLimit: number) => {
    setQueryParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const resetQuery = () => {
    setQueryParams({ page: 1, limit: 10, ...(options?.initialParams || {}) });
  };

  return {
    tickets,
    meta,
    isLoading,
    error,
    queryParams,
    limit: queryParams.limit || 10,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch: fetchTickets,
  };
};

// Hook para obtener el detalle de un ticket por ID con estado mapeado
export const useTicketDetail = (id: string | number | undefined) => {
  const [ticket, setTicket] = useState<TicketDetailBackend | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketDetail = useCallback(async () => {
    if (!id) return;
    setIsLoadingDetail(true);
    setError(null);
    try {
      const response = await getTicketById(id);
      if (response && response.data) {
        const rawTicket = response.data;
        // Limpiamos y mapeamos el estado del detalle también por seguridad
        const sanitizedTicket: TicketDetailBackend = {
          ...rawTicket,
          estado: mapEstadoTicket(rawTicket.estado),
        };
        setTicket(sanitizedTicket);
      }
    } catch (err: any) {
      console.error("Error al cargar el detalle del ticket:", err);
      setError(err?.response?.data?.message || "No se pudo cargar el ticket.");
    } finally {
      setIsLoadingDetail(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicketDetail();
  }, [fetchTicketDetail]);

  return {
    ticket,
    isLoadingDetail,
    error,
    refetchDetail: fetchTicketDetail,
  };
};
