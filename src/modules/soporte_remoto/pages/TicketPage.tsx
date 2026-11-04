import { useState, useEffect } from "react";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import { FileText, LifeBuoy } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { useTickets } from "@/hooks/ticket/useTickets";
import { TicketListItem } from "@/types/ticket/ticket.type";
import { useNavigate } from "react-router-dom";
import { getSoporteTicketsColumns } from "../components/ticket/Columns"; // Ajusta la ruta según tu estructura
import { useAuth } from "@/context/useAuth";

function TicketPage() {
  // 1. Obtenemos el usuario autenticado desde el contexto
  const { user } = useAuth();

  // Extraemos el ID del soporte logueado
  const soporteId = user?.id;

  // 2. Consumimos el hook filtrando automáticamente por 'id_soporte'
  const { tickets, meta, isLoading, limit, updateQuery, setPage, setLimit } =
    useTickets({
      initialParams: soporteId ? { id_soporte: soporteId } : undefined,
    });

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("Todos");

  useEffect(() => {
    const estadoValue = activeTab === "Todos" ? undefined : activeTab;
    updateQuery({ estado: estadoValue });
  }, [activeTab]);

  const handleOpenChat = (item: TicketListItem) => {
    navigate(`/soporte/tickets/${item.id_ticket}`, {
      state: { ticket: item },
    });
  };

  const handleViewDetail = (item: TicketListItem) => {
    navigate(`/soporte/tickets/${item.id_ticket}`, {
      state: { ticket: item },
    });
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* CABECERA */}
      <PageHeader
        category="Portal de Soporte > Gestión de Casos"
        title={
          <div className="flex items-center gap-3">
            <span>Mis Tickets Asignados</span>
          </div>
        }
        description="Visualiza las incidencias técnicas asignadas a tu cuenta, actualiza sus estados y comunícate con los usuarios."
      />

      {/* MÉTRICAS PARA EL SOPORTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="TOTAL ASIGNADOS"
          value={String(meta.total)}
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          footerText="Historial de solicitudes a tu cargo"
        />
        <StatCard
          title="EN PROGRESO / ATENCIÓN"
          value={String(
            tickets.filter((t) =>
              [
                "pendiente",
                "en progreso",
                "asignado",
                "derivado insitu",
              ].includes(t.estado.toLowerCase()),
            ).length,
          )}
          icon={<LifeBuoy className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="Casos activos pendientes de cierre"
        />
        <StatCard
          title="RESUELTOS / CERRADOS"
          value={String(
            tickets.filter((t) => t.estado.toLowerCase() === "cerrado").length,
          )}
          icon={<FileText className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
          footerText="Atenciones finalizadas"
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

      {/* TABLA DE TICKETS DE SOPORTE */}
      <DataTableContainer
        data={tickets}
        columns={getSoporteTicketsColumns({
          onOpenChat: handleOpenChat,
          onViewDetail: handleViewDetail,
        })}
        keyExtractor={(item) => String(item.id_ticket)}
        isLoading={isLoading}
      />

      {/* PAGINACIÓN */}
      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />
    </div>
  );
}

export default TicketPage;
