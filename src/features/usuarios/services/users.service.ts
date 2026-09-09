import { api } from "@/lib/axios";
import {
  GetUsersQueryParams,
  UsersApiResponse,
  UserListItem,
  PaginationMeta,
} from "../types/user.types";

export const getUsersService = async (
  params: GetUsersQueryParams,
): Promise<{ data: UserListItem[]; meta: PaginationMeta }> => {
  const response = await api.get<UsersApiResponse>("/usuario", { params });
  const paginatedData = response.data.data;

  return {
    data: paginatedData.data,
    meta: {
      total: paginatedData.total,
      page: paginatedData.page,
      limit: paginatedData.limit,
      totalPages: paginatedData.totalPages,
    },
  };
};
