import { ColumnDef } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Power, Cpu, HardDrive, Zap, Server } from "lucide-react";

export interface HardwareItem {
  id_hardware: string;
  serial: string;
  codigo_interno: string;
  tipo: string;
  subtipo?: string;
  marca_modelo: string;
  sku: string;
  proveedor: string;
  fecha_compra: string;
  estado: "Instalado" | "Disponible" | "En Mantenimiento" | "Baja";
  ubicacion_o_equipo: string;
}

interface HardwareColumnsProps {
  onViewDetail: (item: HardwareItem) => void;
  onEdit: (item: HardwareItem) => void;
  onToggleStatus: (item: HardwareItem) => void;
}

// Icono según el tipo de componente físico
const getHardwareIcon = (tipo: string) => {
  if (tipo.includes("RAM"))
    return <Cpu className="h-4 w-4 text-blue-500 shrink-0" />;
  if (tipo.includes("SSD") || tipo.includes("HDD"))
    return <HardDrive className="h-4 w-4 text-orange-500 shrink-0" />;
  if (tipo.includes("Fuente"))
    return <Zap className="h-4 w-4 text-amber-500 shrink-0" />;
  if (tipo.includes("Core") || tipo.includes("CPU"))
    return <Cpu className="h-4 w-4 text-indigo-500 shrink-0" />;
  return <Server className="h-4 w-4 text-slate-500 shrink-0" />;
};

// Estilos de Badge personalizados según el estado
const getEstadoBadgeStyle = (estado: string) => {
  switch (estado) {
    case "Instalado":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Disponible":
      return "bg-blue-50 text-blue-700 border-blue-200";
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
    case "Instalado":
      return "bg-emerald-500";
    case "Disponible":
      return "bg-blue-500";
    case "En Mantenimiento":
      return "bg-amber-500";
    case "Baja":
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
    key: "serial",
    header: "ID / SERIE",
    render: (item) => (
      <div className="space-y-0.5">
        <span className="font-bold text-slate-900 text-xs block">
          {item.serial}
        </span>
        <span className="text-[11px] text-slate-400 font-medium block">
          {item.codigo_interno}
        </span>
      </div>
    ),
  },
  {
    key: "tipo",
    header: "TIPO",
    render: (item) => (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-semibold min-w-[130px]">
        {getHardwareIcon(item.tipo)}
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-slate-800">{item.tipo}</span>
          {item.subtipo && (
            <span className="text-[10px] text-slate-500 font-medium">
              {item.subtipo}
            </span>
          )}
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
          {item.sku}
        </span>
      </div>
    ),
  },
  {
    key: "proveedor",
    header: "PROVEEDOR",
    render: (item) => (
      <span className="text-xs font-medium text-slate-600">
        {item.proveedor}
      </span>
    ),
  },
  {
    key: "fecha_compra",
    header: "FECHA COMPRA",
    render: (item) => (
      <span className="text-xs font-medium text-slate-600">
        {item.fecha_compra}
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
          {item.estado}
        </Badge>
        <span className="text-[11px] text-slate-400 font-medium block truncate max-w-[160px]">
          {item.ubicacion_o_equipo}
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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
          title="Cambiar Estado / Baja"
          onClick={() => onToggleStatus(item)}
        >
          <Power className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
