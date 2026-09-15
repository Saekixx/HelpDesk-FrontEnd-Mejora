import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { sucursalSchema, SucursalFormValues } from "../schemas/sucursal.schema";
import { SucursalFormFields } from "./SucursalFormFields";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { useSucursalMutations } from "../hooks/useSucursalMutations";
import { SucursalListItem } from "../types/sucursal.entity";

interface SucursalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sucursalToEdit?: SucursalListItem | null;
  onSuccess?: () => void;
}

export const SucursalFormModal = ({
  isOpen,
  onClose,
  sucursalToEdit,
  onSuccess,
}: SucursalFormModalProps) => {
  const isEditing = !!sucursalToEdit;
  const { clientes, loading } = useCatalogOptions();

  const { createSucursal, updateSucursal, isSubmitting } = useSucursalMutations(
    {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    },
  );

  const form = useForm<SucursalFormValues>({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      id_cliente: undefined,
      nombre_sucursal: "",
      encargado: "",
      telefono: "",
      correo: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (sucursalToEdit) {
        form.reset({
          id_cliente: sucursalToEdit.id_cliente,
          nombre_sucursal: sucursalToEdit.nombre_sucursal,
          encargado: sucursalToEdit.encargado || "",
          telefono: sucursalToEdit.telefono || "",
          correo: sucursalToEdit.correo || "",
          direccion: sucursalToEdit.direccion || "",
        });
      } else {
        form.reset({
          id_cliente: undefined,
          nombre_sucursal: "",
          encargado: "",
          telefono: "",
          correo: "",
          direccion: "",
        });
      }
    }
  }, [isOpen, sucursalToEdit, form]);

  const onSubmit = async (data: SucursalFormValues) => {
    if (isEditing && sucursalToEdit) {
      await updateSucursal(sucursalToEdit.id_sucursal, data);
    } else {
      await createSucursal({
        ...data,
        encargado: data.encargado ?? "",
        telefono: data.telefono ?? "",
        correo: data.correo ?? "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-md !w-full p-0 gap-0 overflow-hidden bg-white rounded-xl border-none shadow-2xl [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-base font-bold text-gray-900">
            {isEditing ? "Editar sucursal" : "Nueva sucursal"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <SucursalFormFields
            form={form}
            empresasOptions={clientes}
            loadingEmpresas={loading.clientes}
            isEditing={isEditing}
          />

          <div className="flex justify-end gap-2 pt-6 mt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-9 px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs h-9 px-4 font-medium"
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                  ? "Actualizar sucursal"
                  : "Crear sucursal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
