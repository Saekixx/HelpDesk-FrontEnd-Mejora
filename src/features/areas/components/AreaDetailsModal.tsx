import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, LayoutGrid } from "lucide-react";
import { AreaListItem } from "../types/areas.entity";

interface AreaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: AreaListItem | null;
}

export const AreaDetailsModal = ({
  isOpen,
  onClose,
  area,
}: AreaDetailsModalProps) => {
  if (!area) return null;

  const nombreEmpresa = area.cliente?.nombre || "Empresa no asignada";
  const nombreSucursal = area.sucursal?.nombre || "Sucursal no asignada";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Forzamos el ancho a max-w-xl (576px) y eliminamos la X redundante de shadcn */}
      <DialogContent className="!max-w-xl !w-full p-0 gap-0 overflow-hidden bg-white rounded-xl border-none shadow-2xl [&>button]:hidden">
        {/* Header con botón X personalizado */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-base font-bold text-gray-900">
            Detalle del área
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Card superior con el Nombre del área */}
          <div className="flex items-center gap-3.5 p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-50 text-[#FF5722]">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-900">
                {area.nombre_area}
              </span>
            </div>
          </div>

          {/* Grilla de atributos detallados */}
          <div className="grid grid-cols-[100px_1fr] gap-y-3 text-xs">
            <span className="text-gray-500 font-medium">Empresa:</span>
            <span className="text-gray-900 font-medium">{nombreEmpresa}</span>

            <span className="text-gray-500 font-medium">Sucursal:</span>
            <span className="text-gray-900 font-medium">{nombreSucursal}</span>

            <span className="text-gray-500 font-medium">Área:</span>
            <span className="text-gray-900 font-medium">
              {area.nombre_area}
            </span>

            <span className="text-gray-500 font-medium">Contacto:</span>
            <span className="text-gray-900 font-medium">{area.contacto}</span>

            <span className="text-gray-500 font-medium">Teléfono:</span>
            <span className="text-gray-900 font-medium">{area.telefono}</span>

            <span className="text-gray-500 font-medium">Correo:</span>
            <span className="text-gray-900 font-medium">{area.correo}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 bg-white border-t border-gray-100">
          <Button
            onClick={onClose}
            className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-medium px-6 py-2 text-xs h-auto rounded-lg transition-colors"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
