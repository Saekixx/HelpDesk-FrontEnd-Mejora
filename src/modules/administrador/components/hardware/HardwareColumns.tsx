import { ColumnDef } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Cpu,
  HardDrive,
  Zap,
  Server,
  ArrowRightLeft,
} from "lucide-react";
import { HardwareItem } from "@/types/hardware/hardware.types";

interface HardwareColumnsProps {
  onViewDetail: (item: HardwareItem) => void;
  onEdit: (item: HardwareItem) => void;
  onToggleStatus: (item: HardwareItem) => void; // Abre el modal de transición
}

// Icono según el tipo de componente físico devuelto por la API
const getHardwareIcon = (tipo: string) => {
  if (tipo.includes("RAM"))
    return <Cpu className="h-4 w-4 text-blue-500 shrink-0" />;
  if (tipo.includes("ALMACENAMIENTO"))
    return <HardDrive className="h-4 w-4 text-orange-500 shrink-0" />;
  if (tipo.includes("FUENTE"))
    return <Zap className="h-4 w-4 text-amber-500 shrink-0" />;
  if (tipo.includes("PROCESADOR"))
    return <Cpu className="h-4 w-4 text-indigo-500 shrink-0" />;
  return <Server className="h-4 w-4 text-slate-500 shrink-0" />;
};

// Estilos de Badge personalizados según el estado del backend
const getEstadoBadgeStyle = (estado: string) => {
  switch (estado) {
    case "INSTALADO":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "DISPONIBLE":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "EN_MANTENIMIENTO":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "BAJA":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getDotColor = (estado: string) => {
  switch (estado) {
    case "INSTALADO":
      return "bg-emerald-500";
    case "DISPONIBLE":
      return "bg-blue-500";
    case "EN_MANTENIMIENTO":
      return "bg-amber-500";
    case "BAJA":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
};

export const getHardwareColumns = ({
  onViewDetail,
  onEdit,
  onToggleStatus,
}: HardwareColumnsProps): ColumnDef<HardwareItem>[] => [
  {
    key: "numero_serie",
    header: "NÚMERO DE SERIE",
    render: (item) => (
      <div className="space-y-0.5">
        <span className="font-bold text-slate-900 text-xs block">
          {item.numero_serie}
        </span>
        <span className="text-[11px] text-slate-400 font-medium block">
          ID: #{item.id_hardware}
        </span>
      </div>
    ),
  },
  {
    key: "tipo_componente",
    header: "TIPO DE COMPONENTE",
    render: (item) => (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-semibold min-w-[150px]">
        {getHardwareIcon(item.tipo_componente)}
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-slate-800">
            {item.tipo_componente_label}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "marca_modelo",
    header: "MARCA Y MODELO",
    render: (item) => (
      <div className="space-y-0.5">
        <span className="font-bold text-slate-800 text-xs block">
          {item.marca_modelo}
        </span>
        <span className="text-[11px] text-slate-400 font-mono block">
          Costo: S/. {item.costo_unitario ?? 0}
        </span>
      </div>
    ),
  },
  {
    key: "proveedor",
    header: "PROVEEDOR",
    render: (item) => (
      <span className="text-xs font-medium text-slate-600">
        {item.proveedor || "N/A"}
      </span>
    ),
  },
  {
    key: "fecha_compra",
    header: "FECHA COMPRA",
    render: (item) => (
      <span className="text-xs font-medium text-slate-600">
        {item.fecha_compra
          ? new Date(item.fecha_compra).toLocaleDateString("es-ES", {
              timeZone: "UTC",
            })
          : "N/A"}
      </span>
    ),
  },
  {
    key: "estado",
    header: "ESTADO ACTUAL",
    render: (item) => (
      <div className="space-y-0.5">
        <Badge
          variant="outline"
          className={`font-bold text-[10px] uppercase px-2.5 py-0.5 flex items-center gap-1.5 w-fit ${getEstadoBadgeStyle(item.estado)}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.estado)}`}
          />
          {item.estado_label}
        </Badge>
        <span className="text-[11px] text-slate-400 font-medium block truncate max-w-[160px]">
          {item.equipo_actual
            ? `Equipo: ${item.equipo_actual.nombre_equipo}`
            : "Sin equipo asignado"}
        </span>
      </div>
    ),
  },
  {
    key: "acciones",
    header: "ACCIONES",
    className: "text-right",
    render: (item) => (
      <div className="flex items-center justify-end gap-1 text-slate-400">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Ver Detalle"
          onClick={() => onViewDetail(item)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
          title="Editar Componente"
          onClick={() => onEdit(item)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        {/* Ícono para abrir el Modal de Transición de Estado / Asignación */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer"
          title="Transición de Estado / Instalar"
          onClick={() => onToggleStatus(item)}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
