import { X } from "lucide-react";
import { HardwareForm } from "./HardwareForm";
import { HardwareItem } from "@/types/hardware/hardware.types";
import { HardwareFormData } from "@/schema/hardware/hardware.schema";
import { SelectOption } from "@/shared/types/select-option.types";

interface HardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HardwareFormData) => Promise<void>;
  hardwareToEdit?: HardwareItem | null;
  isSubmitting?: boolean;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  areas?: SelectOption[];
  equipos?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
  onSucursalChange?: (sucursalId: string | number) => void;
  onAreaChange?: (areaId: string | number) => void;
}

export const HardwareModal = ({
  isOpen,
  onClose,
  onSubmit,
  hardwareToEdit,
  isSubmitting,
  clientes = [],
  sucursales = [],
  areas = [],
  equipos = [],
  onClienteChange,
  onSucursalChange,
  onAreaChange,
}: HardwareModalProps) => {
  if (!isOpen) return null;

  const isEditing = !!hardwareToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isEditing
                ? "Editar Ficha Técnica de Hardware"
                : "Registrar Nuevo Componente"}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing
                ? "Actualiza los datos técnicos del componente seleccionado"
                : "Ingreso a base de inventario físico HelpDesk"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenedor del Formulario */}
        <div className="p-6">
          <HardwareForm
            hardwareToEdit={hardwareToEdit}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={!!isSubmitting}
            clientes={clientes}
            sucursales={sucursales}
            areas={areas}
            equipos={equipos}
            onClienteChange={onClienteChange}
            onSucursalChange={onSucursalChange}
            onAreaChange={onAreaChange}
          />
        </div>
      </div>
    </div>
  );
};
