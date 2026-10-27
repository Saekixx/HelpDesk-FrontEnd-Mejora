import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { PlanRequest } from "@/types/planes/plan.request.type";
import { PlanDetail, PlanItem } from "@/types/planes/plan.types";

/**
 * Obtener lista de todos los planes
 * Endpoint: GET /planes
 */
export const getPlanes = async (): Promise<ApiResponse<PlanItem[]>> => {
  const response = await api.get<ApiResponse<PlanItem[]>>("/planes");
  return response.data;
};

/**
 * Obtener el detalle de un plan por ID
 * Endpoint: GET /planes/{id}
 */
export const getPlanById = async (
  id: number,
): Promise<ApiResponse<PlanDetail>> => {
  const response = await api.get<ApiResponse<PlanDetail>>(`/planes/${id}`);
  return response.data;
};

/**
 * Crear un nuevo plan
 * Endpoint: POST /planes/create
 */
export const crearPlan = async (
  data: PlanRequest,
): Promise<ApiResponse<PlanDetail>> => {
  const response = await api.post<ApiResponse<PlanDetail>>(
    "/planes/create",
    data,
  );
  return response.data;
};

/**
 * Actualizar un plan existente
 * Endpoint: PATCH /planes/{id}
 */
export const actualizarPlan = async (
  id: number,
  data: Partial<PlanRequest>,
): Promise<ApiResponse<PlanDetail>> => {
  const response = await api.patch<ApiResponse<PlanDetail>>(
    `/planes/${id}`,
    data,
  );
  return response.data;
};

/**
 * Alternar estado del plan (Activo/Inactivo)
 * Endpoint: PATCH /planes/{id}/status
 */
export const togglePlanStatus = async (id: number): Promise<string> => {
  const response = await api.patch<ApiResponse<null>>(`/planes/${id}/status`);
  return response.data.message;
};
