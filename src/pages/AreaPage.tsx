import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { useAreas } from "@/features/areas/hooks/useArea";
import { useAreaMutations } from "@/features/areas/hooks/useAreaMutations";

import { AreasFilters } from "@/features/areas/components/areas-filters";
import { AreasTable } from "@/features/areas/components/areas-table";
import { AreaDetailsModal } from "@/features/areas/components/AreaDetailsModal";
import { AreaFormModal } from "@/features/areas/components/AreaFormModal";
import { PaginationControls } from "@/components/ui/pagination-controls";

import { AreaListItem } from "@/features/areas/types/areas.entity";
import { GetAreasFilterDto } from "@/features/areas/types/areas.dtos";

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

function AreaPage() {
  const { areas, meta, loading, setPage, setFilterValues, refetch } =
    useAreas();

  const { toggleStatus, isSubmitting } = useAreaMutations({
    onSuccess: () => refetch(),
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [areaToEdit, setAreaToEdit] = useState<AreaListItem | null>(null);

  const [selectedAreaForDetails, setSelectedAreaForDetails] =
    useState<AreaListItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const [selectedAreaForStatus, setSelectedAreaForStatus] =
    useState<AreaListItem | null>(null);

  const handleOpenCreateModal = () => {
    setAreaToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (area: AreaListItem) => {
    setAreaToEdit(area);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setAreaToEdit(null);
  };

  const handleFormSuccess = () => {
    toast.success(`Área ${areaToEdit ? "actualizada" : "creada"} con éxito`);
    refetch();
  };

  const handleViewDetails = (area: AreaListItem) => {
    setSelectedAreaForDetails(area);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedAreaForDetails(null);
  };

  const handleApplyFilters = (filters: Partial<GetAreasFilterDto>) => {
    setFilterValues(filters);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedAreaForStatus) return;
    const isActivating = !selectedAreaForStatus.is_active;

    toast.promise(toggleStatus(selectedAreaForStatus.id_area), {
      loading: "Actualizando estado del área...",
      success: `Área ${isActivating ? "activada" : "desactivada"} correctamente`,
      error: "Ocurrió un error al cambiar el estado del área",
    });

    setSelectedAreaForStatus(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gestión de Áreas
          </h1>
          <p className="text-sm text-gray-500">
            Organización de departamentos, responsables y asignación por sede
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Área
        </Button>
      </div>

      <AreasFilters onApplyFilters={handleApplyFilters} />

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 bg-white rounded-lg border border-gray-200">
          Cargando áreas...
        </div>
      ) : (
        <div className="space-y-4">
          <AreasTable
            areas={areas}
            onViewDetails={handleViewDetails}
            onEdit={handleOpenEditModal}
            onToggleStatus={(area) => setSelectedAreaForStatus(area)}
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

      <AreaFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        areaToEdit={areaToEdit}
        onSuccess={handleFormSuccess}
      />

      <AreaDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        area={selectedAreaForDetails}
      />

      <AlertDialog
        open={!!selectedAreaForStatus}
        onOpenChange={(open: boolean) =>
          !open && setSelectedAreaForStatus(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedAreaForStatus?.is_active
                ? "¿Desactivar área?"
                : "¿Activar área?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas{" "}
              {selectedAreaForStatus?.is_active ? "desactivar" : "activar"} el
              área{" "}
              <strong className="text-gray-900">
                {selectedAreaForStatus?.nombre_area}
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
                selectedAreaForStatus?.is_active
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

export default AreaPage;
