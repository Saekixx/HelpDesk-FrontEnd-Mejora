/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { userSchema, UpdateUserFormValues } from "../schemas/user-form.schema";
import { UserListItem } from "../types/user.entity";
import { UserFormFields } from "./UserFormFields";
import { PasswordResetAlert } from "./PasswordResetAlert";

interface SelectOption {
  label: string;
  value: number;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserFormValues, isEdit: boolean) => Promise<void>;
  userToEdit?: UserListItem | null;
  rolesOptions: SelectOption[];
  clientesOptions: SelectOption[];
  sucursalesOptions: SelectOption[];
  areasOptions: SelectOption[];
  onClienteChange: (clienteId: number | null) => void;
  onSucursalChange: (sucursalId: number | null) => void;
  isLoadingCatalogs?: boolean;
}

export const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
  rolesOptions,
  clientesOptions,
  sucursalesOptions,
  areasOptions,
  onClienteChange,
  onSucursalChange,
  isLoadingCatalogs,
}: UserModalProps) => {
  const isEdit = !!userToEdit;

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      password: "",
      id_rol: undefined,
      id_cliente: null,
      id_sucursal: null,
      id_area: null,
      resetPassword: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        form.reset({
          nombre: userToEdit.nombre || "",
          apellido: userToEdit.apellido || "",
          correo: userToEdit.correo || "",
          telefono: userToEdit.telefono || "",
          password: "",
          id_rol: userToEdit.id_rol ?? undefined,
          id_cliente: userToEdit.id_cliente ?? null,
          id_sucursal: userToEdit.id_sucursal ?? null,
          id_area: userToEdit.id_area ?? null,
          resetPassword: false,
        });

        if (userToEdit.id_cliente) onClienteChange(userToEdit.id_cliente);
        if (userToEdit.id_sucursal) onSucursalChange(userToEdit.id_sucursal);
      } else {
        form.reset({
          nombre: "",
          apellido: "",
          correo: "",
          telefono: "",
          password: "",
          id_rol: undefined,
          id_cliente: null,
          id_sucursal: null,
          id_area: null,
          resetPassword: false,
        });
      }
    }
  }, [isOpen, userToEdit, form, onClienteChange, onSucursalChange]);

  const handleFormSubmit = async (values: UpdateUserFormValues) => {
    await onSubmit(values, isEdit);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEdit ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4 py-2"
        >
          <UserFormFields
            form={form}
            rolesOptions={rolesOptions}
            clientesOptions={clientesOptions}
            sucursalesOptions={sucursalesOptions}
            areasOptions={areasOptions}
            onClienteChange={onClienteChange}
            onSucursalChange={onSucursalChange}
            isLoadingCatalogs={isLoadingCatalogs}
          />

          {isEdit && (
            <PasswordResetAlert
              checked={!!form.watch("resetPassword")}
              onCheckedChange={(checked) =>
                form.setValue("resetPassword", checked)
              }
            />
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Guardando..."
                : isEdit
                  ? "Actualizar"
                  : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
