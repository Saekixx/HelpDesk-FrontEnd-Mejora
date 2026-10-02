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
import { RotateCcw, CheckCircle2, UserPlus, Play } from "lucide-react";
import { TicketEntity } from "../types/ticket.entity";

interface TicketsTableProps {
  tickets: TicketEntity[];
  onReopen?: (ticket: TicketEntity) => void;
  onClose?: (ticket: TicketEntity) => void;
  onAssign?: (ticket: TicketEntity) => void;
  onStartChat?: (ticket: TicketEntity) => void;
}

export const TicketsTable = ({
  tickets = [],
  onReopen,
  onClose,
  onAssign,
  onStartChat,
}: TicketsTableProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderStatusBadge = (estado: string) => {
    const estadoNormalized = estado?.toLowerCase().replace(/_/g, " ").trim();

    switch (estadoNormalized) {
      case "cerrado":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-medium px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 w-max">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Cerrado
          </Badge>
        );
      case "en progreso":
        return (
          <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none font-medium px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 w-max">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            En Progreso
          </Badge>
        );
      case "pendiente":
        return (
          <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-none font-medium px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 w-max">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pendiente
          </Badge>
        );
      case "reabierto":
        return (
          <Badge className="bg-purple-50 text-purple-600 hover:bg-purple-50 border-none font-medium px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 w-max">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Reabierto
          </Badge>
        );
      case "asignado":
        return (
          <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-none font-medium px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 w-max">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Asignado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600 text-xs">
            {estado}
          </Badge>
        );
    }
  };

  const renderActions = (ticket: TicketEntity) => {
    const estadoNormalized = ticket.estado
      ?.toLowerCase()
      .replace(/_/g, " ")
      .trim();

    switch (estadoNormalized) {
      case "cerrado":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                onClick={() => onReopen?.(ticket)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Reabrir ticket</p>
            </TooltipContent>
          </Tooltip>
        );

      case "pendiente":
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={() => onAssign?.(ticket)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Asignar soporte</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => onClose?.(ticket)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Cerrar ticket</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );

      case "asignado":
      case "reabierto":
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => onStartChat?.(ticket)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Iniciar atención</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => onClose?.(ticket)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Cerrar ticket</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );

      case "en progreso":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                onClick={() => onClose?.(ticket)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Cerrar ticket</p>
            </TooltipContent>
          </Tooltip>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5">
                TICKET
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5">
                FECHA DE CREACIÓN
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5">
                EQUIPO
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5">
                CLIENTE
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5">
                ASIGNADO A
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5">
                ESTADO
              </TableHead>
              <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!tickets || tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-sm text-gray-500"
                >
                  No se encontraron tickets registrados.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow
                  key={ticket.id_tickets}
                  className="hover:bg-gray-50/60 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900">
                        {ticket.asunto}
                      </span>
                      <span className="text-xs text-gray-400 font-normal mt-0.5">
                        #{ticket.pin} ·{" "}
                        {ticket.usuario?.nombre || "Sin usuario"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600 py-3.5">
                    {formatDate(ticket.fecha_creacion)}
                  </TableCell>

                  <TableCell className="text-sm text-gray-600 py-3.5">
                    {ticket.equipo?.tipo_equipo || "-"}
                  </TableCell>

                  <TableCell className="text-sm text-gray-600 py-3.5">
                    {ticket.cliente?.nombre || "-"}
                  </TableCell>

                  <TableCell className="py-3.5">
                    {ticket.soporte?.nombre ? (
                      <span className="text-sm text-sky-500 font-medium">
                        {ticket.soporte.nombre}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300 font-normal">
                        Sin asignar
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-3.5">
                    {renderStatusBadge(ticket.estado)}
                  </TableCell>

                  <TableCell className="text-right py-3.5">
                    {renderActions(ticket)}
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
