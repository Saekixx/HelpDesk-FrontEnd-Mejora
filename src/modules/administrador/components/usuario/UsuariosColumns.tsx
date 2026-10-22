import { ColumnDef } from "@/types/table";
import { Edit2, Power, MoreVertical, Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, UserAvatar } from "@/components/table/TableBadges";
import { UsuarioItem } from "@/types/usuario/usuario.types";

const getRolBadgeStyle = (rol: string) => {
  switch (rol) {
    case "ADMINISTRADOR":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "SOPORTE_TECNICO":
    case "SOPORTE_INSITU":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-purple-50 text-purple-700 border-purple-200";
  }
};

interface UsuariosColumnsProps {
  onEdit: (usuario: UsuarioItem) => void;
  onToggleStatus: (usuario: UsuarioItem) => void;
}

export const getUsuariosColumns = ({
  onEdit,
  onToggleStatus,
}: UsuariosColumnsProps): ColumnDef<UsuarioItem>[] => [
  {
    key: "usuario",
    header: "USUARIO",
    render: (usr) => (
      <div className="flex items-center gap-3">
        <UserAvatar name={usr.nombre} surname={usr.apellido} />
        <div>
          <p className="font-extrabold text-slate-900 leading-snug">
            {usr.nombre} {usr.apellido}
          </p>
          <p className="text-slate-400 text-[11px] font-medium">{usr.correo}</p>
        </div>
      </div>
    ),
  },
  {
    key: "rol",
    header: "ROL & NIVEL",
    render: (usr) => (
      <Badge
        variant="outline"
        className={`font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-1 flex items-center gap-1.5 w-fit ${getRolBadgeStyle(
          usr.nombre_rol,
        )}`}
      >
        <Shield className="h-3 w-3 shrink-0" />
        {usr.nombre_rol ? usr.nombre_rol.replace(/_/g, " ") : ""}
      </Badge>
    ),
  },
  {
    key: "ubicacion",
    header: "EMPRESA / SUCURSAL / ÁREA",
    render: (usr) => (
      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <div>
          {usr.nombre_cliente ? (
            <span>
              {usr.nombre_cliente} · {usr.nombre_sucursal} ·{" "}
              <span className="text-slate-500 font-normal">
                {usr.nombre_area}
              </span>
            </span>
          ) : usr.zonas && usr.zonas.length > 0 ? (
            <span className="text-emerald-700 font-bold">
              Zona: {usr.zonas.map((z) => z.nombre_zona).join(", ")}
            </span>
          ) : (
            <span className="text-slate-400 italic">
              Sin asignación corporativa
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "estado",
    header: "ESTADO",
    render: (usr) => <StatusBadge isActive={usr.is_active} />,
  },
  {
    key: "acciones",
    header: "ACCIONES",
    className: "text-right",
    render: (usr) => (
      <div className="flex items-center justify-end gap-1 text-slate-400">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Editar usuario"
          onClick={() => onEdit(usr)} // <-- Pasamos el objeto de la fila directamente
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-lg cursor-pointer ${
            usr.is_active
              ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
              : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
          }`}
          title={usr.is_active ? "Desactivar" : "Activar"}
          onClick={() => onToggleStatus(usr)} // <--- Pasamos el objeto completo al hacer clic
        >
          <Power className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
