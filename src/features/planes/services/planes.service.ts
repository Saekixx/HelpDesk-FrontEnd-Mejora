import { api } from "@/lib/axios";
import {
  ApiResponse,
  CreatePlanDto,
  Plan,
  UpdatePlanDto,
} from "../types/planes.types";

export const getPlanesService = async (): Promise<Plan[]> => {
  const { data } = await api.get<ApiResponse<Plan[]>>("/planes");
  return data.data;
};

export const getPlanByIdService = async (id: number): Promise<Plan> => {
  const { data } = await api.get<ApiResponse<Plan>>(`/planes/${id}`);
  return data.data;
};

export const createPlanService = async (dto: CreatePlanDto): Promise<Plan> => {
  const { data } = await api.post<ApiResponse<Plan>>("/planes/create", dto);
  return data.data;
};

export const updatePlanService = async (
  id: number,
  payload: UpdatePlanDto,
): Promise<Plan> => {
  const { data } = await api.patch<ApiResponse<Plan>>(`/planes/${id}`, payload);
  return data.data;
};

export const togglePlanStatusService = async (id: number): Promise<string> => {
  const { data } = await api.patch<ApiResponse<Plan>>(`/planes/${id}/status`);
  return data.message;
};
