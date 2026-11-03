import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SucursalDetail } from "@/types/sucursal/sucursal.types";

interface SucursalDetailModalProps {
  sucursal: SucursalDetail | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

export const SucursalDetailModal = ({
  sucursal,
  isOpen,
  onOpenChange,
  isLoading = false,
}: SucursalDetailModalProps) => {
  if (!isOpen) return null;

  const totalAreas = sucursal?.areasVinculadas?.length || 0;
  const encargado = sucursal?.encargado;
  const cliente = sucursal?.clienteEmpresa;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
        {/* Agregamos pr-9 para que el contenido no choque con la "X" absoluta de Shadcn */}
        <div className="flex items-center justify-between pt-1 pr-9">
          <div className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-50 text-[#ff5722] border border-orange-200/60">
            Ficha Informativa
          </div>
          {sucursal?.id_sucursal && (
            <span className="text-xs font-bold text-slate-400">
              ID: SUC-{sucursal.id_sucursal}
            </span>
          )}
        </div>

        {isLoading || !sucursal ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium animate-pulse">
            Cargando información de la sede...
          </div>
        ) : (
          <>
            {/* Cabecera Principal */}
            <div className="flex items-start gap-3.5 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-[#ff5722] text-white flex items-center justify-center shrink-0 shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {sucursal.nombre_sucursal}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                      sucursal.is_active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    • {sucursal.is_active ? "Operativa" : "Inactiva"}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {cliente?.nombre_principal || "Empresa no asignada"}
                </p>
                {cliente?.numero_documento && (
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <span>RUC: {cliente.numero_documento}</span>
                    <span>•</span>
                    <span className="text-[#ff5722] font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Contrato Corporativo
                      Activo
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Grid de Información (2 columnas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Encargado Local */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3 w-3 text-slate-400" /> Encargado Local
                </span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {encargado
                    ? `${encargado.nombre} ${encargado.apellido}`
                    : "No asignado"}
                </p>
              </div>

              {/* Áreas Vinculadas */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-slate-400" /> Áreas Vinculadas
                </span>
                <p className="text-xs font-bold text-blue-600">
                  {totalAreas === 1
                    ? "1 Área IT Asignada"
                    : `${totalAreas} Áreas IT Asignadas`}
                </p>
              </div>

              {/* Teléfono */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-slate-400" /> Teléfono
                </span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {encargado?.telefono_contacto || "Sin teléfono registrado"}
                </p>
              </div>

              {/* Correo Electrónico */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Correo
                  Electrónico
                </span>
                <p
                  className="text-xs font-bold text-slate-800 truncate"
                  title={encargado?.correo_corporativo || ""}
                >
                  {encargado?.correo_corporativo || "Sin correo registrado"}
                </p>
              </div>

              {/* Dirección Completa (Full width) */}
              <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#ff5722]" /> Dirección
                  Completa
                </span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  {sucursal.direccion || "Sin dirección fiscal registrada"}
                </p>
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => onOpenChange(false)}
                className="h-10 px-6 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm rounded-xl cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
