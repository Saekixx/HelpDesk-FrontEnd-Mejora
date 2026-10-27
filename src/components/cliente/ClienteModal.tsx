import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Building2 } from "lucide-react";
import { ClienteDetail } from "@/types/cliente/cliente.types";
import { ClienteForm } from "./ClienteForm";
import { SelectOption } from "@/shared/types/select-option.types";

interface ClienteModalProps {
  clienteToEdit?: ClienteDetail | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  planes?: SelectOption[];
}

export const ClienteModal = ({
  clienteToEdit,
  isOpen,
  onOpenChange,
  onSuccess,
  planes = [],
}: ClienteModalProps) => {
  const isEditing = Boolean(clienteToEdit);

  const [formMeta, setFormMeta] = React.useState({
    nombre_principal: clienteToEdit?.nombre_principal || "",
    tipo_cliente: clienteToEdit?.tipo_cliente || "",
  });

  React.useEffect(() => {
    if (clienteToEdit) {
      setFormMeta({
        nombre_principal: clienteToEdit.nombre_principal || "",
        tipo_cliente: clienteToEdit.tipo_cliente || "",
      });
    } else {
      setFormMeta({
        nombre_principal: "",
        tipo_cliente: "",
      });
    }
  }, [clienteToEdit]);

  const initials =
    formMeta.nombre_principal
      ?.split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CL";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="h-12 w-12 rounded-xl bg-orange-50 text-[#ff5722] font-extrabold flex items-center justify-center border border-orange-200/60 text-base shadow-xs">
                {initials}
              </div>
            ) : (
              <div className="h-12 w-12 rounded-xl bg-[#ff5722] text-white flex items-center justify-center shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-extrabold text-slate-900">
                  {isEditing
                    ? `Editar Cliente - ${formMeta.nombre_principal}`
                    : "Registrar Nueva Empresa / Cliente"}
                </DialogTitle>
                {isEditing && formMeta.tipo_cliente && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    {formMeta.tipo_cliente}
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs text-slate-500 font-medium">
                {isEditing
                  ? "Actualiza los datos fiscales e industriales de la empresa."
                  : "Configuración guiada paso a paso para el registro corporativo."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ClienteForm
          clienteToEdit={clienteToEdit}
          onSuccess={onSuccess}
          onClose={() => onOpenChange(false)}
          planes={planes}
          onFormValuesChange={setFormMeta}
        />
      </DialogContent>
    </Dialog>
  );
};
