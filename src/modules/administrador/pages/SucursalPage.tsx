import { useState } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { useSucursales } from "@/hooks/sucursal/useSucursales";
import { useSucursalMutations } from "@/hooks/sucursal/useSucursalMutations";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import {
  Building2,
  Building,
  ShieldCheck,
  MapPinned,
  Plus,
  Download,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { SucursalListItem } from "@/types/sucursal/sucursal.types";
import { toast } from "sonner";
import { getSucursalesColumns } from "../components/sucursal/SucursalesColumns";
import { ConfirmStatusModal } from "@/components/ConfirmStatusModal";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { SucursalModal } from "@/components/sucursal/SucursalModal";

function SucursalesPage() {
  const {
    sucursales,
    meta,
    isLoading,
    queryParams,
    limit,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch,
  } = useSucursales();

  // Obtenemos el listado de clientes para poblar el filtro desplegable y el select del formulario
  const { clientes } = useCatalogOptions();

  const { toggleSucursalStatus, isSubmitting: isTogglingStatus } =
    useSucursalMutations();

  // Estados para los modales
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [sucursalToToggle, setSucursalToToggle] =
    useState<SucursalListItem | null>(null);

  // Estados para el Modal de Crear / Editar Sucursal
  const [isSucursalModalOpen, setIsSucursalModalOpen] = useState(false);
  const [sucursalToEdit, setSucursalToEdit] = useState<any | null>(null);

  const handleOpenCreate = () => {
    setSucursalToEdit(null);
    setIsSucursalModalOpen(true);
  };

  const handleViewDetail = (sucursal: SucursalListItem) => {
    toast.info(`Ver detalle de sede: ${sucursal.nombre_sucursal}`);
  };

  const handleEdit = (sucursal: SucursalListItem) => {
    setSucursalToEdit(sucursal);
    setIsSucursalModalOpen(true);
  };

  const handleSuccessModal = () => {
    toast.success(
      sucursalToEdit
        ? "Sucursal actualizada correctamente"
        : "Sucursal y cuenta creadas correctamente",
    );
    refetch();
  };

  const handleOpenToggleStatus = (sucursal: SucursalListItem) => {
    setSucursalToToggle(sucursal);
    setIsStatusModalOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!sucursalToToggle) return;
    try {
      const mensaje = await toggleSucursalStatus(sucursalToToggle.id_sucursal);
      toast.success(
        mensaje || "Estado de la sucursal actualizado correctamente",
      );
      setIsStatusModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al cambiar el estado.");
    }
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* 1. CABECERA */}
      <PageHeader
        category="MÓDULOS DE GESTIÓN > INFRAESTRUCTURA"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión de Sucursales</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ff5722] border border-orange-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              {meta.total} Sucursales Registradas
            </span>
          </div>
        }
        description="Administración de sedes, encargados locales y asignación de empresas cliente."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold h-10 px-4 rounded-xl shadow-xs cursor-pointer text-xs"
              onClick={() => toast.info("Exportación CSV en desarrollo...")}
            >
              <Download className="mr-2 h-4 w-4 text-slate-500" />
              Exportar Sedes (CSV)
            </Button>

            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Sucursal
            </Button>
          </div>
        }
      />

      {/* 2. MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL SUCURSALES"
          value={String(meta.total)}
          icon={<Building2 className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="SEDES PRINCIPALES"
          value="14"
          icon={<Building className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="SUCURSALES OPERATIVAS"
          value="22"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="ÁREAS COBERTURADAS"
          value="68"
          icon={<MapPinned className="h-5 w-5 text-purple-600" />}
          iconContainerClassName="bg-purple-50 text-purple-600"
        />
      </div>

      {/* 3. FILTROS */}
      <TableFiltersBar
        searchPlaceholder="Buscar por sucursal, dirección o encargado..."
        dropdowns={[
          {
            key: "id_cliente",
            placeholder: "Empresa: Todas",
            options: clientes,
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
        onApplyFilters={updateQuery}
        onResetFilters={resetQuery}
      />

      {/* 4. TABLA */}
      <DataTableContainer
        data={sucursales}
        columns={getSucursalesColumns({
          onViewDetail: handleViewDetail,
          onEdit: handleEdit,
          onToggleStatus: handleOpenToggleStatus,
        })}
        keyExtractor={(suc) => suc.id_sucursal}
        isLoading={isLoading}
      />

      {/* 5. PAGINACIÓN */}
      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />

      {/* MODAL DE SUCURSAL (CREAR / EDITAR) */}
      <SucursalModal
        isOpen={isSucursalModalOpen}
        onOpenChange={setIsSucursalModalOpen}
        onSuccess={handleSuccessModal}
        sucursalToEdit={sucursalToEdit}
        clientes={clientes}
      />

      {/* MODAL DE CONFIRMACIÓN DE ESTADO */}
      <ConfirmStatusModal
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        isActive={sucursalToToggle?.is_active ?? false}
        itemName={sucursalToToggle?.nombre_sucursal}
        itemSubInfo={sucursalToToggle?.direccion ?? undefined}
        itemBadge={sucursalToToggle?.cliente_empresa?.nombre}
        description={`Al ${
          sucursalToToggle?.is_active ? "desactivar" : "activar"
        } esta sucursal, se restringirán las operaciones y asignaciones vinculadas a esta sede.`}
        isLoading={isTogglingStatus}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}

export default SucursalesPage;
