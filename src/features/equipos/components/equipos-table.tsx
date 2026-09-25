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
import { Pencil, Power, Eye, Laptop, Monitor } from "lucide-react";
import { EquipoListItem } from "../types/equipo.entity";

interface EquiposTableProps {
  equipos: EquipoListItem[];
  onEdit: (equipo: EquipoListItem) => void;
  onViewDetail?: (equipo: EquipoListItem) => void;
  onToggleStatus: (equipo: EquipoListItem) => void;
}

export const EquiposTable = ({
  equipos,
  onEdit,
  onViewDetail,
  onToggleStatus,
}: EquiposTableProps) => {
  const getInitials = (fullName?: string | null) => {
    if (!fullName) return "SA";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getEquipmentIcon = (tipo: string) => {
    const isDesktop = tipo.toLowerCase().includes("desktop");
    return isDesktop ? (
      <Monitor className="h-5 w-5 text-gray-500" />
    ) : (
      <Laptop className="h-5 w-5 text-gray-500" />
    );
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
              <TableHead className="w-[280px] text-xs font-bold uppercase tracking-wider text-gray-500">
                Equipo
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Empresa
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Sucursal
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Área
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Asignado A
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
            {equipos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-sm text-gray-500"
                >
                  No se encontraron equipos registrados.
                </TableCell>
              </TableRow>
            ) : (
              equipos.map((equipo) => (
                <TableRow
                  key={equipo.id_equipo}
                  className="hover:bg-gray-50/50"
                >
                  {/* Columna Equipo */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getEquipmentIcon(equipo.tipo)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900">
                          {equipo.marca} {equipo.tipo}
                        </span>
                        <span className="text-xs text-gray-500">
                          {equipo.num_serie}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Columna Empresa */}
                  <TableCell className="text-sm font-medium text-gray-800">
                    {equipo.cliente?.nombre || "Sin Empresa"}
                  </TableCell>

                  {/* Columna Sucursal */}
                  <TableCell className="text-sm text-sky-600 font-medium">
                    {equipo.sucursal?.nombre || "Sin Sucursal"}
                  </TableCell>

                  {/* Columna Área */}
                  <TableCell className="text-sm text-gray-600">
                    {equipo.area?.nombre || "Sin Área"}
                  </TableCell>

                  {/* Columna Asignado A */}
                  <TableCell>
                    {equipo.nombre_usuario || equipo.trabajador?.nombre ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 bg-sky-500">
                          <AvatarFallback className="bg-sky-500 text-[10px] font-bold text-white">
                            {getInitials(
                              equipo.nombre_usuario ||
                                equipo.trabajador?.nombre,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-800">
                          {equipo.nombre_usuario || equipo.trabajador?.nombre}
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-500 hover:bg-gray-100 font-normal"
                      >
                        Sin asignar
                      </Badge>
                    )}
                  </TableCell>

                  {/* Columna Estado */}
                  <TableCell>
                    <Badge
                      className={
                        equipo.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
                      }
                      variant="outline"
                    >
                      {equipo.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  {/* Columna Acciones */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Editar Equipo */}
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-gray-900"
                              onClick={() => onEdit(equipo)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent side="bottom">
                          <p>Editar Equipo</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Ver Detalle */}
                      {onViewDetail && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                onClick={() => onViewDetail(equipo)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent side="bottom">
                            <p>Ver Detalle</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* Toggle Estado */}
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 transition-colors ${
                                equipo.is_active
                                  ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                  : "text-red-500 hover:bg-red-50 hover:text-red-600"
                              }`}
                              onClick={() => onToggleStatus(equipo)}
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent side="bottom">
                          <p>
                            {equipo.is_active
                              ? "Desactivar Equipo"
                              : "Activar Equipo"}
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
