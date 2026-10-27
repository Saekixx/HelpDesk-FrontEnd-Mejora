import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Edit3 } from "lucide-react";
import { AreaForm } from "./AreaForm";
import { SelectOption } from "@/shared/types/select-option.types";

interface AreaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  areaToEdit?: any | null;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  onClienteChange?: (clienteId: number | null) => void;
}

export const AreaModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  areaToEdit,
  clientes = [],
  sucursales = [],
  onClienteChange,
}: AreaModalProps) => {
  const isEditing = Boolean(areaToEdit);
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl overflow-hidden">
        <DialogHeader className="flex flex-row items-start gap-3.5 space-y-0 text-left pb-3 border-b border-slate-100">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 text-[#ff5722]">
            {isEditing ? (
              <Edit3 className="h-5.5 w-5.5 stroke-[2.5]" />
            ) : (
              <Plus className="h-5.5 w-5.5 stroke-[2.5]" />
            )}
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-base font-extrabold text-slate-900 leading-snug">
              {isEditing ? "Editar Área" : "Nueva Área"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              {isEditing
                ? "Actualiza los datos del área y responsable asignado"
                : "Crea un área o departamento y asígnala a una sucursal cliente."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <AreaForm
          key={areaToEdit ? areaToEdit.id_area : "create-area"}
          areaToEdit={areaToEdit}
          onSuccess={onSuccess}
          onClose={handleClose}
          clientes={clientes}
          sucursales={sucursales}
          onClienteChange={onClienteChange}
        />
      </DialogContent>
    </Dialog>
  );
};
