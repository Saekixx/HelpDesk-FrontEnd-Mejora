import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Building2 } from "lucide-react";
import { SucursalListItem } from "../types/sucursal.entity";

interface SucursalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sucursal: SucursalListItem | null;
}

export const SucursalDetailsModal = ({
  isOpen,
  onClose,
  sucursal,
}: SucursalDetailsModalProps) => {
  if (!sucursal) return null;

  const nombreCliente =
    sucursal.cliente?.nombre ||
    sucursal.cliente?.nombre_principal ||
    "Empresa no asignada";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Se fuerza el ancho a max-w-xl (576px) eliminando la restriccion por defecto de shadcn */}
      <DialogContent className="!max-w-xl !w-full p-0 gap-0 overflow-hidden bg-white rounded-xl border-none shadow-2xl [&>button]:hidden">
        {/* Header personalizado */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-base font-bold text-gray-900">
            Detalle de la sucursal
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Card con Icono, Nombre de la sucursal y Empresa */}
          <div className="flex items-center gap-3.5 p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-50 text-[#FF5722]">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-900">
                {sucursal.nombre_sucursal}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {nombreCliente}
              </span>
            </div>
          </div>

          {/* Grilla de atributos */}
          <div className="grid grid-cols-[110px_1fr] gap-y-3 text-xs">
            <span className="text-gray-500 font-medium">Empresa:</span>
            <span className="text-gray-900 font-medium">{nombreCliente}</span>

            <span className="text-gray-500 font-medium">Encargado:</span>
            <span className="text-gray-900 font-medium">
              {sucursal.encargado}
            </span>

            <span className="text-gray-500 font-medium">Teléfono:</span>
            <span className="text-gray-900 font-medium">
              {sucursal.telefono}
            </span>

            <span className="text-gray-500 font-medium">Correo:</span>
            <span className="text-gray-900 font-medium font-sans">
              {sucursal.correo}
            </span>

            <span className="text-gray-500 font-medium">Dirección:</span>
            <span className="text-gray-900 font-medium">
              {sucursal.direccion}
            </span>

            <span className="text-gray-500 font-medium">Áreas:</span>
            <span className="text-gray-900 font-medium">
              {sucursal.total_areas ?? 0}
            </span>
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
