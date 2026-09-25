import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  createEquipoService,
  updateEquipoService,
  toggleEquipoStatusService,
} from "../services/equipos.service";
import { CreateEquipoDto, UpdateEquipoDto } from "../types/equipo.dtos";

export const useEquipoMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState<boolean>(false);

  const getErrorMessage = (err: unknown, defaultMsg: string): string => {
    if (isAxiosError(err) && err.response?.data?.message) {
      const msg = err.response.data.message;
      return Array.isArray(msg) ? msg[0] : msg;
    }
    return defaultMsg;
  };

  const createEquipo = async (dto: CreateEquipoDto) => {
    setLoading(true);
    try {
      const data = await createEquipoService(dto);
      toast.success("Equipo registrado correctamente", {
        description: `Se ha registrado el equipo con N° Serie ${dto.num_serie}`,
      });
      if (onSuccess) onSuccess();
      return data;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Error al registrar el equipo"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEquipo = async (id: number, dto: UpdateEquipoDto) => {
    setLoading(true);
    try {
      const data = await updateEquipoService(id, dto);
      toast.success("Equipo actualizado correctamente");
      if (onSuccess) onSuccess();
      return data;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Error al actualizar el equipo"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    setLoading(true);
    try {
      const res = await toggleEquipoStatusService(id);
      toast.success(res.message || "Estado del equipo actualizado");
      if (onSuccess) onSuccess();
      return res;
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(
        err,
        "Error al cambiar el estado del equipo",
      );
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEquipo,
    updateEquipo,
    toggleStatus,
    loading,
  };
};
