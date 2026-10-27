import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Edit3 } from "lucide-react";
import { SucursalForm } from "./SucursalForm";
import { SelectOption } from "@/shared/types/select-option.types";

interface SucursalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  sucursalToEdit?: any | null;
  clientes?: SelectOption[];
}

export const SucursalModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  sucursalToEdit,
  clientes = [],
}: SucursalModalProps) => {
  const isEditing = Boolean(sucursalToEdit);
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl overflow-hidden">
        <DialogHeader className="flex flex-row items-start gap-3.5 space-y-0 text-left pb-3 border-b border-slate-100">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
              isEditing
                ? "bg-orange-50 border-orange-100 text-[#ff5722]"
                : "bg-orange-50 border-orange-100 text-[#ff5722]"
            }`}
          >
            {isEditing ? (
              <Edit3 className="h-5.5 w-5.5 stroke-[2.5]" />
            ) : (
              <Plus className="h-5.5 w-5.5 stroke-[2.5]" />
            )}
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-base font-extrabold text-slate-900 leading-snug">
              {isEditing ? "Editar Sucursal" : "Nueva Sucursal"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              {isEditing
                ? "Actualiza los datos de la sede y responsable asignado"
                : "Registra una nueva sede y crea la cuenta del encargado local (Cliente Sucursal)."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <SucursalForm
          sucursalToEdit={sucursalToEdit}
          onSuccess={onSuccess}
          onClose={handleClose}
          clientes={clientes}
        />
      </DialogContent>
    </Dialog>
  );
};
