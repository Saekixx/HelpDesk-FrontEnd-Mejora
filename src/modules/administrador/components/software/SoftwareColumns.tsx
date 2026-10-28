import { ColumnDef } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Settings,
  FileCode,
  Shield,
  Monitor,
  Database,
  Cloud,
} from "lucide-react";

export interface SoftwareItem {
  id_software: string;
  nombre_software: string;
  categoria: string;
  empresa_cliente: string;
  tipo_modelo: string;
  usados: number;
  total_cupos: number;
  libres: number;
  porcentaje: number;
  proveedor: string;
  vigencia: string;
  estado: "Activo" | "Próximo a vencer" | "Cupo Lieno";
}

interface SoftwareColumnsProps {
  onViewDetail: (item: SoftwareItem) => void;
  onEdit: (item: SoftwareItem) => void;
  onManageLicenses: (item: SoftwareItem) => void;
}

// Icono según la categoría del software
const getSoftwareIcon = (categoria: string) => {
  if (categoria.includes("Suite") || categoria.includes("Ofimática"))
    return <Cloud className="h-4 w-4 text-blue-500 shrink-0" />;
  if (categoria.includes("Sistema"))
    return <Monitor className="h-4 w-4 text-indigo-500 shrink-0" />;
  if (categoria.includes("Seguridad"))
    return <Shield className="h-4 w-4 text-amber-500" />;
  if (categoria.includes("Bases de Datos"))
    return <Database className="h-4 w-4 text-orange-500 shrink-0" />;
  return <FileCode className="h-4 w-4 text-slate-500 shrink-0" />;
};

// Estilos de Badge para los estados de licencia
const getEstadoBadgeStyle = (estado: string) => {
  switch (estado) {
    case "Activo":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Próximo a vencer":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Cupo Lieno":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getDotColor = (estado: string) => {
  switch (estado) {
    case "Activo":
      return "bg-emerald-500";
    case "Próximo a vencer":
      return "bg-amber-500";
    case "Cupo Lieno":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
};

export const getSoftwareColumns = ({
  onViewDetail,
  onEdit,
  onManageLicenses,
}: SoftwareColumnsProps): ColumnDef<SoftwareItem>[] => [
  {
    key: "software_categoria",
    header: "SOFTWARE Y CATEGORÍA",
    render: (item) => (
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0">
          {getSoftwareIcon(item.categoria)}
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 text-xs block leading-tight">
            {item.nombre_software}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            {item.categoria}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "empresa_cliente",
    header: "EMPRESA / CLIENTE",
    render: (item) => (
      <span className="text-xs font-semibold text-slate-700 block max-w-[140px] leading-snug">
        {item.empresa_cliente}
      </span>
    ),
  },
  {
    key: "tipo_modelo",
    header: "TIPO DE MODELO",
    render: (item) => (
      <Badge
        variant="outline"
        className="font-semibold text-[11px] px-2.5 py-1 bg-slate-100 text-slate-700 border-slate-200/60 w-fit"
      >
        {item.tipo_modelo}
      </Badge>
    ),
  },
  {
    key: "cupos_ocupacion",
    header: "CUPOS Y OCUPACIÓN",
    render: (item) => {
      const isFull = item.usados >= item.total_cupos;
      const barColor = isFull
        ? "bg-red-500"
        : item.porcentaje > 90
          ? "bg-amber-500"
          : "bg-[#ff5722]";

      return (
        <div className="space-y-1.5 min-w-[140px]">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-800">
              {item.usados} / {item.total_cupos}{" "}
              <span className="font-normal text-slate-400">
                ({item.porcentaje}%)
              </span>
            </span>
            <span
              className={
                isFull ? "text-red-600 font-bold" : "text-amber-600 font-medium"
              }
            >
              {isFull ? "Agotado" : `${item.libres} libres`}
            </span>
          </div>
          {/* Barra de progreso */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
            <div
              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${Math.min(item.porcentaje, 100)}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    key: "proveedor",
    header: "PROVEEDOR",
    render: (item) => (
      <span className="text-xs font-medium text-slate-600 block max-w-[130px]">
        {item.proveedor}
      </span>
    ),
  },
  {
    key: "vigencia",
    header: "VIGENCIA / CADUCIDAD",
    render: (item) => (
      <span className="text-xs font-medium text-slate-700 font-mono">
        {item.vigencia}
      </span>
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
        {item.estado === "Cupo Lieno" ? "Cupo Lleno" : item.estado}
      </Badge>
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
          title="Editar Licencia"
          onClick={() => onEdit(item)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer"
          title="Configurar Licencias / Cupos"
          onClick={() => onManageLicenses(item)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
