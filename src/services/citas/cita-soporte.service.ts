import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import {
  AutoAsignarResponse,
  CreateSoftLockRequest,
  DerivarInSituRequest,
  FranjaDisponibilidad,
  SoftLockResponse,
} from "@/types/cita/cita-soporte.type";

// 1. Obtener sugerencia automática
export const getAutoAsignarInSitu = async (
  id_sucursal: number,
  fecha: string,
): Promise<AutoAsignarResponse> => {
  const response = await api.get<
    ApiResponse<AutoAsignarResponse> | AutoAsignarResponse
  >("/soft-lock/auto-asignar", { params: { id_sucursal, fecha } });
  // Soporta tanto si tu backend envuelve en { data: ... } como si lo devuelve directo
  return "data" in response.data && response.data.data !== undefined
    ? response.data.data
    : (response.data as AutoAsignarResponse);
};

// 2. Obtener franjas horarias de un técnico
export const getDisponibilidadTecnico = async (
  id_tecnico: number,
  fecha: string,
  id_sucursal: number,
): Promise<FranjaDisponibilidad[]> => {
  const response = await api.get<
    ApiResponse<FranjaDisponibilidad[]> | FranjaDisponibilidad[]
  >("/soft-lock/disponibilidad", {
    params: { id_tecnico, fecha, id_sucursal },
  });
  return "data" in response.data && Array.isArray(response.data.data)
    ? response.data.data
    : (response.data as FranjaDisponibilidad[]);
};

// 3. Crear bloqueo temporal (5 mins)
export const createSoftLock = async (
  payload: CreateSoftLockRequest,
): Promise<SoftLockResponse> => {
  const response = await api.post<
    ApiResponse<SoftLockResponse> | SoftLockResponse
  >("/soft-lock", payload);
  return "data" in response.data && response.data.data !== undefined
    ? response.data.data
    : (response.data as SoftLockResponse);
};

// 4. Confirmar y derivar ticket a In-Situ
export const derivarTicketInSitu = async (payload: DerivarInSituRequest) => {
  const response = await api.post("/citas-soporte/derivar", payload);
  return response.data;
};
