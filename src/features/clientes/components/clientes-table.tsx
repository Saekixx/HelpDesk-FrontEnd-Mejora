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
import { Eye, Pencil, Power } from "lucide-react";
import { Cliente, TipoCliente } from "../types/cliente.entity";

interface ExtendedCliente extends Cliente {
  total_sucursales?: number;
  plan?: {
    id_plan: number;
    nombre: string;
  };
}

interface ClientesTableProps {
  clientes: ExtendedCliente[];
  onViewDetails: (cliente: ExtendedCliente) => void;
  onEdit: (cliente: ExtendedCliente) => void;
  onToggleStatus: (cliente: ExtendedCliente) => void;
}

export const ClientesTable = ({
  clientes = [],
  onViewDetails,
  onEdit,
  onToggleStatus,
}: ClientesTableProps) => {
  const getInitials = (nombre: string) => {
    if (!nombre) return "CL";
    const words = nombre.trim().split(" ");
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  const getTipoBadgeStyle = (tipo?: TipoCliente) => {
    switch (tipo) {
      case TipoCliente.JURIDICA:
        return "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50";
      case TipoCliente.NATURAL:
        return "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50";
    }
  };

  const getPlanBadgeStyle = (planName?: string) => {
    const name = planName?.toLowerCase() || "";
    if (name.includes("premium") || name.includes("enterprise")) {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    if (name.includes("estándar") || name.includes("estandar")) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
              <TableHead className="w-[280px] text-xs font-bold uppercase tracking-wider text-gray-500">
                Cliente
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Tipo
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                RUC/DOC
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Sucursales
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Plan
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
            {!clientes || clientes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-sm text-gray-500"
                >
                  No se encontraron clientes registrados.
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow
                  key={cliente.id_cliente}
                  className="hover:bg-gray-50/50"
                >
                  {/* Columna Cliente */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-indigo-600">
                        <AvatarFallback className="bg-indigo-600 text-xs font-bold text-white">
                          {getInitials(cliente.nombre_principal)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900">
                          {cliente.nombre_principal}
                        </span>
                        <span className="text-xs text-gray-500">
                          {cliente.correo}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Columna Tipo */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-md ${getTipoBadgeStyle(
                        cliente.tipo_cliente,
                      )}`}
                    >
                      {cliente.tipo_cliente === TipoCliente.JURIDICA
                        ? "Jurídica"
                        : "Natural"}
                    </Badge>
                  </TableCell>

                  {/* Columna RUC/DOC */}
                  <TableCell>
                    <span className="text-sm font-medium text-gray-800">
                      {cliente.numero_documento}
                    </span>
                  </TableCell>

                  {/* Columna Sucursales */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-100 font-medium text-xs px-2.5 py-0.5"
                    >
                      {cliente.total_sucursales ?? 1} Sedes
                    </Badge>
                  </TableCell>

                  {/* Columna Plan */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-medium text-xs px-2.5 py-0.5 border-none ${getPlanBadgeStyle(
                        cliente.plan?.nombre,
                      )}`}
                    >
                      {cliente.plan?.nombre || "Básico"}
                    </Badge>
                  </TableCell>

                  {/* Columna Estado */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          cliente.is_active ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          cliente.is_active
                            ? "text-emerald-600"
                            : "text-gray-500"
                        }`}
                      >
                        {cliente.is_active ? "Activo" : "Inactivo"}
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
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => onViewDetails(cliente)}
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
                            onClick={() => onEdit(cliente)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Editar Cliente</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Estado */}
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 transition-colors ${
                              cliente.is_active
                                ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                                : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                            onClick={() => onToggleStatus(cliente)}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>
                            {cliente.is_active
                              ? "Desactivar Cliente"
                              : "Activar Cliente"}
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
