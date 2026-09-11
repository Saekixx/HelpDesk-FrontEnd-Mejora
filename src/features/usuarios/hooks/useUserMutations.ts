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

  const getErrorMessage = (err: unknown, defaultMsg: string): string => {
    if (isAxiosError(err) && err.response?.data?.message) {
      const msg = err.response.data.message;
      return Array.isArray(msg) ? msg[0] : msg;
    }
    return defaultMsg;
  };

  const createUser = async (dto: CreateUserDto) => {
    setLoading(true);
    try {
      const data = await createUserService(dto);
      toast.success("Usuario creado correctamente", {
        description: `Se ha enviado un correo de confirmación a ${dto.correo}`,
      });
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

      if (dto.resetPassword) {
        toast.success("Usuario y contraseña actualizados", {
          description: `Se envió el enlace para restablecer la contraseña a ${dto.correo || data.correo}`,
        });
      } else {
        toast.success("Usuario actualizado correctamente");
      }

      if (onSuccess) onSuccess();
      return data;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Error al actualizar el usuario"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    setLoading(true);
    try {
      const res = await toggleUserStatusService(id);
      toast.success(res.message || "Estado de usuario actualizado");
      if (onSuccess) onSuccess();
      return res;
    } catch (err: unknown) {
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
