import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { CronogramaCalendarStrip } from "@/components/cronograma/CronogramaCalendarStrip";
import { VisitasTimeline } from "@/components/cronograma/VisitasTimeline";
import { ResumenOperativoCard } from "@/components/cronograma/ResumenOperativoCard";
import { AccionesRapidasCard } from "@/components/cronograma/AccionesRapidasCard";
import {
  VisitaDetailModal,
  VisitaItem,
} from "@/components/cronograma/VisitaDetailModal";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { toast } from "sonner";

function CronogramaPage() {
  // 1. Extraemos clientes, sucursales y setSelectedClienteId del hook en cascada
  const { clientes, sucursales, setSelectedClienteId } = useCatalogOptions();

  // Estado local para rastrear la empresa seleccionada en el filtro
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);

  // 2. Sincronizamos la empresa seleccionada con el hook para alimentar automáticamente las sucursales
  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
  }, [selectedEmpresaFilter, setSelectedClienteId]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});

  // Estados para controlar el Modal de Detalle de Visita
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVisita, setSelectedVisita] = useState<VisitaItem | null>(null);

  const handleOpenDetail = (visita: VisitaItem) => {
    setSelectedVisita(visita);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      <PageHeader
        category="IT OPERATIONS & DISPATCH"
        title="Cronograma de Citas & Visitas Técnicas"
        description="Planificación de mantenimientos preventivos, instalaciones en sitio y visitas de soporte técnico."
      />

      <TableFiltersBar
        searchPlaceholder="Buscar por técnico, cliente o número de OT..."
        dropdowns={[
          {
            key: "id_cliente",
            placeholder: "Todas las Empresas",
            options: clientes,
          },
          {
            key: "id_sucursal",
            placeholder: "Todas las Sedes",
            options: sucursales, // Se alimentarán dinámicamente al seleccionar la empresa
          },
          {
            key: "estado_cita",
            placeholder: "Todos los Estados",
            options: [
              { label: "Pendiente", value: "pendiente" },
              { label: "En Camino", value: "en_camino" },
              { label: "Completada", value: "completada" },
              { label: "Reprogramada", value: "reprogramada" },
            ],
          },
        ]}
        initialValues={queryParams}
        onFilterChange={(key, value) => {
          // 3. Capturamos cuando cambia el cliente en el filtro superior
          if (key === "id_cliente") {
            const clienteId = value && value !== "all" ? Number(value) : null;
            setSelectedEmpresaFilter(clienteId);
          }
        }}
        onApplyFilters={(filters) => {
          setQueryParams(filters);
          toast.success("Filtros aplicados al cronograma");
        }}
        onResetFilters={() => {
          setSelectedEmpresaFilter(null);
          setQueryParams({});
          toast.info("Filtros restablecidos");
        }}
      />

      <CronogramaCalendarStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <VisitasTimeline
            selectedDate={selectedDate}
            onViewDetail={handleOpenDetail}
          />
        </div>

        <div className="space-y-4">
          <ResumenOperativoCard />
          <AccionesRapidasCard />
        </div>
      </div>

      {/* Modal de Detalle de Visita */}
      <VisitaDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        visita={selectedVisita}
      />
    </div>
  );
}

export default CronogramaPage;
