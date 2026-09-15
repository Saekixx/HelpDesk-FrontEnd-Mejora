import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { useSucursales } from "@/features/sucursales/hooks/useSucursal";
import { useSucursalMutations } from "@/features/sucursales/hooks/useSucursalMutations";

import { SucursalesFilters } from "@/features/sucursales/components/sucursales-filters";
import { SucursalesTable } from "@/features/sucursales/components/sucursales-table";
import { SucursalDetailsModal } from "@/features/sucursales/components/SucursalDetailsModal";
import { SucursalFormModal } from "@/features/sucursales/components/SucursalFormModal";
import { PaginationControls } from "@/components/ui/pagination-controls";

import { SucursalListItem } from "@/features/sucursales/types/sucursal.entity";
import { GetSucursalesFilterDto } from "@/features/sucursales/types/sucursal.dtos";

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

function SucursalPage() {
  const { sucursales, meta, loading, setPage, setFilterValues, refetch } =
    useSucursales();

  const { toggleStatus, isSubmitting } = useSucursalMutations({
    onSuccess: () => refetch(),
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [sucursalToEdit, setSucursalToEdit] = useState<SucursalListItem | null>(
    null,
  );

  const [selectedSucursalForDetails, setSelectedSucursalForDetails] =
    useState<SucursalListItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const [selectedSucursalForStatus, setSelectedSucursalForStatus] =
    useState<SucursalListItem | null>(null);

  const handleOpenCreateModal = () => {
    setSucursalToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (sucursal: SucursalListItem) => {
    setSucursalToEdit(sucursal);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSucursalToEdit(null);
  };

  const handleFormSuccess = () => {
    toast.success(
      `Sucursal ${sucursalToEdit ? "actualizada" : "creada"} con éxito`,
    );
    refetch();
  };

  const handleViewDetails = (sucursal: SucursalListItem) => {
    setSelectedSucursalForDetails(sucursal);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSucursalForDetails(null);
  };

  const handleApplyFilters = (filters: Partial<GetSucursalesFilterDto>) => {
    setFilterValues(filters);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedSucursalForStatus) return;
    const isActivating = !selectedSucursalForStatus.is_active;

    toast.promise(toggleStatus(selectedSucursalForStatus.id_sucursal), {
      loading: "Actualizando estado de la sucursal...",
      success: `Sucursal ${isActivating ? "activada" : "desactivada"} correctamente`,
      error: "Ocurrió un error al cambiar el estado de la sucursal",
    });

    setSelectedSucursalForStatus(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gestión de Sucursales
          </h1>
          <p className="text-sm text-gray-500">
            Administración de sedes, encargados y asignación de empresas
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Sucursal
        </Button>
      </div>

      <SucursalesFilters
        onApplyFilters={handleApplyFilters}
        onNewSucursal={handleOpenCreateModal}
      />

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 bg-white rounded-lg border border-gray-200">
          Cargando sucursales...
        </div>
      ) : (
        <div className="space-y-4">
          <SucursalesTable
            sucursales={sucursales}
            onViewDetails={handleViewDetails}
            onEdit={handleOpenEditModal}
            onToggleStatus={(sucursal) =>
              setSelectedSucursalForStatus(sucursal)
            }
          />

          <PaginationControls
            page={meta?.page ?? 1}
            lastPage={meta?.totalPages ?? 1}
            total={meta?.total ?? 0}
            limit={meta?.limit ?? 10}
            onPageChange={setPage}
          />
        </div>
      )}

      <SucursalFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        sucursalToEdit={sucursalToEdit}
        onSuccess={handleFormSuccess}
      />

      <SucursalDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        sucursal={selectedSucursalForDetails}
      />

      <AlertDialog
        open={!!selectedSucursalForStatus}
        onOpenChange={(open: boolean) =>
          !open && setSelectedSucursalForStatus(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedSucursalForStatus?.is_active
                ? "¿Desactivar sucursal?"
                : "¿Activar sucursal?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas{" "}
              {selectedSucursalForStatus?.is_active ? "desactivar" : "activar"}{" "}
              la sucursal{" "}
              <strong className="text-gray-900">
                {selectedSucursalForStatus?.nombre_sucursal}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleStatus}
              disabled={isSubmitting}
              className={
                selectedSucursalForStatus?.is_active
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SucursalPage;
