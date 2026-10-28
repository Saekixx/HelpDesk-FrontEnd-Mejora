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

// DATA MOCKEADA DE TICKETS CON VARIOS ESTADOS
const MOCK_TICKETS_DATA: TicketItem[] = [
  {
    id_ticket: "1",
    codigo_ticket: "#TK-4092",
    prioridad: "P1 CRÍTICO",
    tiempo_o_fecha: "Hace 18m",
    solicitante: "Carlos Mendoza",
    cargo_solicitante: "Solicitante: Jefe de...",
    asunto: "Caída de enlace VPN principal sede norte",
    tipo_equipo: "LAP-DEV-09",
    modelo_equipo: "Lenovo ThinkPad T14s Gen 3",
    serial_equipo: "883A-KD01-MX",
    empresa: "Banco Metrópolis",
    sucursal: "Sede Financiera (San Isidro)",
    ubicacion_detallada: "Contabilidad & Finanzas",
    area: "Contabilidad & Finanzas",
    asignado_a: null,
    estado: "PENDIENTE",
  },
  {
    id_ticket: "2",
    codigo_ticket: "#TK-4089",
    prioridad: "P2 ALTA",
    tiempo_o_fecha: "SLA: 1h 20m rest.",
    solicitante: "Mariana Paredes",
    cargo_solicitante: "Analista Senior de Créditos",
    asunto: "Pantallazo azul (BSOD) intermitente",
    tipo_equipo: "DSK-ADM-14",
    modelo_equipo: "Dell OptiPlex 7090 Micro",
    serial_equipo: "DL-4920-CC9",
    empresa: "Banco Metrópolis",
    sucursal: "Sede Financiera (San Isidro)",
    ubicacion_detallada: "Riesgos Crediticios",
    area: "Riesgos Crediticios",
    asignado_a: "Rodrigo A.",
    avatar_asignado: "RA",
    estado: "EN PROGRESO",
  },
  {
    id_ticket: "3",
    codigo_ticket: "#TK-4081",
    prioridad: "P2 ALTA",
    tiempo_o_fecha: "Visita: 10:30 AM\nIng. David Andrade",
    solicitante: "David Andrade",
    cargo_solicitante: "Encargado de Sistemas Local",
    asunto: "Fallo de alimentación en switch core",
    tipo_equipo: "SW-COR-02",
    modelo_equipo: "Cisco Catalyst 9300 48P PoE",
    serial_equipo: "FCW2431C0K7",
    empresa: "Banco Metrópolis",
    sucursal: "Sede Financiera (San Isidro)",
    ubicacion_detallada: "Data Center / Redes",
    area: "Data Center / Redes",
    asignado_a: "Gabriel Morales",
    avatar_asignado: "GM",
    estado: "DERIVADO INSITU",
  },
  {
    id_ticket: "4",
    codigo_ticket: "#TK-4076",
    prioridad: "P3 NORMAL",
    tiempo_o_fecha: "Ayer 16:40",
    solicitante: "Valeria Quintana",
    cargo_solicitante: "Asistente de Tesorería",
    asunto: "Teclado no responde tras actualización",
    tipo_equipo: "LAP-TES-04",
    modelo_equipo: "HP EliteBook 840 G8",
    serial_equipo: "5CC12489K0",
    empresa: "Banco Metrópolis",
    sucursal: "Sucursal Norte (Megaplaza)",
    ubicacion_detallada: "Tesorería & Pagos",
    area: "Tesorería & Pagos",
    asignado_a: "Luis Pacheco",
    avatar_asignado: "LP",
    estado: "EN ESPERA REPUESTO",
  },
  {
    id_ticket: "5",
    codigo_ticket: "#TK-4065",
    prioridad: "REINCIDENCIA",
    tiempo_o_fecha: "Reabierto hace 2h",
    solicitante: "Fernando Salcedo",
    cargo_solicitante: "Especialista de Compensaciones",
    asunto: "Persiste error de autenticación SSO",
    tipo_equipo: "LAP-RRHH-02",
    modelo_equipo: "Lenovo ThinkPad X1 Carbon",
    serial_equipo: "20XW-002BLM",
    empresa: "Banco Metrópolis",
    sucursal: "Sede Financiera (San Isidro)",
    ubicacion_detallada: "Gestión del Talento",
    area: "Gestión del Talento",
    asignado_a: "Rodrigo A.",
    avatar_asignado: "RA",
    estado: "REABIERTO",
  },
  {
    id_ticket: "6",
    codigo_ticket: "#TK-4040",
    prioridad: "P3 NORMAL",
    tiempo_o_fecha: "Resuelto en 42m",
    solicitante: "Rosa Guizado",
    cargo_solicitante: "Oficial de Cumplimiento",
    asunto: "Instalación y configuración de token USB",
    tipo_equipo: "LAP-CUMP-01",
    modelo_equipo: "Dell Latitude 5420",
    serial_equipo: "7K021-99A-MX",
    empresa: "Banco Metrópolis",
    sucursal: "Agencia Centro (Lima)",
    ubicacion_detallada: "Cumplimiento & Legal",
    area: "Cumplimiento & Legal",
    asignado_a: "Carlos Mendoza",
    avatar_asignado: "CM",
    estado: "CERRADO",
  },
  {
    id_ticket: "7",
    codigo_ticket: "#TK-4090",
    prioridad: "P2 ALTA",
    tiempo_o_fecha: "Hace 45m",
    solicitante: "Patricia Alarcón",
    cargo_solicitante: "Coordinadora de Cobranzas",
    asunto: "Bloqueo de puerto ethernet en puesto de trabajo",
    tipo_equipo: "LAP-COB-11",
    modelo_equipo: "Lenovo ThinkPad L14",
    serial_equipo: "LN-992-KLA",
    empresa: "Banco Metrópolis",
    sucursal: "Sede Financiera (San Isidro)",
    ubicacion_detallada: "Cobranzas & Créditos",
    area: "Cobranzas & Créditos",
    asignado_a: "Julio Torres",
    avatar_asignado: "JT",
    estado: "ASIGNADO",
  },
];

