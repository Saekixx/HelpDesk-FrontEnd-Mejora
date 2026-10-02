import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTickets } from "@/features/tickets/hooks/useTickets";
import { TicketEntity } from "@/features/tickets/types/ticket.entity";
import { useTicketMutations } from "@/features/tickets/hooks/useTicketMutations";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { TicketsTable } from "@/features/tickets/components/tickets-table";
import { TicketsFilters } from "@/features/tickets/components/tickets-filters";
import { AsignarSoporteModal } from "@/features/tickets/components/AsignarSoporteModal";

export const TicketsPage = () => {
  const { tickets, meta, loading, setPage, setFilterValues, refetch } =
    useTickets();

  const { assignSupport, startChat, reopenTicket, closeTicket, isSubmitting } =
    useTicketMutations({
      onSuccess: refetch,
    });

  const {
    trabajadores,
    loading: loadingCatalogos,
    setSelectedClienteId,
    setSelectedSucursalId,
    setSelectedAreaId,
  } = useCatalogOptions();

  // Estado para modal de creación de ticket
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Estado para el modal de asignación de soporte
  const [ticketToAssign, setTicketToAssign] = useState<TicketEntity | null>(
    null,
  );

  // Estado para modales de confirmación (Reabrir, Cerrar, Iniciar Atención)
  const [selectedTicketForAction, setSelectedTicketForAction] = useState<{
    ticket: TicketEntity;
    action: "reopen" | "close" | "start-chat";
  } | null>(null);

  // Abrir modal de asignación de soporte filtrando catálogos por contexto del ticket
  const handleOpenAssignModal = (ticket: TicketEntity) => {
    setSelectedClienteId(ticket.cliente?.id ?? null);
    setSelectedSucursalId(ticket.sucursal?.id ?? null);
    setSelectedAreaId(ticket.area?.id ?? null);

    setTicketToAssign(ticket);
  };

  // Confirmar asignación de soporte
  const handleConfirmAssign = async (ticketId: number, soporteId: number) => {
    try {
      const ok = await assignSupport({
        id_ticket: ticketId,
        id_soporte: soporteId,
      });
      if (ok) {
        toast.success("Soporte asignado exitosamente");
      } else {
        toast.error("No se pudo asignar el soporte al ticket");
      }
    } catch {
      toast.error("Ocurrió un error al asignar el soporte");
    }
  };

  // Confirmar acciones de alerta (Reabrir, Cerrar, Iniciar Atención)
  const handleConfirmAction = async () => {
    if (!selectedTicketForAction) return;

    const { ticket, action } = selectedTicketForAction;

    try {
      if (action === "reopen") {
        const ok = await reopenTicket(ticket.id_tickets);
        if (ok) toast.success("Ticket reabierto con éxito");
        else toast.error("Error al reabrir el ticket");
      } else if (action === "close") {
        const ok = await closeTicket(ticket.id_tickets);
        if (ok) toast.success("Ticket cerrado exitosamente");
        else toast.error("Error al cerrar el ticket");
      } else if (action === "start-chat") {
        const ok = await startChat(ticket.id_tickets);
        if (ok) toast.success("Atención iniciada. Estado: En Progreso");
        else toast.error("Error al iniciar la atención del ticket");
      }
    } catch {
      toast.error("Ha ocurrido un error inesperado");
    } finally {
      setSelectedTicketForAction(null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Encabezado Principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gestión de Tickets
          </h1>
          <p className="text-sm text-gray-500">
            Seguimiento, asignación y resolución de incidencias técnicas
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Ticket
        </Button>
      </div>

      {/* Filtros */}
      <TicketsFilters onApplyFilters={setFilterValues} />

      {/* Tabla e Indicador de Carga / Paginación */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Cargando tickets...</div>
      ) : (
        <>
          <TicketsTable
            tickets={tickets}
            onReopen={(t) =>
              setSelectedTicketForAction({ ticket: t, action: "reopen" })
            }
            onClose={(t) =>
              setSelectedTicketForAction({ ticket: t, action: "close" })
            }
            onStartChat={(t) =>
              setSelectedTicketForAction({ ticket: t, action: "start-chat" })
            }
            onAssign={handleOpenAssignModal}
          />

          <PaginationControls
            page={meta?.page ?? 1}
            lastPage={meta?.totalPages ?? 1}
            total={meta?.total ?? 0}
            limit={meta?.limit ?? 10}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Modal para Asignar Soporte */}
      <AsignarSoporteModal
        isOpen={!!ticketToAssign}
        onClose={() => setTicketToAssign(null)}
        ticket={ticketToAssign}
        trabajadoresOptions={trabajadores}
        loadingTrabajadores={loadingCatalogos.trabajadores}
        onAssign={handleConfirmAssign}
        isSubmitting={isSubmitting}
      />

      {/* AlertDialog de Confirmación para Acciones (Reabrir, Cerrar, Iniciar Atención) */}
      <AlertDialog
        open={!!selectedTicketForAction}
        onOpenChange={(open: boolean) =>
          !open && setSelectedTicketForAction(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedTicketForAction?.action === "reopen" &&
                "¿Reabrir ticket?"}
              {selectedTicketForAction?.action === "close" && "¿Cerrar ticket?"}
              {selectedTicketForAction?.action === "start-chat" &&
                "¿Iniciar atención?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedTicketForAction?.action === "reopen" &&
                "¿Estás seguro de que deseas reabrir el ticket "}
              {selectedTicketForAction?.action === "close" &&
                "¿Estás seguro de que deseas marcar como cerrado el ticket "}
              {selectedTicketForAction?.action === "start-chat" &&
                "¿Deseas cambiar el estado a 'En Progreso' e iniciar la atención del ticket "}
              <strong className="text-gray-900">
                #{selectedTicketForAction?.ticket.pin} -{" "}
                {selectedTicketForAction?.ticket.asunto}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isSubmitting}
              className={
                selectedTicketForAction?.action === "close"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : selectedTicketForAction?.action === "reopen"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
              }
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketsPage;
