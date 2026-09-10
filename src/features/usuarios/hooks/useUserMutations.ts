import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  createUserService,
  updateUserService,
  updateProfileService,
  assignUserRoleService,
  toggleUserStatusService,
} from "../services/users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserProfileDto,
  AssignUserRoleDto,
} from "../types/user.dtos";

export const useUserMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Función helper para extraer mensajes de error de Axios
  const getErrorMessage = (err: unknown, defaultMsg: string): string => {
    if (isAxiosError(err) && err.response?.data?.message) {
      const msg = err.response.data.message;
      return Array.isArray(msg) ? msg[0] : msg;
    }
    return defaultMsg;
  };

  const toggleStatus = async (id: number) => {
    setLoading(true);
    try {
      // 1. Llamada al servicio
      const res = await toggleUserStatusService(id);

      // 2. Notificación de éxito con el mensaje retornado del backend
      toast.success(res.message || "Estado de usuario actualizado");

      // 3. Callback para refrescar la tabla
      if (onSuccess) onSuccess();

      return res;
    } catch (err: unknown) {
      // 4. Captura del mensaje de error exacto (ej: "No puedes desactivar tu propia cuenta")
      const errorMsg = getErrorMessage(
        err,
        "Error al cambiar el estado del usuario",
      );
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (dto: CreateUserDto) => {
    setLoading(true);
    try {
      const data = await createUserService(dto);
      toast.success("Usuario creado correctamente");
      if (onSuccess) onSuccess();
      return data;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Error al crear el usuario"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, dto: UpdateUserDto) => {
    setLoading(true);
    try {
      const data = await updateUserService(id, dto);
      toast.success("Usuario actualizado correctamente");
      if (onSuccess) onSuccess();
      return data;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Error al actualizar el usuario"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (dto: UpdateUserProfileDto) => {
    setLoading(true);
    try {
      const data = await updateProfileService(dto);
      toast.success("Perfil actualizado correctamente");
      if (onSuccess) onSuccess();
      return data;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Error al actualizar el perfil"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (id: number, dto: AssignUserRoleDto) => {
    setLoading(true);
    try {
      const res = await assignUserRoleService(id, dto);
      toast.success(res.message || "Rol reasignado correctamente");
      if (onSuccess) onSuccess();
      return res;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Error al reasignar el rol"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleStatus,
    createUser,
    updateUser,
    updateProfile,
    assignRole,
    loading,
  };
};
