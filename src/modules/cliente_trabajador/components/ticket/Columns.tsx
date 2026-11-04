import { ColumnDef } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, MessageSquare, Clock } from "lucide-react";

export interface TrabajadorTicketItem {
  id_ticket: string;
  codigo_ticket: string;
  asunto: string;
  detalle: string;
  tipo_equipo: string;
  modelo_equipo: string;
  serial_equipo: string;
  asignado_a: string | null;
  avatar_asignado?: string;
  estado: string;
}

interface TrabajadorTicketsColumnsProps {
  onOpenChat: (item: TrabajadorTicketItem) => void;
  onViewDetail: (item: TrabajadorTicketItem) => void;
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

export const getTrabajadorTicketsColumns = ({
  onOpenChat,
  onViewDetail,
}: TrabajadorTicketsColumnsProps): ColumnDef<TrabajadorTicketItem>[] => [
  {
    key: "ticket_asunto",
    header: "TICKET / ASUNTO",
    render: (item) => (
      <div className="space-y-1 py-1">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#ff5722] text-xs">
            {item.codigo_ticket}
          </span>
        </div>
        <p className="font-bold text-slate-900 text-xs line-clamp-1">
          {item.asunto}
        </p>
        <p className="text-[11px] text-slate-500 line-clamp-1">
          {item.detalle}
        </p>
      </div>
    ),
  },
  {
    key: "equipo",
    header: "EQUIPO ASOCIADO",
    render: (item) => (
      <div className="flex items-start gap-2">
        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0 mt-0.5">
          <Monitor className="h-4 w-4 text-slate-600" />
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 text-xs block">
            {item.tipo_equipo}
          </span>
          <span className="text-[11px] text-slate-600 block">
            {item.modelo_equipo}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            S/N: {item.serial_equipo}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "asignado_a",
    header: "SOPORTE TÉCNICO",
    render: (item) =>
      item.asignado_a ? (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
            {item.avatar_asignado || "ST"}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium block">
              Asignado a
            </span>
            <span className="text-xs font-bold text-slate-800 block">
              {item.asignado_a}
            </span>
          </div>
        </div>
      ) : (
        <div className="px-2.5 py-1.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 text-amber-800 text-[11px] font-medium w-fit flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          En cola (Sin asignar)
        </div>
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
          title="Abrir chat del ticket"
          onClick={() => onOpenChat(item)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
