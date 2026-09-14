import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAreas } from "@/features/areas/hooks/useArea";
import { areaService } from "@/features/areas/services/areas.service";
import { AreasFilters } from "@/features/areas/components/areas-filters";
import { AreasTable } from "@/features/areas/components/areas-table";
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

  // Estado para el modal de confirmación de cambio de estado
  const [selectedAreaForStatus, setSelectedAreaForStatus] =
    useState<AreaListItem | null>(null);

  // Handlers para abrir modales y acciones
  const handleOpenCreateModal = () => {
    // Modal de creación de área
  };

  const handleOpenEditModal = (area: AreaListItem) => {
    // Modal de edición de área
  };

  const handleViewDetails = (area: AreaListItem) => {
    // Detalle del área
  };

  const handleApplyFilters = (filters: Partial<GetAreasFilterDto>) => {
    setFilterValues(filters);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedAreaForStatus) return;
    try {
      // Llamar al método de toggle status correspondiente del service u hook de mutaciones
      setSelectedAreaForStatus(null);
      refetch();
    } catch (error) {
      console.error("Error al cambiar el estado del área:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
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

      {/* Barra de Filtros */}
      <AreasFilters onApplyFilters={handleApplyFilters} />

      {/* Tabla y Paginación */}
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

      {/* Modal de confirmación para activar/desactivar */}
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleStatus}
              className={
                selectedAreaForStatus?.is_active
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AreaPage;
