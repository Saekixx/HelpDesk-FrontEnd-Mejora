import { useState } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { useClientes } from "@/hooks/cliente/useClientes";
import { useClienteMutations } from "@/hooks/cliente/useClienteMutations";
import { useClienteDetail } from "@/hooks/cliente/useClientes";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import {
  Building2,
  Building,
  UserCheck,
  ShieldAlert,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ClienteListItem, ClienteDetail } from "@/types/cliente/cliente.types";
import { toast } from "sonner";
import { getClientesColumns } from "../components/cliente/ClientesColumns";
import { ClienteModal } from "@/components/cliente/ClienteModal";
import { ClienteDetailModal } from "@/components/cliente/ClienteDetailModal";
import { ConfirmStatusModal } from "@/components/ConfirmStatusModal";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";

function ClientesPage() {
  const {
    clientes,
    meta,
    isLoading,
    queryParams,
    limit,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch,
  } = useClientes();

  const { planes } = useCatalogOptions();

  // Hook de mutaciones para conectar el backend
  const { toggleClienteStatus, isSubmitting: isTogglingStatus } =
    useClienteMutations();

  // Estados para controlar el modal de Creación / Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClienteToEdit, setSelectedClienteToEdit] =
    useState<ClienteDetail | null>(null);

  // Estados para controlar el modal de VISTA DE DETALLE
  const [detailClienteId, setDetailClienteId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { cliente: clienteDetail, isLoading: isLoadingDetail } =
    useClienteDetail(detailClienteId);

  // Estados para controlar el MODAL DE CONFIRMACIÓN DE ESTADO
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);
  const [clienteToToggle, setClienteToToggle] =
    useState<ClienteListItem | null>(null);

  // Abrir modal para CREAR (pasando null)
  const handleOpenCreate = () => {
    setSelectedClienteToEdit(null);
    setIsModalOpen(true);
  };

  // Manejar vista de detalle corporativo
  const handleViewDetail = (cliente: ClienteListItem) => {
    setDetailClienteId(cliente.id_cliente);
    setIsDetailOpen(true);
  };

  // Abrir modal para EDITAR
  const handleEdit = (cliente: ClienteListItem) => {
    setSelectedClienteToEdit({
      id_cliente: cliente.id_cliente,
      tipo_cliente: cliente.tipo_cliente,
      numero_documento: cliente.numero_documento,
      nombre_principal: cliente.nombre_principal,
      rubro: cliente.rubro,
      id_plan:
        typeof cliente.planSoporte === "object" && cliente.planSoporte !== null
          ? (cliente.planSoporte as any).id_plan
          : 1,
      is_active: cliente.is_active,
    } as ClienteDetail);

    setIsModalOpen(true);
  };

  // Paso 1: Abrir modal de confirmación para cambiar estado
  const handleOpenToggleStatus = (cliente: ClienteListItem) => {
    setClienteToToggle(cliente);
    setIsConfirmStatusOpen(true);
  };

  // Paso 2: Confirmar y ejecutar la mutación de estado
  const handleConfirmToggleStatus = async () => {
    if (!clienteToToggle) return;
    try {
      const message = await toggleClienteStatus(clienteToToggle.id_cliente);
      toast.success(message || "Estado del cliente actualizado correctamente");
      setIsConfirmStatusOpen(false);
      setClienteToToggle(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar el estado del cliente");
    }
  };

  // Callback cuando la creación o edición es exitosa desde el modal/form
  const handleSuccess = () => {
    toast.success(
      selectedClienteToEdit
        ? "Cliente actualizado con éxito"
        : "Empresa registrada con éxito",
    );
    refetch(); // Recargamos la tabla automáticamente
  };

  // Determinar si el cliente seleccionado está activo
  const isClienteActive =
    clienteToToggle?.is_active === true ||
    (clienteToToggle?.estado as any) === 1 ||
    (clienteToToggle?.estado as any) === "1" ||
    String(clienteToToggle?.estado).toLowerCase() === "activo";

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* 1. CABECERA */}
      <PageHeader
        category="MÓDULOS DE GESTIÓN > DIRECTORIO CORPORATIVO"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión de Clientes</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ff5722] border border-orange-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              {meta.total} Clientes Registrados
            </span>
          </div>
        }
        description="Directorio corporativo, control de contratos, sucursales y cuentas de enlace principal."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </div>
        }
      />

      {/* 2. MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL CLIENTES"
          value={String(meta.total)}
          icon={<Building2 className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="CLIENTES JURÍDICOS"
          value={String(
            clientes.filter((c) => c.tipo_cliente === "JURIDICA").length,
          )}
          icon={<Building className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="CLIENTES NATURALES"
          value={String(
            clientes.filter((c) => c.tipo_cliente === "NATURAL").length,
          )}
          icon={<UserCheck className="h-5 w-5 text-purple-600" />}
          iconContainerClassName="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="PLANES ACTIVOS"
          value={String(clientes.filter((c) => c.is_active).length)}
          icon={<ShieldAlert className="h-5 w-5 text-amber-600" />}
          iconContainerClassName="bg-amber-50 text-amber-600"
        />
      </div>

      {/* 3. FILTROS */}
      <TableFiltersBar
        searchPlaceholder="Buscar por nombre, RUC/DNI o correo corporativo..."
        dropdowns={[
          {
            key: "tipo_cliente",
            placeholder: "Tipo: Todos",
            options: [
              { label: "Jurídica", value: "JURIDICA" },
              { label: "Natural", value: "NATURAL" },
            ],
          },
          {
            key: "estado",
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
        data={clientes}
        columns={getClientesColumns({
          onViewDetail: handleViewDetail,
          onEdit: handleEdit,
          onToggleStatus: handleOpenToggleStatus,
        })}
        keyExtractor={(cli) => cli.id_cliente}
        isLoading={isLoading}
      />

      {/* 5. PAGINACIÓN */}
      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />

      {/* 6. MODAL DE CREACIÓN / EDICIÓN */}
      <ClienteModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        clienteToEdit={selectedClienteToEdit}
        onSuccess={handleSuccess}
        planes={planes}
      />

      {/* 7. MODAL DE VISTA DETALLE CORPORATIVO */}
      <ClienteDetailModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        cliente={clienteDetail}
        isLoading={isLoadingDetail}
      />

      {/* 8. MODAL DE CONFIRMACIÓN DE CAMBIO DE ESTADO */}
      <ConfirmStatusModal
        isOpen={isConfirmStatusOpen}
        onOpenChange={setIsConfirmStatusOpen}
        isActive={isClienteActive}
        itemName={clienteToToggle?.nombre_principal}
        itemSubInfo={`RUC/DOC: ${clienteToToggle?.numero_documento || "N/A"}`}
        itemBadge={clienteToToggle?.tipo_cliente}
        description={
          isClienteActive
            ? "Al desactivar este cliente, se restringirá temporalmente el acceso y la gestión de sus sucursales en el sistema."
            : "Al activar este cliente, se restablecerán los permisos y accesos operativos correspondientes."
        }
        isLoading={isTogglingStatus}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}

export default ClientesPage;
