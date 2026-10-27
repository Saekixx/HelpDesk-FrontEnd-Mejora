import { ColumnDef } from "@/types/table";
import {
  Eye,
  Edit2,
  Power,
  Building2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/table/TableBadges";
import { SucursalListItem } from "@/types/sucursal/sucursal.types";

interface SucursalesColumnsProps {
  onViewDetail?: (sucursal: SucursalListItem) => void;
  onEdit?: (sucursal: SucursalListItem) => void;
  onToggleStatus?: (sucursal: SucursalListItem) => void;
}

export const getSucursalesColumns = ({
  onViewDetail,
  onEdit,
  onToggleStatus,
}: SucursalesColumnsProps): ColumnDef<SucursalListItem>[] => [
  {
    key: "sucursal",
    header: "SUCURSAL",
    render: (suc) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff5722] shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <p className="font-extrabold text-slate-900 leading-snug">
            {suc.nombre_sucursal}
          </p>
          <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {suc.direccion || "Sin dirección especificada"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "empresa",
    header: "EMPRESA",
    render: (suc) => (
      <div className="space-y-0.5">
        {/* CORREGIDO: Usamos cliente_empresa en lugar de cliente */}
        <p className="font-bold text-slate-800 text-xs">
          {suc.cliente_empresa?.nombre || "Sin empresa"}
        </p>
        <p className="text-slate-400 text-[11px]">
          {suc.zona?.nombre ? `Zona: ${suc.zona.nombre}` : "Sin zona asignada"}
        </p>
      </div>
    ),
  },
  {
    key: "encargado",
    header: "ENCARGADO",
    render: (suc) => {
      const nombreEncargado = suc.encargado
        ? `${suc.encargado.nombre} ${suc.encargado.apellido}`
        : "No asignado";

      return (
        <span className="text-xs font-semibold text-slate-700">
          {nombreEncargado}
        </span>
      );
    },
  },
  {
    key: "contacto",
    header: "CONTACTO",
    render: (suc) => {
      const telefono =
        suc.encargado?.telefono_contacto ||
        (suc as any).telefono ||
        "Sin teléfono";
      const correo =
        suc.encargado?.correo || (suc as any).correo || "Sin correo";

      return (
        <div className="text-[11px] space-y-0.5 text-slate-600">
          <div className="flex items-center gap-1 font-medium">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{telefono}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Mail className="h-3 w-3 text-slate-400" />
            <span className="truncate max-w-[160px]" title={correo}>
              {correo}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    key: "areas",
    header: "ÁREAS",
    render: (suc) => (
      <Badge
        variant="outline"
        className="font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border-blue-200 w-fit"
      >
        {suc.total_areas === 1 ? "1 Área" : `${suc.total_areas} Áreas`}
      </Badge>
    ),
  },
  {
    key: "estado",
    header: "ESTADO",
    render: (suc) => <StatusBadge isActive={suc.is_active} />,
  },
  {
    key: "acciones",
    header: "ACCIONES",
    className: "text-right",
    render: (suc) => (
      <div className="flex items-center justify-end gap-1 text-slate-400">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Ver detalle de sucursal"
          onClick={() => onViewDetail && onViewDetail(suc)}
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Editar sucursal"
          onClick={() => onEdit && onEdit(suc)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-lg cursor-pointer ${
            suc.is_active
              ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
              : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
          }`}
          title={suc.is_active ? "Desactivar" : "Activar"}
          onClick={() => onToggleStatus && onToggleStatus(suc)}
        >
          <Power className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
