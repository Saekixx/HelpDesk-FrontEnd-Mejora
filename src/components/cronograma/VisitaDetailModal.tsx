import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  MapPin,
  Navigation,
  CheckSquare,
  Square,
  Calendar,
  ExternalLink,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export interface VisitaItem {
  id: string;
  horario: string;
  tipo: string;
  ot: string;
  estado: string;
  titulo: string;
  cliente: string;
  tecnico: string;
  direccion: string;
  detalle: string;
  footer: string;
}

interface VisitaDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  visita: VisitaItem | null;
}

export const VisitaDetailModal = ({
  isOpen,
  onOpenChange,
  visita,
}: VisitaDetailModalProps) => {
  if (!visita) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px] p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Cabecera del Modal */}
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 space-y-0 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 text-[#ff5722]">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>Detalle de Visita Técnica - {visita.ot}</span>
              </DialogTitle>
              <span className="text-xs text-slate-400 font-medium">
                Planificación y seguimiento en campo
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className="font-bold text-[11px] px-3 py-1 bg-purple-50 text-purple-700 border-purple-200 uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5 animate-pulse" />
            {visita.estado}
          </Badge>
        </DialogHeader>

        {/* Contenido Principal en Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Columna Izquierda: Información General */}
          <div className="space-y-3">
            {/* Cliente & Entidad */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Cliente & Entidad
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  Cuenta Enterprise
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">
                {visita.cliente}
              </h4>
              <div className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{visita.direccion}</span>
              </div>
            </div>

            {/* Técnico & Tipo de Trabajo */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Técnico Asignado
                </span>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {visita.tecnico
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {visita.tecnico}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tipo de Trabajo
                </span>
                <span className="text-xs font-bold text-slate-800 block pt-1">
                  {visita.tipo}
                </span>
              </div>
            </div>

            {/* Checklist de Intervención */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Motivo & Checklist de Intervención
              </span>
              <p className="text-xs font-medium text-slate-700">
                {visita.titulo}. {visita.detalle}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Recepción de equipamiento en almacén central</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>En trayecto a sede con cuadrilla móvil</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Square className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>Montaje en rack e interconexión SFP+</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Square className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>Pruebas de latencia y firma de conformidad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Geolocalización & Ruta */}
          <div className="space-y-3 flex flex-col">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Geolocalización & Ruta
              </span>

              {/* Contenedor del Mapa Simulado */}
              <div className="relative w-full h-[220px] rounded-xl bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center">
                {/* Imagen o fondo simulando mapa de tráfico */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70 bg-blue-50/50 flex items-center justify-center">
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="px-3 py-1.5 bg-orange-600 text-white font-bold text-[11px] rounded-xl shadow-md flex items-center gap-1.5 animate-bounce">
                      <MapPin className="h-3.5 w-3.5" />
                      Sede Norte (Destino)
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white/90 px-3 py-1 rounded-lg shadow-xs absolute bottom-3 left-3">
                  Google Maps • Tráfico en Vivo
                </span>
              </div>

              {/* Información de Origen y Salida */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  Origen: Base Central HelpDesk
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Salida: 11:25 AM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones Inferiores */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 text-xs font-bold text-slate-700 border-slate-200 cursor-pointer"
          >
            Cerrar
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Abriendo panel de reprogramación...")
              }
              className="h-10 px-4 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <Calendar className="mr-2 h-4 w-4 text-slate-500" />
              Cambiar Estado / Reprogramar
            </Button>

            <Button
              onClick={() =>
                toast.success("Cargando hoja de ruta detallada...")
              }
              className="h-10 px-5 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver Hoja de Ruta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
