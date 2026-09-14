import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutGrid, Eye, Power, Pencil } from "lucide-react";
import { AreaListItem } from "../types/areas.entity";

interface AreasTableProps {
  areas?: AreaListItem[];
  onViewDetails?: (area: AreaListItem) => void;
  onEdit?: (area: AreaListItem) => void;
  onToggleStatus?: (area: AreaListItem) => void;
}

export const AreasTable = ({
  areas = [],
  onViewDetails,
  onEdit,
  onToggleStatus,
}: AreasTableProps) => {
  return (
    <TooltipProvider>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3.5">
                ÁREA
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3.5">
                EMPRESA
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3.5">
                SUCURSAL
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3.5">
                ESTADO
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3.5 text-right pr-6">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {areas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-sm text-gray-500"
                >
                  No se encontraron áreas.
                </TableCell>
              </TableRow>
            ) : (
              areas.map((area) => (
                <TableRow
                  key={area.id_area}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Nombre de Área con Ícono */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-md border border-orange-100 text-[#FF5722]">
                        <LayoutGrid className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {area.nombre_area}
                      </span>
                    </div>
                  </TableCell>

                  {/* Empresa */}
                  <TableCell className="text-sm text-gray-600 font-medium py-4">
                    {area.cliente?.nombre || "—"}
                  </TableCell>

                  {/* Sucursal */}
                  <TableCell className="text-sm text-sky-500 font-medium py-4">
                    {area.sucursal?.nombre || "—"}
                  </TableCell>

                  {/* Estado */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          area.is_active ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={
                          area.is_active ? "text-emerald-600" : "text-gray-500"
                        }
                      >
                        {area.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Acciones idénticas a ClientesTable */}
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Ver Detalles */}
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => onViewDetails?.(area)}
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
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={() => onEdit?.(area)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Editar Área</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Estado */}
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 transition-colors ${
                              area.is_active
                                ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                                : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                            onClick={() => onToggleStatus?.(area)}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>
                            {area.is_active
                              ? "Desactivar Área"
                              : "Activar Área"}
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
