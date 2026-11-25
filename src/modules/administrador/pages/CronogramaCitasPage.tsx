import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { CronogramaCalendarStrip } from "@/components/cronograma/CronogramaCalendarStrip";
import { VisitasTimeline } from "@/components/cronograma/VisitasTimeline";
import { VisitaDetailModal } from "@/components/cronograma/VisitaDetailModal";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import {
  useCitasSoporte,
  useCitaSoporteDetail,
} from "@/hooks/citas/useCitasSoporte";
import { toast } from "sonner";

const toYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ESTADO_OPTIONS = [
  { label: "Pendiente", value: "Pendiente" },
  { label: "En Camino", value: "En Camino" },
  { label: "Completada", value: "Completada" },
  { label: "Cancelada", value: "Cancelada" },
  { label: "Reprogramada", value: "Reprogramada" },
];

function CronogramaPage() {
  const { clientes, sucursales, setSelectedClienteId } = useCatalogOptions();

  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);

  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
  }, [selectedEmpresaFilter, setSelectedClienteId]);

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const { citas, isLoading, updateParams, refetch } = useCitasSoporte({
    page: 1,
    limit: 10,
    fecha_programada: toYYYYMMDD(selectedDate),
  });

  const handleSelectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      updateParams({ fecha_programada: toYYYYMMDD(date) });
    },
    [updateParams],
  );

  const [selectedCitaId, setSelectedCitaId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { cita: citaDetail, isLoading: isLoadingDetail } = useCitaSoporteDetail(
    isDetailModalOpen ? selectedCitaId : null,
  );

  const handleOpenDetail = useCallback((idCita: number) => {
    setSelectedCitaId(idCita);
    setIsDetailModalOpen(true);
  }, []);

  const dropdowns = useMemo(
    () => [
      {
        key: "id_cliente",
        placeholder: "Todas las Empresas",
        options: clientes,
      },
      {
        key: "id_sucursal",
        placeholder: "Todas las Sedes",
        options: sucursales,
      },
      {
        key: "estado",
        placeholder: "Todos los Estados",
        options: ESTADO_OPTIONS,
      },
    ],
    [clientes, sucursales],
  );

  const handleFilterChange = useCallback((key: string, value: any) => {
    if (key === "id_cliente") {
      const clienteId = value && value !== "all" ? Number(value) : null;
      setSelectedEmpresaFilter((prev) =>
        prev === clienteId ? prev : clienteId,
      );
    }
  }, []);

  const handleApplyFilters = useCallback(
    (filters: Record<string, any>) => {
      updateParams({
        search: filters.search || undefined,
        id_cliente:
          filters.id_cliente && filters.id_cliente !== "all"
            ? Number(filters.id_cliente)
            : undefined,
        id_sucursal:
          filters.id_sucursal && filters.id_sucursal !== "all"
            ? Number(filters.id_sucursal)
            : undefined,
        estado:
          filters.estado && filters.estado !== "all"
            ? String(filters.estado)
            : undefined,
        fecha_programada: filters.fecha_programada || toYYYYMMDD(selectedDate),
        page: 1,
      });
      toast.success("Filtros aplicados al cronograma");
    },
    [updateParams, selectedDate],
  );

  const handleResetFilters = useCallback(() => {
    setSelectedEmpresaFilter(null);
    updateParams({
      search: undefined,
      id_cliente: undefined,
      id_sucursal: undefined,
      estado: undefined,
      fecha_programada: toYYYYMMDD(selectedDate),
      page: 1,
    });
    refetch();
    toast.info("Filtros restablecidos");
  }, [updateParams, selectedDate, refetch]);

  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsDetailModalOpen(open);
    if (!open) setSelectedCitaId(null);
  }, []);

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      <PageHeader
        category="IT OPERATIONS & DISPATCH"
        title="Cronograma de Citas & Visitas Técnicas"
        description="Planificación de mantenimientos preventivos, instalaciones en sitio y visitas de soporte técnico."
      />

      <TableFiltersBar
        searchPlaceholder="Buscar por técnico, cliente o ID de cita..."
        dropdowns={dropdowns}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <CronogramaCalendarStrip
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      <VisitasTimeline
        citas={citas}
        selectedDate={selectedDate}
        isLoading={isLoading}
        onViewDetail={handleOpenDetail}
      />

      <VisitaDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={handleModalOpenChange}
        cita={citaDetail}
        isLoading={isLoadingDetail}
      />
    </div>
  );
}

export default CronogramaPage;
