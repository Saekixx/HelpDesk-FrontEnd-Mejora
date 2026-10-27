import { useState, useEffect } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import {
  Layers,
  CheckCircle2,
  HardDrive,
  Ticket,
  Plus,
  Download,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { AreaListItem } from "@/types/area/area.types";
import { ConfirmStatusModal } from "@/components/ConfirmStatusModal";
import { toast } from "sonner";
import { useAreas } from "@/hooks/area/useAreas";
import { useAreaMutations } from "@/hooks/area/useAreaMutations";
import { getAreasColumns } from "../components/area/AreasColumns";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { AreaModal } from "@/components/area/AreaModal";

function AreasPage() {
  const {
    areas,
    meta,
    isLoading,
    queryParams,
    limit,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch,
  } = useAreas();

  // Hook para los selects del catálogo en cascada
  const { clientes, sucursales, setSelectedClienteId } = useCatalogOptions();

  // Estado local para rastrear la empresa seleccionada en el filtro al instante
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(queryParams.id_cliente ? Number(queryParams.id_cliente) : null);

  // Cada vez que cambia la empresa seleccionada en el filtro, actualizamos el hook de catálogos
  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
  }, [selectedEmpresaFilter, setSelectedClienteId]);

  const { toggleAreaStatus, isSubmitting: isTogglingStatus } =
    useAreaMutations();

  // Estados para los modales
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [areaToToggle, setAreaToToggle] = useState<AreaListItem | null>(null);

  // Estados para el Modal de Crear / Editar Área
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState<any | null>(null);

  const handleOpenCreate = () => {
    setAreaToEdit(null);
    setIsAreaModalOpen(true);
  };

  const handleViewDetail = (area: AreaListItem) => {
    toast.info(`Ver detalle de área: ${area.nombre_area}`);
  };

  const handleEdit = (area: AreaListItem) => {
    setAreaToEdit(area);
    setIsAreaModalOpen(true);
  };

  const handleSuccessModal = () => {
    toast.success(
      areaToEdit
        ? "Área actualizada correctamente"
        : "Área creada correctamente",
    );
    refetch();
  };

  const handleOpenToggleStatus = (area: AreaListItem) => {
    setAreaToToggle(area);
    setIsStatusModalOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!areaToToggle) return;
    try {
      const mensaje = await toggleAreaStatus(areaToToggle.id_area);
      toast.success(mensaje || "Estado del área actualizado correctamente");
      setIsStatusModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al cambiar el estado.");
    }
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      <PageHeader
        category="MÓDULOS DE GESTIÓN > ORGANIZACIÓN"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión de Áreas</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ff5722] border border-orange-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              {meta.total} Áreas Registradas
            </span>
          </div>
        }
        description="Organización de departamentos, responsables locales y asignación por sede."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold h-10 px-4 rounded-xl shadow-xs cursor-pointer text-xs"
              onClick={() => toast.info("Exportación CSV en desarrollo...")}
            >
              <Download className="mr-2 h-4 w-4 text-slate-500" />
              Exportar Áreas (CSV)
            </Button>

            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Área
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL ÁREAS"
          value={String(meta.total)}
          icon={<Layers className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="ÁREAS OPERATIVAS"
          value="64"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="EQUIPOS ASIGNADOS"
          value="312"
          icon={<HardDrive className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="TICKETS GENERADOS"
          value="142"
          icon={<Ticket className="h-5 w-5 text-purple-600" />}
          iconContainerClassName="bg-purple-50 text-purple-600"
        />
      </div>

      <TableFiltersBar
        searchPlaceholder="Buscar área por nombre, empresa o encargado..."
        dropdowns={[
          {
            key: "id_cliente",
            placeholder: "Empresa: Todas",
            options: clientes,
          },
          {
            key: "id_sucursal",
            placeholder: "Sucursal: Todas",
            options: sucursales,
          },
          {
            key: "is_active",
            placeholder: "Estado: Todos",
            options: [
              { label: "Activo", value: "true" },
              { label: "Inactivo", value: "false" },
            ],
          },
        ]}
        initialValues={queryParams}
        onFilterChange={(key, value) => {
          if (key === "id_cliente") {
            const clienteId = value && value !== "all" ? Number(value) : null;
            setSelectedClienteId(clienteId);
          }
        }}
        onApplyFilters={updateQuery}
        onResetFilters={() => {
          setSelectedClienteId(null);
          resetQuery();
        }}
      />

      <DataTableContainer
        data={areas}
        columns={getAreasColumns({
          onViewDetail: handleViewDetail,
          onEdit: handleEdit,
          onToggleStatus: handleOpenToggleStatus,
        })}
        keyExtractor={(area) => area.id_area}
        isLoading={isLoading}
      />

      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />

      {/* MODAL DE ÁREA (CREAR / EDITAR) */}
      <AreaModal
        isOpen={isAreaModalOpen}
        onOpenChange={setIsAreaModalOpen}
        onSuccess={handleSuccessModal}
        areaToEdit={areaToEdit}
        clientes={clientes}
        sucursales={sucursales}
        onClienteChange={(clienteId) => {
          // Permite que el modal cargue dinámicamente las sucursales al seleccionar la empresa
          setSelectedClienteId(clienteId);
        }}
      />

      <ConfirmStatusModal
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        isActive={areaToToggle?.is_active ?? false}
        itemName={areaToToggle?.nombre_area}
        itemSubInfo={areaToToggle?.correo ?? undefined}
        itemBadge={areaToToggle?.sucursal?.nombre}
        description={`Al ${
          areaToToggle?.is_active ? "desactivar" : "activar"
        } esta área, se afectarán los reportes y tickets asociados a este departamento.`}
        isLoading={isTogglingStatus}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}

export default AreasPage;
