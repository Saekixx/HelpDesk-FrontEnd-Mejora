import { useState } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { useClientes } from "@/hooks/cliente/useClientes";
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
  } = useClientes();

  // Estados para controlar el modal de Creación / Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClienteToEdit, setSelectedClienteToEdit] =
    useState<ClienteDetail | null>(null);

  // Abrir modal para CREAR (pasando null)
  const handleOpenCreate = () => {
    setSelectedClienteToEdit(null);
    setIsModalOpen(true);
  };

  const handleViewDetail = (cliente: ClienteListItem) => {
    toast.info(`Ver detalle corporativo de: ${cliente.nombre_principal}`);
  };

  // Abrir modal para EDITAR (pasando el cliente seleccionado)
  // Nota: Si tu tabla devuelve un ClienteListItem y el modal espera ClienteDetail,
  // puedes hacer un cast o buscar el detalle si es necesario.
  const handleEdit = (cliente: ClienteListItem) => {
    // Convertimos temporalmente el ListItem al formato que requiere el modal de edición
    setSelectedClienteToEdit({
      id_cliente: cliente.id_cliente,
      tipo_cliente: cliente.tipo_cliente,
      numero_documento: cliente.numero_documento,
      nombre_principal: cliente.nombre_principal,
      rubro: cliente.rubro,
      id_plan: 1, // Ajusta según corresponda o mapea desde tu lista
      is_active: cliente.estado === "activo",
    } as ClienteDetail);

    setIsModalOpen(true);
  };

  const handleToggleStatus = (cliente: ClienteListItem) => {
    toast.info(`Cambiar estado de enlace para: ${cliente.nombre_principal}`);
  };

  // Callback cuando la creación o edición es exitosa
  const handleSuccess = () => {
    toast.success(
      selectedClienteToEdit
        ? "Cliente actualizado con éxito"
        : "Empresa registrada con éxito",
    );
    // Aquí puedes llamar a tu función de refetch de la tabla si la tienes en el hook useClientes
  };

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
            {/* BOTÓN NUEVA EMPRESA */}
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
          value="18"
          icon={<Building2 className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="CLIENTES JURÍDICOS"
          value="14"
          icon={<Building className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="CLIENTES NATURALES"
          value="4"
          icon={<UserCheck className="h-5 w-5 text-purple-600" />}
          iconContainerClassName="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="PLANES ENTERPRISE"
          value="12"
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
          onToggleStatus: handleToggleStatus,
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
        planes={[
          { label: "Enterprise SLA 24/7 (Alta Prioridad)", value: 1 },
          { label: "Soporte Estándar 8x5", value: 2 },
        ]}
      />
    </div>
  );
}

export default ClientesPage;
