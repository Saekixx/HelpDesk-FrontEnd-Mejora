import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Building2,
  Calendar,
  Download,
  Laptop,
  Ticket,
} from "lucide-react";
import { IncidentsByClientCard } from "../components/IncidentsByClientCard";
import { CitasHoyCard } from "../components/CitasHoyCard";
import {
  mockAlertasLicenciasData,
  mockCitasHoyData,
  mockIncidenciasClienteData,
  mockVolumenRequerimientosData,
} from "../data/dashboardData";
import { useNavigate } from "react-router-dom";
import { VolumenRequerimientosCard } from "../components/VolumenRequerimientosCard";
import { AlertasLicenciasCard } from "../components/AlertasLicenciasCard";

function DashboardPage() {
  const navigate = useNavigate();
  const PREFIX = "/admin";

  return (
    <div className="p-6 space-y-6">
      {/* 1. CABECERA DE LA PÁGINA */}
      <PageHeader
        category="Centro de Operaciones NOC / SOC"
        title="Dashboard de Operaciones IT"
        description="Monitoreo en tiempo real de tickets, SLAs, infraestructura y asignaciones activas"
        actions={
          <>
            <Button
              variant="outline"
              className="bg-slate-50/50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Explorar Dashboard
              <ArrowDown className="ml-2 h-4 w-4 text-orange-600" />
            </Button>
            <Button className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-semibold shadow-sm cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              Descargar Reporte
            </Button>
          </>
        }
      />

      {/* 2. FILA SUPERIOR: 4 TARJETAS DE MÉTRICAS (StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clientes"
          value="18"
          icon={<Building2 className="h-5 w-5 text-green-600" />}
          iconContainerClassName="bg-green-50 text-green-600"
          trend="+3 este mes"
          footerText="38 jurídicos / 4 naturales"
        />
        <StatCard
          title="Tickets en Progreso"
          value="28"
          icon={<Ticket className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          trend="+4% vs ayer"
          trendClassName="text-orange-600 font-bold"
          footerText="En atención activa"
          badge={
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Activos
            </span>
          }
        />
        <StatCard
          title="Citas Programadas"
          value="14"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          iconContainerClassName="bg-blue-50 text-blue-500"
          trend="Hoy"
          trendClassName="font-bold text-slate-700"
          footerText="Visitas in-situ agendadas hoy"
        />
        <StatCard
          title="Equipos Operativos"
          value="1,148"
          secondaryValue="/ 1,294"
          icon={<Laptop className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
          footerText="146 en almacén / stock disponible"
        />
      </div>

      {/* 3. SECCIÓN PRINCIPAL: DISTRIBUCIÓN DE 2 COLUMNAS (ASIMÉTRICA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA (Ocupa 2 espacios): Gráficos y Tarjetas Anchas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Componente: Incidencias por Cliente */}
          <IncidentsByClientCard
            totalTickets={mockIncidenciasClienteData.total_tickets}
            periodo={mockIncidenciasClienteData.fecha_mes}
            incidencias={mockIncidenciasClienteData.incidencias}
            footerText={`Representa el ${mockIncidenciasClienteData.cobertura_porcentaje}% del volumen total de solicitudes IT registradas`}
          />

          {/* Componente: Volumen de Requerimientos */}
          <VolumenRequerimientosCard
            ratioPorcentaje={mockVolumenRequerimientosData.ratio_porcentaje}
            totalRegistrados={mockVolumenRequerimientosData.total_registrados}
            totalResueltos={mockVolumenRequerimientosData.total_resueltos}
            data={mockVolumenRequerimientosData.tendencia_dias}
          />
        </div>

        {/* COLUMNA DERECHA (Ocupa 1 espacio): Barra lateral */}
        <div className="space-y-6">
          {/* Componente: Citas Programadas (Hoy) */}
          <CitasHoyCard
            totalCitas={mockCitasHoyData.total_citas}
            citas={mockCitasHoyData.citas}
            onVerAgendaCompleta={() => navigate(`${PREFIX}/cronograma-citas`)}
          />

          {/* Componente: Alertas de Software & Licencias */}
          <AlertasLicenciasCard
            rangoDias={mockAlertasLicenciasData.rango_dias_alerta}
            alertas={mockAlertasLicenciasData.alertas}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
