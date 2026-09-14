import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSucursales } from "@/features/sucursales/hooks/useSucursal";
import { sucursalService } from "@/features/sucursales/services/sucursales.service";
import { SucursalesFilters } from "@/features/sucursales/components/sucursales-filters";
import { SucursalesTable } from "@/features/sucursales/components/sucursales-table";
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
  // Importamos y desestructuramos exactamente igual que en ClientesPage
  const { sucursales, meta, loading, setPage, setFilterValues, refetch } =
    useSucursales();

  // Estado para el modal de confirmación de cambio de estado
  const [selectedSucursalForStatus, setSelectedSucursalForStatus] =
    useState<SucursalListItem | null>(null);

  // Handlers para abrir modales y acciones
  const handleOpenCreateModal = () => {
    // Modal de creación de sucursal
  };

  const handleOpenEditModal = (sucursal: SucursalListItem) => {
    // Modal de edición de sucursal
  };

  const handleViewDetails = (sucursal: SucursalListItem) => {
    // Detalle de la sucursal
  };

  const handleApplyFilters = (filters: Partial<GetSucursalesFilterDto>) => {
    setFilterValues(filters);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedSucursalForStatus) return;
    try {
      // Llamar al método de toggle status correspondiente del service u hook de mutaciones
      setSelectedSucursalForStatus(null);
      refetch();
    } catch (error) {
      console.error("Error al cambiar el estado de la sucursal:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
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

      {/* Barra de Filtros */}
      <SucursalesFilters
        onApplyFilters={handleApplyFilters}
        onNewSucursal={handleOpenCreateModal}
      />

      {/* Tabla y Paginación */}
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

      {/* Modal de confirmación para activar/desactivar */}
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleStatus}
              className={
                selectedSucursalForStatus?.is_active
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

export default SucursalPage;
