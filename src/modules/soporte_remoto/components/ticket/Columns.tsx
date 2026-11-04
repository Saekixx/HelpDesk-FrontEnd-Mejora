import { ColumnDef } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, MessageSquare, Building2, User } from "lucide-react";
import { TicketListItem } from "@/types/ticket/ticket.type";

interface SoporteTicketsColumnsProps {
  onOpenChat: (item: TicketListItem) => void;
  onViewDetail: (item: TicketListItem) => void;
}

const getEstadoBadgeStyle = (estado: string) => {
  const est = estado.toUpperCase().trim();
  switch (est) {
    case "PENDIENTE":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "EN PROGRESO":
    case "EN_PROGRESO":
    case "ASIGNADO":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DERIVADO INSITU":
    case "DERIVADO_INSITU":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "EN ESPERA REPUESTO":
    case "EN_ESPERA_REPUESTO":
      return "bg-amber-50 text-amber-700 border-amber-300";
    case "REABIERTO":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "CERRADO":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const getSoporteTicketsColumns = ({
  onOpenChat,
  onViewDetail,
}: SoporteTicketsColumnsProps): ColumnDef<TicketListItem>[] => [
  {
    key: "ticket_asunto",
    header: "TICKET / ASUNTO",
    render: (item) => (
      <div
        className="space-y-1 py-1 cursor-pointer"
        onClick={() => onViewDetail(item)}
      >
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#ff5722] text-xs">
            #{item.pin}
          </span>
          {item.es_software && (
            <span className="bg-indigo-50 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
              Software
            </span>
          )}
        </div>
        <p className="font-bold text-slate-900 text-xs line-clamp-1 hover:text-[#ff5722] transition-colors">
          {item.asunto}
        </p>
        <p className="text-[11px] text-slate-500 line-clamp-1">
          {item.detalle}
        </p>
      </div>
    ),
  },
  {
    key: "solicitante",
    header: "CLIENTE / SUCURSAL",
    render: (item) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{item.cliente?.nombre || "N/D"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>
            {item.sucursal?.nombre || "Sin Sucursal"} (
            {item.area?.nombre || "Sin Área"})
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "equipo",
    header: "EQUIPO ASOCIADO",
    render: (item) =>
      item.equipo ? (
        <div className="flex items-start gap-2">
          <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0 mt-0.5">
            <Monitor className="h-4 w-4 text-slate-600" />
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 text-xs block">
              {item.equipo.tipo}
            </span>
            <span className="text-[11px] text-slate-600 block">
              {item.equipo.marca_modelo}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              S/N: {item.equipo.numero_serie}
            </span>
          </div>
        </div>
      ) : (
        <span className="text-xs text-slate-400 italic">
          Sin equipo asignado
        </span>
      ),
  },
  {
    key: "estado",
    header: "ESTADO",
    render: (item) => (
      <Badge
        variant="outline"
        className={`font-bold text-[10px] uppercase px-2.5 py-1 flex items-center gap-1.5 w-fit ${getEstadoBadgeStyle(
          item.estado,
        )}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {item.estado}
      </Badge>
    ),
  },
  {
    key: "acciones",
    header: "ACCIONES",
    className: "text-right",
    render: (item) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Abrir chat / gestión del ticket"
          onClick={() => onOpenChat(item)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
