import { ColumnDef } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Lock,
  Unlock,
  Power,
  Monitor,
  Laptop,
  Server,
} from "lucide-react";

export interface EquipoItem {
  id_equipo: string;
  tag: string;
  modelo_equipo: string;
  asignado_a: string;
  detalles_asignacion: string;
  is_assigned: boolean;
  estado: "Activo" | "En Almacén" | "En Mantenimiento" | "Baja";
}

interface EquiposColumnsProps {
  onViewDetail: (item: EquipoItem) => void;
  onToggleAssign: (item: EquipoItem) => void;
  onToggleStatus: (item: EquipoItem) => void;
}

// Icono según el tipo de equipo detectado por el tag o modelo
const getEquipoIcon = (tag: string) => {
  if (tag.startsWith("LAP"))
    return <Laptop className="h-4 w-4 text-blue-500 shrink-0" />;
  if (tag.startsWith("EQ-CSCO") || tag.startsWith("EQ-FRT"))
    return <Server className="h-4 w-4 text-amber-500 shrink-0" />;
  return <Monitor className="h-4 w-4 text-orange-500 shrink-0" />;
};

// Estilos de Badge para los estados
const getEstadoBadgeStyle = (estado: string) => {
  switch (estado) {
    case "Activo":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "En Almacén":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "En Mantenimiento":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Baja":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getDotColor = (estado: string) => {
  switch (estado) {
    case "Activo":
      return "bg-emerald-500";
    case "En Almacén":
      return "bg-slate-400";
    case "En Mantenimiento":
      return "bg-amber-500";
    case "Baja":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
};

export const getEquiposColumns = ({
  onViewDetail,
  onToggleAssign,
  onToggleStatus,
}: EquiposColumnsProps): ColumnDef<EquipoItem>[] => [
  {
    key: "tag_equipo",
    header: "TAG / EQUIPO",
    render: (item) => (
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0">
          {getEquipoIcon(item.tag)}
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 text-xs block leading-tight">
            {item.tag}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            {item.modelo_equipo}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "asignado_a",
    header: "ASIGNADO A",
    render: (item) => (
      <div className="space-y-0.5">
        <span
          className={`text-xs font-bold block leading-tight ${item.is_assigned ? "text-slate-900" : "text-slate-400 italic"}`}
        >
          {item.asignado_a}
        </span>
        <span className="text-[11px] text-slate-500 font-medium block">
          {item.detalles_asignacion}
        </span>
      </div>
    ),
  },
  {
    key: "estado",
    header: "ESTADO",
    render: (item) => (
      <Badge
        variant="outline"
        className={`font-bold text-[10px] uppercase px-2.5 py-0.5 flex items-center gap-1.5 w-fit ${getEstadoBadgeStyle(item.estado)}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.estado)}`}
        />
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
        {/* Botón Ver Detalle */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
          onClick={() => onViewDetail(item)}
        >
          <FileText className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
          Ver
        </Button>

        {/* Botón Asignar / Liberar dinámico */}
        {item.is_assigned ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs font-semibold text-red-700 bg-red-50/50 border-red-200 hover:bg-red-100/60 rounded-lg cursor-pointer"
            onClick={() => onToggleAssign(item)}
          >
            <Unlock className="mr-1.5 h-3.5 w-3.5 text-red-500" />
            Liberar
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100/60 rounded-lg cursor-pointer"
            onClick={() => onToggleAssign(item)}
          >
            <Lock className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            Asignar
          </Button>
        )}

        {/* Botón Encender / Apagar / Estado */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
          title="Cambiar estado operativo"
          onClick={() => onToggleStatus(item)}
        >
          <Power className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
