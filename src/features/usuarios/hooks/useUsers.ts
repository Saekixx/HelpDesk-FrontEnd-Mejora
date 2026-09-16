/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { getUsersService } from "../services/users.service";
import { GetUsersQueryParams, UserListItem } from "../types/user.entity";
import { PaginationMeta } from "../types/user.responses";

export const useUsers = (
  initialParams: GetUsersQueryParams = { page: 1, limit: 5 },
) => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetUsersQueryParams>(
    () => initialParams,
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUsersService(filters);
      setUsers(result.data);
      setMeta(result.meta);
    } catch {
      setError("Error al cargar la lista de usuarios");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setFilterValues = (newFilters: Partial<GetUsersQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    users,
    meta,
    loading,
    error,
    filters,
    setPage,
    setFilterValues,
    refetch: fetchUsers,
  };
};
