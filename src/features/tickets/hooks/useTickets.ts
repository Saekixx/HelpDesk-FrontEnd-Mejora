/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { ticketService } from "../services/tickets.service";
import { TicketEntity } from "../types/ticket.entity";
import { GetTicketsQueryParamsDto } from "../types/ticket.dto";

export const useTickets = (
  initialParams: GetTicketsQueryParamsDto = { page: 1, limit: 10 },
) => {
  const [tickets, setTickets] = useState<TicketEntity[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetTicketsQueryParamsDto>(
    () => initialParams,
  );

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { tickets: dataList, meta: metaData } =
        await ticketService.getTickets(filters);

      setTickets(dataList);
      setMeta(metaData);
    } catch {
      setError("Error al cargar los tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setFilterValues = (newFilters: Partial<GetTicketsQueryParamsDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    tickets,
    meta,
    loading,
    error,
    filters,
    setPage,
    setFilterValues,
    refetch: fetchTickets,
  };
};
