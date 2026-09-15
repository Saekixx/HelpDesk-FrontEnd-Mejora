import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Hooks
import { useClientes } from "@/features/clientes/hooks/useClientes";
import { useClienteMutations } from "@/features/clientes/hooks/useClienteMutations";

// Componentes
import { ClientesFilters } from "@/features/clientes/components/clientes-filters";
import { ClientesTable } from "@/features/clientes/components/clientes-table";
import { ClienteDetailsModal } from "@/features/clientes/components/ClienteDetailsModal";
import { PaginationControls } from "@/components/ui/pagination-controls";

// Tipos
import { Cliente } from "@/features/clientes/types/cliente.entity";
import { ClienteDetail } from "@/features/clientes/types/cliente.response";

// UI Dialogs
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ClientsPage = () => {
  const {
    clientes,
    meta,
    loading,
    setPage,
    setFilterValues,
    refetch,
    getClienteDetails,
  } = useClientes();

  const { toggleStatus, isSubmitting: isMutating } = useClienteMutations({
    onSuccess: () => refetch(),
  });

  // Estados para Modal de Creación / Edición
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);

  // Estado para el modal de confirmación de cambio de estado
  const [selectedClienteForStatus, setSelectedClienteForStatus] =
    useState<Cliente | null>(null);

  // Estados para el Modal de Detalles
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [selectedClienteDetail, setSelectedClienteDetail] =
    useState<ClienteDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Handlers para Creación / Edición
  const handleOpenCreateModal = () => {
    setClienteToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cliente: Cliente) => {
    setClienteToEdit(cliente);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setClienteToEdit(null);
  };

  const handleFormSuccess = () => {
    toast.success(
      `Empresa ${clienteToEdit ? "actualizada" : "creada"} con éxito`,
    );
    refetch();
  };

  // Abrir Modal de Detalles y cargar datos del backend (/clientes/{id})
  const handleViewDetails = async (cliente: Cliente) => {
    setIsDetailsOpen(true);
    setLoadingDetails(true);
    try {
      const detail = await getClienteDetails(cliente.id_cliente);
      setSelectedClienteDetail(detail);
    } catch (err) {
      toast.error("Error al obtener los detalles de la empresa");
      console.error("Error al obtener detalles del cliente:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsOpen(false);
    setSelectedClienteDetail(null);
  };

  // Confirmar el cambio de estado (Toggle Status)
  const handleConfirmToggleStatus = async () => {
    if (!selectedClienteForStatus) return;
    const isActivating = !selectedClienteForStatus.is_active;

    toast.promise(toggleStatus(selectedClienteForStatus.id_cliente), {
      loading: "Actualizando estado de la empresa...",
      success: `Empresa ${isActivating ? "activada" : "desactivada"} correctamente`,
      error: "Ocurrió un error al cambiar el estado de la empresa",
    });

    setSelectedClienteForStatus(null);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Encabezado con Botón Nueva Empresa / Cliente */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gestión de Clientes
          </h1>
          <p className="text-sm text-gray-500">
            Administración de clientes, empresas registradas, planes y contratos
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      {/* Filtros */}
      <ClientesFilters onApplyFilters={setFilterValues} />

      {/* Tabla y Paginación */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Cargando clientes...
        </div>
      ) : (
        <>
          <ClientesTable
            clientes={clientes}
            onViewDetails={handleViewDetails}
            onEdit={handleOpenEditModal}
            onToggleStatus={(cliente) => setSelectedClienteForStatus(cliente)}
          />
          <PaginationControls
            page={meta?.page ?? 1}
            lastPage={meta?.totalPages ?? 1}
            total={meta?.total ?? 0}
            limit={meta?.limit ?? 10}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Modal de Detalle de Cliente */}
      <ClienteDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetailsModal}
        cliente={selectedClienteDetail}
        loading={loadingDetails}
      />

      {/* Modal de confirmación para cambiar estado del cliente */}
      <AlertDialog
        open={!!selectedClienteForStatus}
        onOpenChange={(open: boolean) =>
          !open && setSelectedClienteForStatus(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedClienteForStatus?.is_active
                ? "¿Desactivar cliente?"
                : "¿Activar cliente?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas{" "}
              {selectedClienteForStatus?.is_active ? "desactivar" : "activar"} a{" "}
              <strong className="text-gray-900">
                {selectedClienteForStatus?.nombre_principal}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleStatus}
              disabled={isMutating}
              className={
                selectedClienteForStatus?.is_active
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {isMutating ? "Procesando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;
