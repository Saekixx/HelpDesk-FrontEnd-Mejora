import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  User,
} from "lucide-react";
import { ClienteDetailData } from "@/types/cliente/cliente.types";

interface ClienteDetailModalProps {
  cliente: ClienteDetailData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

export const ClienteDetailModal = ({
  cliente,
  isOpen,
  onOpenChange,
  isLoading,
}: ClienteDetailModalProps) => {
  if (!isOpen) return null;

  // Generar iniciales corporativas
  const initials = cliente?.nombre_principal
    ? cliente.nombre_principal
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "BM";

  const planName = cliente?.plan?.tipo || "Sin plan contratado";
  const contacto = cliente?.contacto_enlace;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {isLoading || !cliente ? (
          <div className="py-16 text-center text-xs text-slate-400 font-medium animate-pulse">
            Cargando detalles corporativos...
          </div>
        ) : (
          <>
            {/* Cabecera del Modal */}
            <DialogHeader className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center border border-blue-100 text-sm shadow-xs shrink-0">
                  {initials}
                </div>
                <div>
                  <DialogTitle className="text-xl font-extrabold text-slate-900 leading-snug">
                    {cliente.nombre_principal}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium flex items-center gap-2 pt-0.5">
                    <span>RUC: {cliente.numero_documento}</span>
                    <span>•</span>
                    <span className="text-[#ff5722] font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {planName}
                    </span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Grid de Datos Corporativos y Contacto Enlace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tarjeta 1: Datos Corporativos */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Datos Corporativos
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Tipo:
                    </span>
                    <span className="font-bold text-slate-800">
                      {cliente.tipo_cliente === "JURIDICA"
                        ? "Persona Jurídica"
                        : "Persona Natural"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />{" "}
                      Rubro:
                    </span>
                    <span className="font-bold text-slate-800">
                      {cliente.rubro || "No especificado"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />{" "}
                      Dirección:
                    </span>
                    <span
                      className="font-bold text-slate-800 text-right truncate max-w-[180px]"
                      title={cliente.direccion || ""}
                    >
                      {cliente.direccion || "Sin dirección fiscal"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />{" "}
                      Plan:
                    </span>
                    <span className="font-bold text-[#ff5722]">{planName}</span>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Contacto Enlace */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Contacto Enlace
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />{" "}
                      Responsable:
                    </span>
                    <span className="font-bold text-slate-800">
                      {contacto?.nombre_responsable || "Sin responsable"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />{" "}
                      Cargo:
                    </span>
                    <span className="font-bold text-slate-800">
                      {contacto?.cargo || "Sin cargo"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Correo:
                    </span>
                    <span
                      className="font-bold text-slate-800 truncate max-w-[170px]"
                      title={contacto?.correo || ""}
                    >
                      {contacto?.correo || "Sin correo"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> Teléfono:
                    </span>
                    <span className="font-bold text-slate-800">
                      {contacto?.telefono || "Sin teléfono"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Sucursales Activas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Sucursales Activas ({cliente.sucursales_activas?.length || 0})
                </span>
              </div>

              <div className="space-y-2.5">
                {cliente.sucursales_activas &&
                cliente.sucursales_activas.length > 0 ? (
                  cliente.sucursales_activas.map((sucursal) => (
                    <div
                      key={sucursal.id_sucursal}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-orange-50 text-[#ff5722] flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-extrabold text-slate-900">
                              {sucursal.nombre}
                            </p>
                            {sucursal.is_principal && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {sucursal.direccion || "Ubicación principal"}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {sucursal.total_equipos} Equipos
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                    No hay sucursales registradas para este cliente.
                  </div>
                )}
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 text-xs font-bold text-slate-700 border-slate-200 cursor-pointer"
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
