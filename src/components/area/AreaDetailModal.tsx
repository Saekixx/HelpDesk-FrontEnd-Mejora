import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Building2,
  User,
  HardDrive,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { AreaDetalle } from "@/types/area/area.types";
import { StatusBadge } from "@/components/table/TableBadges";

interface AreaDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  areaDetail: AreaDetalle | null;
  isLoading: boolean;
}

export const AreaDetailModal = ({
  isOpen,
  onOpenChange,
  areaDetail,
  isLoading,
}: AreaDetailModalProps) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Header estilo ficha */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-orange-50 text-[#ff5722] border border-orange-200/60 uppercase tracking-wider">
              FICHA DE ÁREA
            </span>
            <span className="text-xs font-bold text-slate-400">
              {areaDetail
                ? `ID: AR-${String(areaDetail.id_area).padStart(2, "0")}`
                : ""}
            </span>
          </div>
        </DialogHeader>

        {isLoading || !areaDetail ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff5722]" />
            <p className="text-xs font-semibold text-slate-500">
              Cargando detalle del área...
            </p>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Info Principal del Área */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-xs">
                <Layers className="h-6 w-6" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-extrabold text-slate-900 leading-snug">
                    {areaDetail.nombre_area}
                  </DialogTitle>
                  <StatusBadge isActive={areaDetail.is_active} />
                </div>
                <DialogDescription className="text-xs text-slate-500 font-medium">
                  {areaDetail.empresa} - {areaDetail.sucursal_asignada}
                </DialogDescription>
                <p className="text-[11px] text-slate-400 font-medium">
                  Asignación Operativa Local
                </p>
              </div>
            </div>

            {/* Grid de Campos tipo Tarjeta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* EMPRESA */}
              <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Empresa
                </span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{areaDetail.empresa}</span>
                </p>
              </div>

              {/* SUCURSAL ASIGNADA */}
              <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Sucursal Asignada
                </span>
                <p className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">
                    {areaDetail.sucursal_asignada}
                  </span>
                </p>
              </div>

              {/* ENCARGADO RESPONSABLE */}
              <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Encargado Responsable
                </span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {areaDetail.encargar_responsable || "No asignado"}
                  </span>
                </p>
              </div>

              {/* EQUIPOS VINCULADOS */}
              <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Equipos Vinculados
                </span>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>
                    {areaDetail.total_equipos ?? 0} Equipos Registrados
                  </span>
                </p>
              </div>

              {/* TELÉFONO */}
              <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Teléfono
                </span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{areaDetail.telefono || "Sin teléfono"}</span>
                </p>
              </div>

              {/* CORREO DE CONTACTO */}
              <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Correo de Contacto
                </span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate" title={areaDetail.correo || ""}>
                    {areaDetail.correo || "Sin correo"}
                  </span>
                </p>
              </div>
            </div>

            {/* Botón Cerrar Inferior */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                onClick={handleClose}
                className="h-10 px-6 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
