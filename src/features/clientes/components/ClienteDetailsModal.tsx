import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ClienteDetail } from "../types/cliente.response";
import { TipoCliente } from "../types/cliente.entity";

interface ClienteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteDetail | null;
  loading?: boolean;
}

export const ClienteDetailsModal = ({
  isOpen,
  onClose,
  cliente,
  loading = false,
}: ClienteDetailsModalProps) => {
  if (!cliente && !loading) return null;

  // Separar sucursal principal de adicionales
  const sucursalPrincipal = cliente?.sucursales?.[0];
  const sucursalesAdicionales = cliente?.sucursales?.slice(1) || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-xl !w-full p-0 gap-0 overflow-hidden bg-white rounded-xl border-none shadow-2xl [&>button]:hidden">
        {/* Header personalizado */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-base font-bold text-gray-900">
            {cliente?.nombre_principal || "Cargando..."}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Cuerpo */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Cargando detalles del cliente...
            </div>
          ) : (
            <>
              {/* Datos de la empresa */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Datos de la empresa
                </h3>
                <div className="grid grid-cols-[140px_1fr] gap-y-2.5 text-xs">
                  <span className="text-gray-500 font-medium">Tipo:</span>
                  <span className="text-gray-900 font-medium">
                    {cliente?.tipo_cliente === TipoCliente.JURIDICA
                      ? "Jurídica (empresa)"
                      : "Natural"}
                  </span>

                  <span className="text-gray-500 font-medium">RUC:</span>
                  <span className="text-gray-900 font-medium">
                    {cliente?.numero_documento}
                  </span>

                  <span className="text-gray-500 font-medium">Dirección:</span>
                  <span className="text-gray-900 font-medium">
                    {cliente?.direccion}
                  </span>

                  <span className="text-gray-500 font-medium">Teléfono:</span>
                  <span className="text-gray-900 font-medium">
                    {cliente?.telefono}
                  </span>

                  <span className="text-gray-500 font-medium">Correo:</span>
                  <span className="text-gray-900 font-medium">
                    {cliente?.correo}
                  </span>

                  <span className="text-gray-500 font-medium">Rubro:</span>
                  <span className="text-gray-900 font-medium">
                    {cliente?.rubro}
                  </span>

                  <span className="text-gray-500 font-medium">Plan:</span>
                  <span className="text-gray-900 font-semibold">
                    {cliente?.plan?.nombre || "Premium"}
                  </span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Sucursal principal */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Sucursal principal
                </h3>
                {sucursalPrincipal ? (
                  <div className="grid grid-cols-[140px_1fr] gap-y-2.5 text-xs">
                    <span className="text-gray-500 font-medium">Nombre:</span>
                    <span className="text-gray-900 font-medium">
                      {sucursalPrincipal.nombre}
                    </span>

                    <span className="text-gray-500 font-medium">
                      Encargado:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {sucursalPrincipal.encargado}
                    </span>

                    <span className="text-gray-500 font-medium">Teléfono:</span>
                    <span className="text-gray-900 font-medium">
                      {sucursalPrincipal.telefono}
                    </span>

                    <span className="text-gray-500 font-medium">Correo:</span>
                    <span className="text-gray-900 font-medium">
                      {sucursalPrincipal.correo}
                    </span>

                    <span className="text-gray-500 font-medium">
                      Dirección:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {sucursalPrincipal.direccion}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    No hay sucursal principal asignada.
                  </p>
                )}
              </div>

              {/* Sucursales adicionales */}
              {sucursalesAdicionales.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Sucursales adicionales ({sucursalesAdicionales.length})
                  </h3>
                  <div className="space-y-3">
                    {sucursalesAdicionales.map((sucursal, index) => (
                      <div
                        key={sucursal.id_sucursal || index}
                        className="p-4 bg-gray-50/70 border border-gray-100 rounded-lg"
                      >
                        <h4 className="text-xs font-bold text-gray-900 mb-2.5">
                          Sucursal #{index + 2}
                        </h4>
                        <div className="grid grid-cols-[140px_1fr] gap-y-2.5 text-xs">
                          <span className="text-gray-500 font-medium">
                            Nombre:
                          </span>
                          <span className="text-gray-900 font-medium">
                            {sucursal.nombre}
                          </span>

                          <span className="text-gray-500 font-medium">
                            Encargado:
                          </span>
                          <span className="text-gray-900 font-medium">
                            {sucursal.encargado}
                          </span>

                          <span className="text-gray-500 font-medium">
                            Teléfono:
                          </span>
                          <span className="text-gray-900 font-medium">
                            {sucursal.telefono}
                          </span>

                          <span className="text-gray-500 font-medium">
                            Correo:
                          </span>
                          <span className="text-gray-900 font-medium">
                            {sucursal.correo}
                          </span>

                          <span className="text-gray-500 font-medium">
                            Dirección:
                          </span>
                          <span className="text-gray-900 font-medium">
                            {sucursal.direccion}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
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
