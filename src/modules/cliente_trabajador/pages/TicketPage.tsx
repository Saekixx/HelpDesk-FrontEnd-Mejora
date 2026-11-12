import { useState, useEffect } from "react";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import { FileText, Plus, LifeBuoy } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useTickets } from "@/hooks/ticket/useTickets";
import { TicketListItem } from "@/types/ticket/ticket.type";
import { useNavigate } from "react-router-dom";
import {
  getTrabajadorTicketsColumns,
  TrabajadorTicketItem,
} from "../components/ticket/Columns";
import { useAuth } from "@/context/useAuth";
import { CreateTicketModal } from "@/components/ticket/CreateTicketModal";

function TicketPage() {
  // 1. Obtenemos el usuario autenticado directamente desde el AuthContext
  const { user } = useAuth();

  // Extraemos el ID de forma segura
  const trabajadorId = user?.id;

  // Estado para controlar la apertura/cierre del modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 2. Consumir el hook extrayendo también `refetch` para actualizar la tabla manualmente si hace falta
  const {
    tickets,
    meta,
    isLoading,
    limit,
    updateQuery,
    setPage,
    setLimit,
    refetch,
  } = useTickets({
    initialParams: { id_trabajador: trabajadorId },
    userId: trabajadorId,
  });

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("Todos");

  useEffect(() => {
    const estadoValue = activeTab === "Todos" ? undefined : activeTab;
    updateQuery({ estado: estadoValue });
  }, [activeTab]);

  // Mapear los tickets obtenidos del backend a la estructura que espera la tabla
  const mappedTickets: TrabajadorTicketItem[] = tickets.map(
    (t: TicketListItem) => {
      const nombreSoporte = t.soporte
        ? `${t.soporte.nombre} ${t.soporte.apellido}`
        : null;
      const inicialesSoporte = t.soporte
        ? `${t.soporte.nombre[0]}${t.soporte.apellido[0]}`
        : undefined;

      return {
        id_ticket: String(t.id_ticket),
        codigo_ticket: `#${t.pin}`,
        asunto: t.asunto || "Sin asunto",
        detalle: t.detalle || "Sin descripción",
        tipo_equipo: t.equipo?.tipo || "Equipo General",
        modelo_equipo: t.equipo?.marca_modelo || "Modelo N/D",
        serial_equipo: t.equipo?.numero_serie || "S/N",
        asignado_a: nombreSoporte,
        avatar_asignado: inicialesSoporte,
        estado: t.estado ? t.estado.toUpperCase() : "PENDIENTE",
      };
    },
  );

  const handleOpenChat = (item: TrabajadorTicketItem) => {
    navigate(`/trabajador/tickets/${item.id_ticket}`, {
      state: { ticket: item },
    });
  };

  const handleViewDetail = (item: TrabajadorTicketItem) => {
    navigate(`/trabajador/tickets/${item.id_ticket}`, {
      state: { ticket: item },
    });
  };

  const handleOpenNewTicket = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* CABECERA */}
      <PageHeader
        category="Portal de Trabajador > Mis Incidencias"
        title={
          <div className="flex items-center gap-3">
            <span>Mis Tickets de Soporte</span>
          </div>
        }
        description="Visualiza el estado de tus solicitudes de asistencia técnica, comunícate con el soporte asignado y reporta nuevas incidencias."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleOpenNewTicket}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ticket
            </Button>
          </div>
        }
      />

      {/* MÉTRICAS SIMPLIFICADAS PARA EL TRABAJADOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="MIS TICKETS TOTALES"
          value={String(meta.total)}
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          footerText="Historial de solicitudes registradas"
        />
        <StatCard
          title="EN PROGRESO / ATENCIÓN"
          value={String(
            tickets.filter((t) =>
              ["pendiente", "en progreso", "asignado"].includes(
                t.estado.toLowerCase(),
              ),
            ).length,
          )}
          icon={<LifeBuoy className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="Incidencias activas en curso"
        />
        <StatCard
          title="RESUELTOS / CERRADOS"
          value={String(
            tickets.filter((t) => t.estado.toLowerCase() === "cerrado").length,
          )}
          icon={<FileText className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
          footerText="Atenciones finalizadas con éxito"
        />
      </div>

      {/* PESTAÑAS DE FILTRADO POR ESTADO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 pt-2">
        {[
          { label: "Todos", value: "Todos" },
          { label: "Pendiente", value: "Pendiente" },
          { label: "En Progreso", value: "En Progreso" },
          { label: "Derivado InSitu", value: "Derivado Insitu" },
          { label: "En Espera Repuesto", value: "En Espera Repuesto" },
          { label: "Cerrado", value: "Cerrado" },
        ].map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#ff5722] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABLA DE TICKETS DEL TRABAJADOR */}
      <DataTableContainer
        data={mappedTickets}
        columns={getTrabajadorTicketsColumns({
          onOpenChat: handleOpenChat,
          onViewDetail: handleViewDetail,
        })}
        keyExtractor={(item) => item.id_ticket}
        isLoading={isLoading}
      />

      {/* PAGINACIÓN */}
      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />

      {/* 3. Pasamos refetch directamente a onSuccess para recargar la tabla automáticamente */}
      <CreateTicketModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        usuarioId={trabajadorId ?? 0}
        onSuccess={() => {
          refetch(); // <-- Esto fuerza la recarga de la lista y las métricas de inmediato
        }}
      />
    </div>
  );
}

export default TicketPage;
