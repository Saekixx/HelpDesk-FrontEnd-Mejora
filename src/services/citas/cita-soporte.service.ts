import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import {
  AutoAsignarResponse,
  CitaSoporteDetail,
  CitasSoporteListResponse,
  CreateSoftLockRequest,
  DerivarInSituRequest,
  FranjaDisponibilidad,
  GetCitasSoporteParams,
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

// 5. Obtener lista de citas de soporte con filtros y paginación
export const getCitasSoporte = async (
  params?: GetCitasSoporteParams,
): Promise<CitasSoporteListResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const response = await api.get<CitasSoporteListResponse>("/citas-soporte", {
    params: cleanParams,
  });

  return response.data;
};

// 6. Obtener detalle completo de una cita de soporte por ID
export const getCitaSoporteById = async (
  id: number | string,
): Promise<CitaSoporteDetail> => {
  const response = await api.get<
    ApiResponse<CitaSoporteDetail> | CitaSoporteDetail
  >(`/citas-soporte/${id}`);

  return "data" in response.data && response.data.data !== undefined
    ? response.data.data
    : (response.data as CitaSoporteDetail);
};
