/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
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

import { areaSchema, AreaFormValues } from "../schemas/area.schema";
import { AreaFormFields } from "./AreaFormFields";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { useAreaMutations } from "../hooks/useAreaMutations";
import { AreaListItem } from "../types/areas.entity";

interface AreaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaToEdit?: AreaListItem | null;
  onSuccess?: () => void;
}

export const AreaFormModal = ({
  isOpen,
  onClose,
  areaToEdit,
  onSuccess,
}: AreaFormModalProps) => {
  const isEditing = !!areaToEdit;
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(
    null,
  );

  const {
    clientes,
    sucursales,
    setSelectedClienteId: setCatalogClienteId,
    loading,
  } = useCatalogOptions();

  const { createArea, updateArea, isSubmitting } = useAreaMutations({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  const form = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      id_sucursal: undefined,
      nombre_area: "",
      contacto: "",
      telefono: "",
      correo: "",
    },
  });

  const handleSelectCliente = (clienteId: number) => {
    setSelectedClienteId(clienteId);
    setCatalogClienteId(clienteId);
    form.setValue("id_sucursal", undefined as unknown as number);
  };

  useEffect(() => {
    if (isOpen) {
      if (areaToEdit) {
        const clienteId = areaToEdit.cliente?.id_cliente || null;
        setSelectedClienteId(clienteId);
        if (clienteId) setCatalogClienteId(clienteId);

        form.reset({
          id_sucursal: areaToEdit.id_sucursal,
          nombre_area: areaToEdit.nombre_area,
          contacto: areaToEdit.contacto || "",
          telefono: areaToEdit.telefono || "",
          correo: areaToEdit.correo || "",
        });
      } else {
        setSelectedClienteId(null);
        form.reset({
          id_sucursal: undefined,
          nombre_area: "",
          contacto: "",
          telefono: "",
          correo: "",
        });
      }
    }
  }, [isOpen, areaToEdit, form, setCatalogClienteId]);

  const onSubmit = async (data: AreaFormValues) => {
    if (isEditing && areaToEdit) {
      await updateArea(areaToEdit.id_area, data);
    } else {
      await createArea({
        ...data,
        contacto: data.contacto ?? "",
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
            {isEditing ? "Editar área" : "Nueva área"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <AreaFormFields
            form={form}
            empresasOptions={clientes}
            sucursalesOptions={sucursales}
            selectedClienteId={selectedClienteId}
            onSelectCliente={handleSelectCliente}
            loadingEmpresas={loading.clientes}
            loadingSucursales={loading.sucursales}
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
                  ? "Actualizar área"
                  : "Crear área"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
