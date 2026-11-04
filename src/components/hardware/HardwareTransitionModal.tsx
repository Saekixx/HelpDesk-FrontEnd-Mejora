import { X } from "lucide-react";
import { HardwareTransitionForm } from "./HardwareTransitionForm";
import { HardwareItem } from "@/types/hardware/hardware.types";
import { HardwareTransitionFormData } from "@/schema/hardware/hardwareTransition.schema";
import { SelectOption } from "@/shared/types/select-option.types";

interface HardwareTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HardwareTransitionFormData) => Promise<void>;
  hardware: HardwareItem | null;
  isSubmitting?: boolean;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  areas?: SelectOption[];
  equipos?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
  onSucursalChange?: (sucursalId: string | number) => void;
  onAreaChange?: (areaId: string | number) => void;
}

export const HardwareTransitionModal = ({
  isOpen,
  onClose,
  onSubmit,
  hardware,
  isSubmitting,
  clientes = [],
  sucursales = [],
  areas = [],
  equipos = [],
  onClienteChange,
  onSucursalChange,
  onAreaChange,
}: HardwareTransitionModalProps) => {
  if (!isOpen || !hardware) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Transición de Estado / Trazabilidad
            </h3>
            <p className="text-xs text-slate-500">
              Modifica el ciclo de vida del componente con registro histórico
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
          <HardwareTransitionForm
            hardware={hardware}
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
