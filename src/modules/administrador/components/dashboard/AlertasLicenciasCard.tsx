import { cn } from "@/lib/utils";
import { AlertTriangle, Laptop, Building2 } from "lucide-react";
import {
  AlertaLicencia,
  SeveridadLicencia,
} from "../../types/dashboard/AlertaLicencia";
import { Card } from "@/components/ui/card";

interface AlertasLicenciasCardProps {
  title?: string;
  rangoDias?: string;
  alertas: AlertaLicencia[];
  className?: string;
}

// Estilos dinámicos según el nivel de severidad
const getCardStyle = (severidad?: SeveridadLicencia) => {
  switch (severidad) {
    case "critica":
      return {
        container: "bg-amber-50/40 border-amber-200/80 hover:bg-amber-50/70",
        badge: "bg-red-100 text-red-700 border-red-200 font-bold",
        statusText: "text-amber-800 font-bold",
      };
    case "advertencia":
      return {
        container: "bg-slate-50/60 border-slate-200/70 hover:bg-slate-50",
        badge: "bg-amber-100 text-amber-800 border-amber-200 font-bold",
        statusText: "text-slate-600 font-semibold",
      };
    case "info":
    default:
      return {
        container: "bg-slate-50/60 border-slate-200/70 hover:bg-slate-50",
        badge: "bg-blue-100 text-blue-800 border-blue-200 font-bold",
        statusText: "text-slate-600 font-semibold",
      };
  }
};

export const AlertasLicenciasCard = ({
  title = "Alertas de Software & Licencias",
  rangoDias = "< 30 días",
  alertas,
  className,
}: AlertasLicenciasCardProps) => {
  return (
    <Card
      className={cn(
        "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between",
        className,
      )}
    >
      <div>
        {/* Cabecera del Widget */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
              {title}
            </h2>
          </div>

          {/* Badge de Rango de Días */}
          <div className="bg-amber-100/60 border border-amber-200/70 px-3 py-1.5 rounded-xl text-center shrink-0">
            <span className="text-xs font-bold text-amber-800 block leading-none">
              {rangoDias}
            </span>
          </div>
        </div>

        {/* Listado de Alertas */}
        <div className="my-4 space-y-3">
          {alertas.map((alerta) => {
            const styles = getCardStyle(alerta.severidad);

            return (
              <div
                key={alerta.id}
                className={cn(
                  "border rounded-xl p-4 space-y-2.5 transition-colors",
                  styles.container,
                )}
              >
                {/* Fila Superior: Nombre del Software y Días Restantes */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                      {alerta.nombre_software}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-700">
                        {alerta.cliente}
                      </span>
                      {alerta.sucursal && (
                        <span className="text-slate-400 font-normal">
                          ({alerta.sucursal})
                        </span>
                      )}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-[10px] uppercase tracking-wider border shrink-0",
                      styles.badge,
                    )}
                  >
                    Vence en {alerta.dias_restantes} días
                  </span>
                </div>

                {/* Pie: Equipos Afectados y Estado */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Laptop className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">
                      {alerta.equipos_afectados}
                    </span>{" "}
                    equipos
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
