import { ColumnDef } from "@/types/table";
import { Eye, Edit2, Power, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/table/TableBadges";
import { ClienteListItem } from "@/types/cliente/cliente.types";

const getPlanBadgeStyle = (plan: unknown) => {
  const planText = String(plan || "").toLowerCase();
  if (planText.includes("enterprise") || planText.includes("tech")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (planText.includes("pro")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
};

// Función para estilizar según el tipo de cliente
const getTipoBadgeStyle = (tipo: string) => {
  switch (tipo?.toUpperCase()) {
    case "JURIDICA":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "NATURAL":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-purple-50 text-purple-700 border-purple-200";
  }
};

interface ClientesColumnsProps {
  onViewDetail?: (cliente: ClienteListItem) => void;
  onEdit?: (cliente: ClienteListItem) => void;
  onToggleStatus?: (cliente: ClienteListItem) => void;
}

export const getClientesColumns = ({
  onViewDetail,
  onEdit,
  onToggleStatus,
}: ClientesColumnsProps): ColumnDef<ClienteListItem>[] => [
  {
    key: "cliente",
    header: "CLIENTE",
    render: (cli) => {
      const initials = cli.nombre_principal
        ? cli.nombre_principal
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "CL";

      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-extrabold text-xs text-slate-700 shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-extrabold text-slate-900 leading-snug">
              {cli.nombre_principal}
            </p>
            <p className="text-slate-400 text-[11px] font-medium">
              {cli.rubro || "Sin rubro especificado"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "tipo",
    header: "TIPO",
    render: (cli) => (
      <Badge
        variant="outline"
        className={`font-bold text-[10px] tracking-wide px-2.5 py-0.5 rounded-md w-fit ${getTipoBadgeStyle(
          cli.tipo_cliente,
        )}`}
      >
        {cli.tipo_cliente === "JURIDICA" ? "Jurídica" : "Natural"}
      </Badge>
    ),
  },
  {
    key: "ruc_doc",
    header: "RUC / DOC",
    render: (cli) => (
      <span className="text-xs font-semibold text-slate-700 tracking-wide">
        {cli.numero_documento}
      </span>
    ),
  },
  {
    key: "sucursales",
    header: "SUCURSALES",
    render: (cli) => (
      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span>
          {cli.totalSucursales === 1
            ? "1 Sede Principal"
            : `${cli.totalSucursales} Sedes`}
        </span>
      </div>
    ),
  },
  {
    key: "plan_soporte",
    header: "PLAN SOPORTE",
    render: (cli) => {
      // Extraemos el nombre del plan desde el objeto planSoporte.tipo (ej: "Tech Enterprise")
      const planName =
        typeof cli.planSoporte === "object" && cli.planSoporte !== null
          ? (cli.planSoporte as any).tipo ||
            (cli.planSoporte as any).nombre ||
            "Plan asignado"
          : cli.planSoporte || "Sin plan";

      return (
        <Badge
          variant="outline"
          className={`font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-md flex items-center gap-1 w-fit ${getPlanBadgeStyle(
            planName,
          )}`}
        >
          <ShieldCheck className="h-3 w-3 shrink-0" />
          {planName}
        </Badge>
      );
    },
  },
  {
    key: "estado",
    header: "ESTADO",
    render: (cli) => {
      // Evaluamos tanto el nuevo is_active (booleano) como posibles respaldos antiguos
      const isActive =
        cli.is_active === true ||
        (cli.estado as any) === 1 ||
        (cli.estado as any) === "1" ||
        String(cli.estado).toLowerCase() === "activo";

      return <StatusBadge isActive={isActive} />;
    },
  },
  {
    key: "acciones",
    header: "ACCIONES",
    className: "text-right",
    render: (cli) => {
      const isActive =
        cli.is_active === true ||
        (cli.estado as any) === 1 ||
        (cli.estado as any) === "1" ||
        String(cli.estado).toLowerCase() === "activo";

      return (
        <div className="flex items-center justify-end gap-1 text-slate-400">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Ver detalle del cliente"
            onClick={() => onViewDetail && onViewDetail(cli)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Editar cliente"
            onClick={() => onEdit && onEdit(cli)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-lg cursor-pointer ${
              isActive
                ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
            title={isActive ? "Desactivar" : "Activar"}
            onClick={() => onToggleStatus && onToggleStatus(cli)}
          >
            <Power className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
