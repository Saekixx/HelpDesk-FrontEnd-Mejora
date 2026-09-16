import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Power } from "lucide-react";
import { UserListItem } from "../types/user.entity";

interface UsersTableProps {
  users: UserListItem[];
  onEdit: (user: UserListItem) => void;
  onToggleStatus: (user: UserListItem) => void;
}

export const UsersTable = ({
  users,
  onEdit,
  onToggleStatus,
}: UsersTableProps) => {
  const getInitials = (nombre: string, apellido: string) => {
    const n = nombre?.[0] || "";
    const a = apellido?.[0] || "";
    return `${n}${a}`.toUpperCase();
  };

  const getRoleBadgeStyle = (roleName?: string | null) => {
    const role = roleName?.toUpperCase();
    switch (role) {
      case "ADMINISTRADOR":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50";
      case "SOPORTE_TECNICO":
      case "SOPORTE REMOTO":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";
      case "SOPORTE_INSITU":
      case "SOPORTE INSITU":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
      case "CLIENTE_EMPRESA":
      case "CLIENTE EMPRESA":
        return "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50";
      case "CLIENTE_SUCURSAL":
      case "CLIENTE SUCURSAL":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50";
    }
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
              <TableHead className="w-[280px] text-xs font-bold uppercase tracking-wider text-gray-500">
                Usuario
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Rol
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Empresa / Sucursal / Área
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Estado
              </TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-sm text-gray-500"
                >
                  No se encontraron usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id_usuario} className="hover:bg-gray-50/50">
                  {/* Columna Usuario */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-indigo-600">
                        <AvatarFallback className="bg-indigo-600 text-xs font-bold text-white">
                          {getInitials(user.nombre, user.apellido)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900">
                          {user.nombre} {user.apellido}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.correo}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Columna Rol */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-md ${getRoleBadgeStyle(
                        user.nombre_rol,
                      )}`}
                    >
                      {user.nombre_rol || "SIN ROL"}
                    </Badge>
                  </TableCell>

                  {/* Columna Jerarquía Corporativa */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {user.nombre_cliente || "Sin Empresa"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.nombre_sucursal || "Sin Sucursal"} •{" "}
                        {user.nombre_area || "Sin Área"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Columna Estado */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.is_active ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          user.is_active ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Columna Acciones */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Editar Usuario */}
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-gray-900"
                              onClick={() => onEdit(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent side="bottom">
                          <p>Editar Usuario</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Activar / Desactivar Usuario */}
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 transition-colors ${
                                user.is_active
                                  ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                  : "text-red-500 hover:bg-red-50 hover:text-red-600"
                              }`}
                              onClick={() => onToggleStatus(user)}
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent side="bottom">
                          <p>
                            {user.is_active
                              ? "Desactivar Usuario"
                              : "Activar Usuario"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};
