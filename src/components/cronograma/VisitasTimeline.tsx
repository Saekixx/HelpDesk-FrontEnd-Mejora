import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, User, MapPin, Wrench, CheckCircle2 } from "lucide-react";
import { VisitaItem } from "./VisitaDetailModal";

interface VisitasTimelineProps {
  selectedDate: Date;
  onViewDetail: (visita: VisitaItem) => void; // <--- Añadido a las props
}

export const VisitasTimeline = ({
  selectedDate,
  onViewDetail,
}: VisitasTimelineProps) => {
  const visitas: VisitaItem[] = [
    {
      id: "1",
      horario: "09:00\n11:30 AM",
      tipo: "MANTENIMIENTO PREVENTIVO",
      ot: "OT-8821",
      estado: "Completada",
      titulo: "Mantenimiento Preventivo Servidores Rack A",
      cliente: "Banco Metrópolis S.A. - Sede Financiera",
      tecnico: "Carlos Mendoza",
      direccion: "Av. Canaval y Moreyra 450, San Isidro",
      detalle: "Acta digital firmada con conformidad",
      footer: "Finalizado a las 11:22 AM",
    },
    {
      id: "2",
      horario: "11:45\n01:15 PM",
      tipo: "INFRAESTRUCTURA CRÍTICA",
      ot: "OT-8824",
      estado: "En Camino",
      titulo: "Auditoría e Instalación de Switches Core",
      cliente: "Clínica Las Palmas - Sede Norte",
      tecnico: "Mateo Silva",
      direccion: "Pabellón Quirúrgico B - Rack Piso 3",
      detalle: "2x Cisco Catalyst 9300 + 4 SFP+",
      footer: "En ruta • ETA: 18 min (6.4 km)",
    },
    {
      id: "3",
      horario: "02:30\n04:00 PM",
      tipo: "DESPLIEGUE HARDWARE",
      ot: "OT-8829",
      estado: "Pendiente",
      titulo: "Sustitución de Hardware y Puestos de Trabajo",
      cliente: "Grupo Logístico Andino - Terminal Callao",
      tecnico: "Lucía Morales",
      direccion: "Terminal Portuario C • Oficinas Aduana",
      detalle: "5x Laptops ThinkPad + Periféricos",
      footer: "Equipamiento alistado en almacén central",
    },
    {
      id: "4",
      horario: "04:30\n05:30 PM",
      tipo: "DIAGNÓSTICO DE ENLACE",
      ot: "OT-8835",
      estado: "Reprogramada",
      titulo: "Revisión Cableado Estructurado y Enlaces WAN",
      cliente: "Constructora Bolívar - Obra Niquía",
      tecnico: "David Torres",
      direccion: "Campamento de Obra Niquía • Caseta 4",
      detalle: "Reprogramado para pase de seguridad SG-SST",
      footer: "Nueva fecha tentativa: Mañana 09:30 AM",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Completada":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "En Camino":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Pendiente":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Reprogramada":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getDotColor = (estado: string) => {
    switch (estado) {
      case "Completada":
        return "bg-emerald-500";
      case "En Camino":
        return "bg-purple-500";
      case "Pendiente":
        return "bg-blue-500";
      case "Reprogramada":
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
            {visitas.length} Visitas Programadas
          </span>
        </CardContent>
      </Card>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {visitas.map((v) => (
          <Card
            key={v.id}
            className="relative rounded-2xl border-slate-200/80 shadow-xs"
          >
            <CardContent className="p-5 space-y-3">
              <span
                className={`absolute -left-6 top-6 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ring-slate-200 ${getDotColor(v.estado)}`}
              />

              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold text-slate-400 whitespace-pre-line leading-tight bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {v.horario}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                        {v.tipo}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#ff5722] bg-orange-50 px-2 py-0.5 rounded-md">
                        {v.ot}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {v.titulo}
                    </h3>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`font-bold text-[10px] uppercase px-2.5 py-0.5 ${getEstadoBadge(v.estado)}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotColor(v.estado)}`}
                  />
                  {v.estado}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Cliente:{" "}
                      <strong className="text-slate-800">{v.cliente}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{v.direccion}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>
                      Técnico:{" "}
                      <strong className="text-slate-800">{v.tecnico}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Wrench className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-700 font-bold">
                      {v.detalle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                  {v.footer}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(v)} // <--- Aquí llamamos correctamente a la función del modal
                  className="h-8 px-3 text-xs font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Ver Detalle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
