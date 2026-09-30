// shared/services/catalog.service.ts
import { api } from "@/lib/axios";
import {
  RoleOptionResponse,
  SelectOption,
  UsuarioOptionResponse,
} from "../types/select-option.types";

export interface GetTrabajadoresOptionsParams {
  search?: string;
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  rol?: string;
}

export const getRolesOptions = async (): Promise<SelectOption<number>[]> => {
  const response = await api.get<{ data: RoleOptionResponse[] }>(
    "/role/options",
  );
  const rolesArray = response.data.data;

  return rolesArray.map((role) => ({
    value: role.id_rol,
    label: role.nombre.replace(/_/g, " "),
  }));
};

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

export const getTrabajadoresOptions = async (
  params?: GetTrabajadoresOptionsParams,
): Promise<SelectOption<number>[]> => {
  const response = await api.get<{
    data: UsuarioOptionResponse[];
  }>("/usuario/options", { params });

  const usersArray = response.data.data;

  return usersArray.map((user) => ({
    value: user.id,
    label: user.nombre,
  }));
};
