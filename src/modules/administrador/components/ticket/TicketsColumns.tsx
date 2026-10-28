import { ColumnDef } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  FileText,
  UserPlus,
  Lock,
  Package,
} from "lucide-react";

export interface TicketItem {
  id_ticket: string;
  codigo_ticket: string;
  prioridad: "P1 CRÍTICO" | "P2 ALTA" | "P3 NORMAL" | "REINCIDENCIA";
  tiempo_o_fecha: string;
  solicitante: string;
  cargo_solicitante: string;
  asunto: string;
  tipo_equipo: string;
  modelo_equipo: string;
  serial_equipo: string;
  empresa: string;
  sucursal: string;
  ubicacion_detallada: string;
  area: string;
  asignado_a: string | null;
  avatar_asignado?: string;
  estado:
    | "PENDIENTE"
    | "EN PROGRESO"
    | "DERIVADO INSITU"
    | "EN ESPERA REPUESTO"
    | "REABIERTO"
    | "CERRADO"
    | "ASIGNADO";
}

interface TicketsColumnsProps {
  onActionClick: (item: TicketItem) => void;
  onOpenChat: (item: TicketItem) => void;
}

// Estilos de Badge para Prioridad
const getPrioridadBadgeStyle = (prioridad: string) => {
  switch (prioridad) {
    case "P1 CRÍTICO":
      return "bg-red-50 text-red-700 border-red-200 font-bold";
    case "P2 ALTA":
      return "bg-amber-50 text-amber-700 border-amber-200 font-bold";
    case "REINCIDENCIA":
      return "bg-purple-50 text-purple-700 border-purple-200 font-bold";
    default:
      return "bg-blue-50 text-blue-700 border-blue-200 font-medium";
  }
};

// Estilos de Badge para Estado del Ticket
const getEstadoBadgeStyle = (estado: string) => {
  switch (estado) {
    case "PENDIENTE":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "EN PROGRESO":
    case "ASIGNADO":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DERIVADO INSITU":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "EN ESPERA REPUESTO":
      return "bg-amber-50 text-amber-700 border-amber-300";
    case "REABIERTO":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "CERRADO":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const getTicketsColumns = ({
  onActionClick,
  onOpenChat,
}: TicketsColumnsProps): ColumnDef<TicketItem>[] => [
  {
    key: "ticket_solicitante",
    header: "TICKET / PIN / SOLICITANTE",
    render: (item) => (
      <div className="space-y-1.5 py-1">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900 text-xs">
            {item.codigo_ticket}
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.2 ${getPrioridadBadgeStyle(item.prioridad)}`}
          >
            {item.prioridad}
          </Badge>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium block">
            {item.tiempo_o_fecha}
          </span>
          <span className="text-xs font-bold text-slate-800 block">
            {item.solicitante}
          </span>
          <span className="text-[11px] text-slate-500 font-normal block truncate max-w-[200px]">
            {item.cargo_solicitante}
          </span>
        </div>
        <div className="bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/50 text-[11px] text-slate-600 italic font-medium max-w-[220px] truncate">
          "{item.asunto}"
        </div>
      </div>
    ),
  },
  {
    key: "tipo_equipo",
    header: "TIPO DE EQUIPO",
    render: (item) => (
      <div className="flex items-start gap-2">
        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0 mt-0.5">
          <Monitor className="h-4 w-4 text-slate-600" />
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 text-xs block">
            {item.tipo_equipo}
          </span>
          <span className="text-[11px] text-slate-700 font-medium block">
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
    key: "cliente_sucursal",
    header: "CLIENTE / SUCURSAL / ÁREA",
    render: (item) => (
      <div className="space-y-1">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 text-xs block">
            {item.empresa}
          </span>
          <span className="text-[11px] text-slate-600 font-medium block">
            {item.sucursal}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {item.ubicacion_detallada}
          </span>
        </div>
        <div className="inline-block px-2 py-0.5 rounded-md bg-blue-50/80 border border-blue-100 text-[11px] font-semibold text-blue-700">
          {item.area}
        </div>
      </div>
    ),
  },
  {
    key: "asignado_a",
    header: "ASIGNADO A",
    render: (item) =>
      item.asignado_a ? (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
            {item.avatar_asignado || "TR"}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium block">
              Tec.
            </span>
            <span className="text-xs font-bold text-slate-800 block">
              {item.asignado_a}
            </span>
          </div>
        </div>
      ) : (
        <div className="px-2.5 py-1.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 text-amber-800 text-[11px] font-medium w-fit flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          Sin Asignar
        </div>
      ),
  },
  {
    key: "estado",
    header: "ESTADO",
    render: (item) => (
      <Badge
        variant="outline"
        className={`font-bold text-[10px] uppercase px-2.5 py-1 flex items-center gap-1.5 w-fit ${getEstadoBadgeStyle(item.estado)}`}
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
    render: (item) => {
      // Renderizado dinámico de botones según el estado del ticket (igual que en tu captura)
      let actionButton = null;

      if (item.estado === "PENDIENTE") {
        actionButton = (
          <Button
            size="sm"
            onClick={() => onActionClick(item)}
            className="h-8 px-3 text-xs font-bold bg-[#b45309] hover:bg-[#92400e] text-white rounded-lg shadow-xs cursor-pointer"
          >
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Asignar Soporte
          </Button>
        );
      } else if (item.estado === "EN ESPERA REPUESTO") {
        actionButton = (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onActionClick(item)}
            className="h-8 px-3 text-xs font-semibold text-amber-700 bg-white border-amber-200 hover:bg-amber-50 rounded-lg cursor-pointer"
          >
            <Package className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
            Ver Repuesto
          </Button>
        );
      } else if (item.estado === "CERRADO") {
        actionButton = (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onActionClick(item)}
              className="h-8 px-2.5 text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
              Ver Informe
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onActionClick(item)}
              className="h-8 px-2.5 text-xs font-semibold text-blue-700 bg-blue-50/50 border-blue-200 hover:bg-blue-100 rounded-lg cursor-pointer"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
              Reabrir Ticket
            </Button>
          </div>
        );
      } else {
        // Para En Progreso, Derivado InSitu, Reabierto, Asignado
        actionButton = (
          <Button
            size="sm"
            onClick={() => onActionClick(item)}
            className="h-8 px-3 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs cursor-pointer"
          >
            <Lock className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
            Cerrar Ticket
          </Button>
        );
      }

      return (
        <div className="flex items-center justify-end gap-1.5">
          {actionButton}
          {/* Botón para abrir el chat del ticket */}
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
      );
    },
  },
];
