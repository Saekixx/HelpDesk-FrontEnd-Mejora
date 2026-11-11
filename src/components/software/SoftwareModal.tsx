import { X, Layers, Edit3 } from "lucide-react";
import { SoftwareForm } from "./SoftwareForm";
import { SoftwareFormData } from "@/schema/software/software.schema";
import { SoftwareItem } from "@/types/software/software.type";
import { SelectOption } from "@/shared/types/select-option.types";

interface SoftwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SoftwareFormData) => Promise<void>;
  softwareToEdit?: SoftwareItem | null;
  isSubmitting?: boolean;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
}

export const SoftwareModal = ({
  isOpen,
  onClose,
  onSubmit,
  softwareToEdit,
  isSubmitting,
  clientes = [],
  sucursales = [],
  onClienteChange,
}: SoftwareModalProps) => {
  if (!isOpen) return null;

  const isEditing = Boolean(softwareToEdit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="h-10 w-10 rounded-xl bg-orange-50 text-[#ff5722] font-extrabold flex items-center justify-center border border-orange-200/60 text-base shadow-xs">
                <Edit3 className="h-5 w-5" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[#ff5722] text-white flex items-center justify-center shadow-md">
                <Layers className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isEditing
                  ? `Editar Lote de Software - ${softwareToEdit?.nombre_software}`
                  : "Registrar Nuevo Software y Lote"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditing
                  ? "Actualiza los datos fiscales, capacidad o credenciales del lote."
                  : "Crea un nuevo lote de licencias, define la capacidad total, tipo de modelo y credenciales maestras."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido del Formulario */}
        <div className="p-6">
          <SoftwareForm
            softwareToEdit={softwareToEdit}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={!!isSubmitting}
            clientes={clientes}
            sucursales={sucursales}
            onClienteChange={onClienteChange}
          />
        </div>
      </div>
    </div>
  );
};
