import { cn } from "@/lib/utils";
import { Calendar, User } from "lucide-react";
import { CitaProgramada } from "../../types/dashboard/CitasProgramadas";
import { Card } from "@/components/ui/card";

interface CitasHoyCardProps {
  totalCitas: number;
  citas: CitaProgramada[];
  onVerAgendaCompleta?: () => void;
  className?: string;
}

export const CitasHoyCard = ({
  totalCitas,
  citas,
  onVerAgendaCompleta,
  className,
}: CitasHoyCardProps) => {
  // Función auxiliar para los colores de los badges de estado
  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case "EN RUTA":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "AGENDADO":
        return "bg-slate-200/80 text-slate-700 border-slate-300/60";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <Card
      className={cn(
        "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between",
        className,
      )}
    >
      <div>
        {/* Cabecera del Widget */}
        <div className="flex items-start justify-between gap-2 pb-5 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                Citas Programadas <br />
                <span className="text-slate-900">(Hoy)</span>
              </h2>
            </div>
          </div>

          {/* Badge del total de citas */}
          <div className="bg-orange-50 border border-orange-100/60 px-3 py-1.5 rounded-xl text-right shrink-0">
            <span className="text-xs font-extrabold text-orange-700 block leading-none">
              {totalCitas} Citas
            </span>
          </div>
        </div>

        {/* Listado de Citas */}
        <div className="my-5 space-y-3.5">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-4 space-y-2 hover:bg-slate-50 transition-colors"
            >
              {/* Fila Hora y Estado */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-600 flex items-center gap-1.5">
                  🕒 {cita.hora}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                    getBadgeStyle(cita.estado),
                  )}
                >
                  {cita.estado}
                </span>
              </div>

              {/* Cliente y Sucursal */}
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {cita.cliente}{" "}
                  <span className="text-slate-400 font-normal">
                    ({cita.sucursal})
                  </span>
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                  {cita.descripcion}
                </p>
              </div>

              {/* Pie de la tarjeta de cita (Técnico y sub-etiqueta) */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {cita.tecnico}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón inferior "Ver agenda completa" */}
      <div className="pt-2">
        <button
          onClick={onVerAgendaCompleta}
          className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Ver agenda completa</span>
          <span className="text-slate-400">→</span>
        </button>
      </div>
    </Card>
  );
};
