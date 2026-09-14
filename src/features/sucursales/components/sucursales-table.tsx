import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Pencil, Power, Building2 } from "lucide-react";
import { SucursalListItem } from "../types/sucursal.entity";

interface SucursalesTableProps {
  sucursales: SucursalListItem[];
  onViewDetails: (sucursal: SucursalListItem) => void;
  onEdit: (sucursal: SucursalListItem) => void;
  onToggleStatus: (sucursal: SucursalListItem) => void;
}

export const SucursalesTable = ({
  sucursales = [],
  onViewDetails,
  onEdit,
  onToggleStatus,
}: SucursalesTableProps) => {
  return (
    <TooltipProvider>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
              <TableHead className="w-[200px] text-xs font-bold uppercase tracking-wider text-gray-500">
                Sucursal
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Empresa
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Encargado
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Contacto
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Áreas
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
            {!sucursales || sucursales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-sm text-gray-500"
                >
                  No se encontraron sucursales registradas.
                </TableCell>
              </TableRow>
            ) : (
              sucursales.map((sucursal) => (
                <TableRow
                  key={sucursal.id_sucursal}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Columna Sucursal */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {sucursal.nombre_sucursal}
                      </span>
                    </div>
                  </TableCell>

                  {/* Columna Empresa */}
                  <TableCell>
                    <span className="text-sm font-medium text-gray-700">
                      {sucursal.cliente?.nombre_principal || "Empresa General"}
                    </span>
                  </TableCell>

                  {/* Columna Encargado */}
                  <TableCell>
                    <span className="text-sm text-gray-800">
                      {sucursal.encargado}
                    </span>
                  </TableCell>

                  {/* Columna Contacto */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {sucursal.telefono}
                      </span>
                      <span className="text-xs text-gray-500">
                        {sucursal.correo}
                      </span>
                    </div>
                  </TableCell>

                  {/* Columna Áreas */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-100 font-medium text-xs px-2.5 py-0.5 rounded-md"
                    >
                      {sucursal.total_areas ?? 1} Sedes
                    </Badge>
                  </TableCell>

                  {/* Columna Estado */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          sucursal.is_active ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          sucursal.is_active
                            ? "text-emerald-600"
                            : "text-gray-500"
                        }`}
                      >
                        {sucursal.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Columna Acciones */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Ver Detalles */}
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => onViewDetails(sucursal)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Ver Detalles</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Editar */}
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                            onClick={() => onEdit(sucursal)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Editar Sucursal</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Estado */}
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 transition-colors ${
                              sucursal.is_active
                                ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                                : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                            }`}
                            onClick={() => onToggleStatus(sucursal)}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>
                            {sucursal.is_active
                              ? "Desactivar Sucursal"
                              : "Activar Sucursal"}
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
