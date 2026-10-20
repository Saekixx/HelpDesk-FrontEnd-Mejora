import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { IncidenteCliente } from "../types/IncidenteCliente";
import { Card } from "@/components/ui/card";

interface IncidentsByClientCardProps {
  title?: string;
  description?: string;
  totalTickets: number; // Viene de afuera
  periodo: string; // Viene de afuera (ej: "Mayo 2024")
  incidencias: IncidenteCliente[]; // Array de clientes
  footerText?: string;
  className?: string;
}

const barColors = [
  "bg-orange-500",
  "bg-amber-500",
  "bg-blue-600",
  "bg-slate-600",
  "bg-slate-400",
];

export const IncidentsByClientCard = ({
  title = "Incidencias por Cliente",
  description = "Top de clientes con mayor volumen de tickets reportados este mes",
  totalTickets,
  periodo,
  incidencias,
  footerText = "Representa el volumen total de solicitudes IT registradas",
  className,
}: IncidentsByClientCardProps) => {
  return (
    <Card
      className={cn(
        "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between",
        className,
      )}
    >
      {/* Cabecera */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {description}
              </p>
            </div>
          </div>

          {/* Badges con la data global */}
          <div className="flex items-center gap-2 self-start">
            <div className="bg-orange-50 border border-orange-100/60 px-3 py-1.5 rounded-xl text-right">
              <span className="text-xs font-bold text-orange-700 block leading-none">
                Total: {totalTickets} tickets
              </span>
            </div>
            <div className="bg-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-600">
              {periodo}
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="my-5 space-y-4">
          {incidencias.map((item, index) => (
            <div key={`${item.cliente}-${index}`} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="h-5 w-5 rounded-md bg-orange-50/80 text-orange-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-800 truncate">
                    {item.cliente}
                  </span>
                  {item.sucursal && (
                    <span className="text-slate-400 font-normal truncate hidden sm:inline">
                      ({item.sucursal})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-extrabold text-slate-900">
                    {item.numero_tickets} tickets
                  </span>
                  <span className="bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded text-[11px]">
                    {item.porcentaje_tickets}%
                  </span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    barColors[index % barColors.length],
                  )}
                  style={{ width: `${item.porcentaje_tickets}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pie de página */}
      {footerText && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">{footerText}</p>
        </div>
      )}
    </Card>
  );
};
