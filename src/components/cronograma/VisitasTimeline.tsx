import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  User,
  MapPin,
  Wrench,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { CitaSoporteListItem } from "@/types/cita/cita-soporte.type";

interface VisitasTimelineProps {
  citas: CitaSoporteListItem[];
  selectedDate: Date;
  isLoading?: boolean;
  onViewDetail: (idCita: number) => void;
}

const formatTimeRange = (horaInicio: string, horaFin: string) => {
  const formatHour = (isoOrTime: string) => {
    const date = new Date(isoOrTime);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });
    }
    return isoOrTime.slice(0, 5);
  };

  return `${formatHour(horaInicio)}\n${formatHour(horaFin)}`;
};

export const VisitasTimeline = ({
  citas,
  selectedDate,
  isLoading = false,
  onViewDetail,
}: VisitasTimelineProps) => {
  const getEstadoBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completada":
      case "cerrado":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "en camino":
      case "en_camino":
      case "en progreso":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "pendiente":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "reprogramada":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "cancelada":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getDotColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completada":
      case "cerrado":
        return "bg-emerald-500";
      case "en camino":
      case "en_camino":
      case "en progreso":
        return "bg-purple-500";
      case "pendiente":
        return "bg-blue-500";
      case "reprogramada":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  const formattedDateString = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-slate-200/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 capitalize">
            Jornada Operativa • {formattedDateString}
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
            {citas.length}{" "}
            {citas.length === 1 ? "Cita Programada" : "Citas Programadas"}
          </span>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardContent className="p-10 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#ff5722]" />
            Cargando citas de soporte...
          </CardContent>
        </Card>
      ) : citas.length === 0 ? (
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardContent className="p-10 text-center text-xs font-semibold text-slate-400">
            No hay citas de soporte registradas para los filtros seleccionados.
          </CardContent>
        </Card>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {citas.map((cita) => {
            const nombreTecnico = `${cita.tecnico.nombre} ${cita.tecnico.apellido}`;
            const horario = formatTimeRange(cita.hora_inicio, cita.hora_fin);

            return (
              <Card
                key={cita.id_cita}
                className="relative rounded-2xl border-slate-200/80 shadow-xs"
              >
                <CardContent className="p-5 space-y-3">
                  <span
                    className={`absolute -left-6 top-6 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ring-slate-200 ${getDotColor(cita.estado)}`}
                  />

                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono font-bold text-slate-400 whitespace-pre-line leading-tight bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {horario}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                            SOPORTE IN-SITU
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#ff5722] bg-orange-50 px-2 py-0.5 rounded-md">
                            CITA #{cita.id_cita}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                          {cita.sucursal.nombre_sucursal} —{" "}
                          {cita.cliente.nombre_principal}
                        </h3>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`font-bold text-[10px] uppercase px-2.5 py-0.5 ${getEstadoBadge(cita.estado)}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotColor(cita.estado)}`}
                      />
                      {cita.estado}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">
                          Cliente:{" "}
                          <strong className="text-slate-800">
                            {cita.cliente.nombre_principal}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {cita.sucursal.direccion}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>
                          Técnico:{" "}
                          <strong className="text-slate-800">
                            {nombreTecnico}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Wrench className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate text-slate-700 font-bold">
                          {cita.observaciones ||
                            "Sin observaciones registradas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                      RUC: {cita.cliente.numero_documento}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(cita.id_cita)}
                      className="h-8 px-3 text-xs font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
