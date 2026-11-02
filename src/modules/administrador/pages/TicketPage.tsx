import { useState, useEffect } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import {
  FileText,
  RefreshCw,
  Clock,
  ShieldCheck,
  Download,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import {
  getTicketsColumns,
  TicketItem,
} from "@/modules/administrador/components/ticket/TicketsColumns";
import { useTickets } from "@/hooks/ticket/useTickets";
import { TicketListItem } from "@/types/ticket/ticket.type";
import { useNavigate } from "react-router-dom";

function TicketsPage() {
  // 1. Conectamos con el hook de lectura de tickets de la API
  const {
    tickets,
    meta,
    isLoading,
    queryParams,
    limit,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
  } = useTickets();

  // Catálogos globales en cascada (Clientes -> Sucursales -> Áreas)
  const {
    clientes,
    sucursales,
    areas,
    setSelectedClienteId,
    setSelectedSucursalId,
  } = useCatalogOptions();

  const navigate = useNavigate();

  // Estados locales para filtros en cascada
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);
  const [selectedSucursalFilter, setSelectedSucursalFilter] = useState<
    number | null
  >(null);

  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
    setSelectedSucursalFilter(null);
    setSelectedSucursalId(null);
  }, [selectedEmpresaFilter, setSelectedClienteId, setSelectedSucursalId]);

  useEffect(() => {
    setSelectedSucursalId(selectedSucursalFilter);
  }, [selectedSucursalFilter, setSelectedSucursalId]);

  // Estado para la pestaña de estado seleccionada
  const [activeTab, setActiveTab] = useState<string>("Todos");

  // Actualizar filtros de estado en el hook cuando cambia la pestaña
  useEffect(() => {
    if (activeTab === "Todos") {
      updateQuery({ estado: undefined });
    } else {
      updateQuery({ estado: activeTab });
    }
  }, [activeTab]);

  // 2. Mapeador de TicketListItem de la API al formato TicketItem de la tabla
  const mappedTickets: TicketItem[] = tickets.map((t: TicketListItem) => {
    const nombreSoporte = t.soporte
      ? `${t.soporte.nombre} ${t.soporte.apellido}`
      : null;
    const inicialesSoporte = t.soporte
      ? `${t.soporte.nombre[0]}${t.soporte.apellido[0]}`
      : undefined;

    return {
      id_ticket: String(t.id_ticket),
      codigo_ticket: `#${t.pin}`,
      prioridad: t.es_software ? "P2 ALTA" : "P1 CRÍTICO", // Mapeo dinámico o por defecto
      tiempo_o_fecha: t.es_software ? "Software" : "Hardware",
      solicitante: "Trabajador Sede", // O mapearlo si viene en el backend
      cargo_solicitante: t.area?.nombre || "Área General",
      asunto: t.asunto,
      tipo_equipo: t.equipo?.tipo || "Equipo",
      modelo_equipo: t.equipo?.marca_modelo || "N/D",
      serial_equipo: t.equipo?.numero_serie || "S/N",
      empresa: t.cliente?.nombre || "Sin Empresa",
      sucursal: t.sucursal?.nombre || "Sin Sucursal",
      ubicacion_detallada: t.area?.nombre || "Sin Área",
      area: t.area?.nombre || "General",
      asignado_a: nombreSoporte,
      avatar_asignado: inicialesSoporte,
      estado: t.estado.toUpperCase() as any,
    };
  });

  const handleActionClick = (item: TicketItem) => {
    toast.info(`Acción ejecutada para el ticket ${item.codigo_ticket}`);
  };

  const handleOpenChat = (item: TicketItem) => {
    navigate(`/admin/tickets/${item.id_ticket}`);
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* 1. CABECERA */}
      <PageHeader
        category="HelpDesk > Módulos de Gestión"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión y Mesa de Ayuda IT</span>
          </div>
        }
        description="Monitoreo en tiempo real, asignación técnica, seguimiento de SLAs y atención de incidencias operativas."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold h-10 px-4 rounded-xl shadow-xs cursor-pointer text-xs"
              onClick={() =>
                toast.info(
                  "Exportación de tickets (CSV/Excel) en desarrollo...",
                )
              }
            >
              <Download className="mr-2 h-4 w-4 text-slate-500" />
              Exportar Tickets (CSV/Excel)
            </Button>
          </div>
        }
      />

      {/* 3. MÉTRICAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL TICKETS"
          value={String(meta.total)}
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          footerText="Registrados en la plataforma multitenant"
        />
        <StatCard
          title="TICKETS EN PROGRESO"
          value="8"
          icon={<RefreshCw className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="Actualmente en manos de ingenieros"
        />
        <StatCard
          title="TIEMPO MEDIO RESOLUCIÓN"
          value="1.8 hrs"
          icon={<Clock className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
          footerText="Objetivo acordado en contrato: < 2.5 hrs"
        />
        <StatCard
          title="CUMPLIMIENTO SLA"
          value="98.2%"
          icon={<ShieldCheck className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="Meta corporativa pactada: > 95.0%"
        />
      </div>

      {/* 4. BARRA DE FILTROS EN CASCADA */}
      <TableFiltersBar
        searchPlaceholder="Buscar por PIN, asunto o detalle del ticket..."
        dropdowns={[
          {
            key: "id_cliente",
            placeholder: "Empresa / Cliente",
            options: clientes,
          },
          {
            key: "id_sucursal",
            placeholder: "Sucursal",
            options: sucursales,
          },
          {
            key: "id_area",
            placeholder: "Área Organizacional",
            options: areas,
          },
        ]}
        initialValues={queryParams}
        onFilterChange={(key, value) => {
          if (key === "id_cliente") {
            const clienteId = value && value !== "all" ? Number(value) : null;
            setSelectedEmpresaFilter(clienteId);
            updateQuery({ id_cliente: clienteId });
          } else if (key === "id_sucursal") {
            const sucursalId = value && value !== "all" ? Number(value) : null;
            setSelectedSucursalFilter(sucursalId);
            updateQuery({ id_sucursal: sucursalId });
          } else if (key === "id_area") {
            const areaId = value && value !== "all" ? Number(value) : null;
            updateQuery({ id_area: areaId });
          }
        }}
        onApplyFilters={(filters) => {
          updateQuery(filters);
          toast.success("Filtros aplicados correctamente");
        }}
        onResetFilters={() => {
          setSelectedEmpresaFilter(null);
          setSelectedSucursalFilter(null);
          resetQuery();
        }}
      />

      {/* 5. PESTAÑAS DE FILTRADO POR ESTADO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80">
        {[
          { label: "Todos" },
          { label: "Pendiente" },
          { label: "Asignado" },
          { label: "En Progreso" },
          { label: "Derivado Insitu" },
          { label: "En Espera Repuesto" },
          { label: "Reabierto" },
          { label: "Cerrado" },
        ].map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
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

      {/* 6. TABLA DE DATOS */}
      <DataTableContainer
        data={mappedTickets}
        columns={getTicketsColumns({
          onActionClick: handleActionClick,
          onOpenChat: handleOpenChat,
        })}
        keyExtractor={(item) => item.id_ticket}
        isLoading={isLoading}
      />

      {/* 7. PAGINACIÓN */}
      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />
    </div>
  );
}

export default TicketsPage;
