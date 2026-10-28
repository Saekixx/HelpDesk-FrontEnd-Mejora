import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ResumenOperativoCard = () => {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Resumen Operativo del Día
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Miércoles 16 de Octubre
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-[#ff5722] border border-orange-200/60">
            4 Visitas Hoy
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Pendiente</span>
            </div>
            <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
              1
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-purple-500" />
              <span>En Camino</span>
            </div>
            <span className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
              1
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Completada</span>
            </div>
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
              1
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-slate-400" />
              <span>Cancelada</span>
            </div>
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs">
              0
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>Reprogramada</span>
            </div>
            <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
              1
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Efectividad de Despacho en Campo</span>
            <span className="text-emerald-600">98.4%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[98.4%]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
