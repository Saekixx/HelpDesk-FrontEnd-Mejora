import { ColumnDef } from "@/types/table";
import {
  Eye,
  Edit2,
  Power,
  Layers,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/table/TableBadges";
import { AreaListItem } from "@/types/area/area.types";

interface AreasColumnsProps {
  onViewDetail?: (area: AreaListItem) => void;
  onEdit?: (area: AreaListItem) => void;
  onToggleStatus?: (area: AreaListItem) => void;
}

export const getAreasColumns = ({
  onViewDetail,
  onEdit,
  onToggleStatus,
}: AreasColumnsProps): ColumnDef<AreaListItem>[] => [
  {
    key: "area",
    header: "ÁREA",
    render: (area) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
          <Layers className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <p className="font-extrabold text-slate-900 leading-snug">
            {area.nombre_area}
          </p>
          <p className="text-slate-400 text-[11px] font-medium">
            Código: AR-{String(area.id_area).padStart(2, "0")}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "empresa",
    header: "EMPRESA",
    render: (area) => (
      <div className="space-y-0.5">
        <p className="font-bold text-slate-800 text-xs">
          {area.cliente?.nombre || "Sin empresa"}
        </p>
        <p className="text-slate-400 text-[11px]">RUC / Corporativo</p>
      </div>
    ),
  },
  {
    key: "sucursal",
    header: "SUCURSAL",
    render: (area) => (
      <Badge
        variant="outline"
        className="font-bold text-[11px] tracking-wide px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border-blue-200 w-fit"
      >
        <Building2 className="h-3 w-3 mr-1 shrink-0" />
        {area.sucursal?.nombre || "Sin sucursal"}
      </Badge>
    ),
  },
  {
    key: "contacto",
    header: "CONTACTO RESPONSABLE",
    render: (area) => (
      <div className="text-[11px] space-y-0.5 text-slate-600">
        <p className="font-bold text-slate-800">
          {area.contacto || "No asignado"}
        </p>
        <div className="flex items-center gap-1 font-medium text-slate-500">
          <Phone className="h-3 w-3 text-slate-400" />
          <span>{area.telefono || "Sin teléfono"}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Mail className="h-3 w-3 text-slate-400" />
          <span className="truncate max-w-[160px]">
            {area.correo || "Sin correo"}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "estado",
    header: "ESTADO",
    render: (area) => <StatusBadge isActive={area.is_active} />,
  },
  {
    key: "acciones",
    header: "ACCIONES",
    className: "text-right",
    render: (area) => (
      <div className="flex items-center justify-end gap-1 text-slate-400">
        {/* Ver detalle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Ver detalle de área"
          onClick={() => onViewDetail && onViewDetail(area)}
        >
          <Eye className="h-4 w-4" />
        </Button>

        {/* Editar */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Editar área"
          onClick={() => onEdit && onEdit(area)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        {/* Activar / Desactivar con icono Power */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-lg cursor-pointer ${
            area.is_active
              ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
              : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
          }`}
          title={area.is_active ? "Desactivar" : "Activar"}
          onClick={() => onToggleStatus && onToggleStatus(area)}
        >
          <Power className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
