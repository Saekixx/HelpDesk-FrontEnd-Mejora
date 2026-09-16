// shared/services/catalog.service.ts
import { api } from "@/lib/axios";
import { RoleOptionResponse, SelectOption } from "../types/select-option.types";

export const getRolesOptions = async (): Promise<SelectOption<number>[]> => {
  // Desestructuramos response.data de axios
  const response = await api.get<{ data: RoleOptionResponse[] }>(
    "/role/options",
  );

  // Accedemos al arreglo interno: response.data.data
  const rolesArray = response.data.data;

  return rolesArray.map((role) => ({
    value: role.id_rol,
    label: role.nombre.replace(/_/g, " "), // Reemplazamos guiones bajos por espacios
  }));
};

// GET /clientes/options -> Obtener opciones de clientes
export const getClientesOptions = async (): Promise<SelectOption<number>[]> => {
  const response = await api.get<{
    data: { id: number; nombre: string }[];
  }>("/clientes/options");
  const clientsArray = response.data.data;

  return clientsArray.map((client) => ({
    value: client.id,
    label: client.nombre,
  }));
};

// GET /sucursales/:empresaId/options -> Obtener opciones de sucursales por empresa
export const getSucursalesOptions = async (
  empresaId: number,
): Promise<SelectOption<number>[]> => {
  const response = await api.get<{
    data: { id: number; nombre: string }[];
  }>(`/sucursales/${empresaId}/options`);
  const branchesArray = response.data.data;

  return branchesArray.map((branch) => ({
    value: branch.id,
    label: branch.nombre,
  }));
};

// GET /areas/:sucursalId/options -> Obtener opciones de áreas por sucursal
export const getAreasOptions = async (
  sucursalId: number,
): Promise<SelectOption<number>[]> => {
  const response = await api.get<{
    data: { id: number; nombre: string }[];
  }>(`/areas/${sucursalId}/options`);
  const branchesArray = response.data.data;

  return branchesArray.map((branch) => ({
    value: branch.id,
    label: branch.nombre,
  }));
};

// GET /planes/options -> Obtener opciones de planes
export const getPlanesOptions = async (): Promise<SelectOption<number>[]> => {
  const response = await api.get<{
    data: { id: number; nombre: string }[];
  }>("/planes/options");
  const plansArray = response.data.data;
  return plansArray.map((plan) => ({
    value: plan.id,
    label: plan.nombre,
  }));
};