function TicketsPage() {
  // Catálogos globales en cascada (Clientes -> Sucursales -> Áreas)
  const {
    clientes,
    sucursales,
    areas,
    setSelectedClienteId,
    setSelectedSucursalId,
  } = useCatalogOptions();

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

  // Estados para tabla y paginación
  const [data] = useState<TicketItem[]>(MOCK_TICKETS_DATA);
  const [isLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});

  // Filtrar datos según la pestaña activa seleccionada arriba
  const filteredData = data.filter((item) => {
    if (activeTab === "Todos") return true;
    if (activeTab === "Pendientes") return item.estado === "PENDIENTE";
    if (activeTab === "En Progreso")
      return item.estado === "EN PROGRESO" || item.estado === "ASIGNADO";
    if (activeTab === "Derivado InSitu")
      return item.estado === "DERIVADO INSITU";
    if (activeTab === "En Espera Repuesto")
      return item.estado === "EN ESPERA REPUESTO";
    if (activeTab === "Reabiertos") return item.estado === "REABIERTO";
    if (activeTab === "Cerrados") return item.estado === "CERRADO";
    return true;
  });

  const handleActionClick = (item: TicketItem) => {
    toast.info(`Acción ejecutada para el ticket ${item.codigo_ticket}`);
  };

  const handleOpenChat = (item: TicketItem) => {
    toast.success(
      `Abriendo chat operativo para el ticket ${item.codigo_ticket}`,
    );
  };

  // Metadatos de paginación limpios
  const meta = {
    total: 34,
    page: page,
    lastPage: 4,
    last_page: 4,
    limit: limit,
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
          title="TOTAL TICKETS MENSUAL"
          value="142"
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          footerText="+8.4% vs mes ant. Registrados en la plataforma multitenant"
        />
        <StatCard
          title="TICKETS EN PROGRESO"
          value="28"
          icon={<RefreshCw className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="5 P1 Criticos. Actualmente en manos de ingenieros T1-T3"
        />
        <StatCard
          title="TIEMPO MEDIO RESOLUCIÓN (MTTR)"
          value="1.8 hrs"
          icon={<Clock className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
          footerText="-14% optimizado. Objetivo acordado en contrato: < 2.5 hrs"
        />
        <StatCard
          title="CUMPLIMIENTO SLA GLOBAL"
          value="98.2%"
          icon={<ShieldCheck className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="En Rango Gold. Meta corporativa pactada: > 95.0%"
        />
      </div>

      {/* 4. BARRA DE FILTROS EN CASCADA */}
      <TableFiltersBar
        searchPlaceholder="Buscar por ID (#TK-XXXX), asunto o trabajador solicitante..."
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
          } else if (key === "id_sucursal") {
            const sucursalId = value && value !== "all" ? Number(value) : null;
            setSelectedSucursalFilter(sucursalId);
          }
        }}
        onApplyFilters={(filters) => {
          setQueryParams(filters);
          toast.success("Filtros aplicados correctamente");
        }}
        onResetFilters={() => {
          setSelectedEmpresaFilter(null);
          setSelectedSucursalFilter(null);
          setQueryParams({});
        }}
      />

      {/* 5. PESTAÑAS DE FILTRADO POR ESTADO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80">
        {[
          { label: "Todos", count: 34 },
          { label: "Pendientes", count: 4 },
          { label: "En Progreso", count: 8 },
          { label: "Derivado InSitu", count: 3 },
          { label: "En Espera Repuesto", count: 2 },
          { label: "Reabiertos", count: 1 },
          { label: "Cerrados", count: 16 },
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
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 6. TABLA DE DATOS */}
      <DataTableContainer
        data={filteredData}
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
