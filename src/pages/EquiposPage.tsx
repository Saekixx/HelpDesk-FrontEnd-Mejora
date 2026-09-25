/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui/pagination-controls";
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
import { useEquipos } from "@/features/equipos/hooks/useEquipos";
import { EquipoListItem } from "@/features/equipos/types/equipo.entity";
import { useEquipoMutations } from "@/features/equipos/hooks/useEquipoMutations";
import { EquiposFilters } from "@/features/equipos/components/equipos-filters";
import { EquiposTable } from "@/features/equipos/components/equipos-table";

const EquiposPage = () => {
  const { equipos, meta, loading, setPage, setFilterValues, refetch } =
    useEquipos();
  const { toggleStatus, loading: isMutating } = useEquipoMutations(refetch);

  const [selectedEquipoForStatus, setSelectedEquipoForStatus] =
    useState<EquipoListItem | null>(null);

  const handleOpenCreateModal = () => {
    // Abrir modal de creación
  };

  const handleOpenEditModal = (equipo: EquipoListItem) => {
    // Abrir modal de edición
  };

  const handleViewDetail = (equipo: EquipoListItem) => {
    // Lógica para ver detalle (ej: router.push(`/equipos/${equipo.id_equipo}`) o abrir modal)
    console.log("Ver detalle del equipo:", equipo);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedEquipoForStatus) return;
    try {
      await toggleStatus(selectedEquipoForStatus.id_equipo);
      setSelectedEquipoForStatus(null);
    } catch {
      // Manejado desde toast
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gestión de Equipos
          </h1>
          <p className="text-sm text-gray-500">
            Monitoreo, inventario y asignación de equipos informáticos
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Equipo
        </Button>
      </div>

      <EquiposFilters onApplyFilters={setFilterValues} />

      {loading ? (
        <div className="p-8 text-center text-gray-500">Cargando equipos...</div>
      ) : (
        <>
          <EquiposTable
            equipos={equipos}
            onEdit={handleOpenEditModal}
            onViewDetail={handleViewDetail}
            onToggleStatus={(equipo) => setSelectedEquipoForStatus(equipo)}
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

      <AlertDialog
        open={!!selectedEquipoForStatus}
        onOpenChange={(open: boolean) =>
          !open && setSelectedEquipoForStatus(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedEquipoForStatus?.is_active
                ? "¿Desactivar equipo?"
                : "¿Activar equipo?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas{" "}
              {selectedEquipoForStatus?.is_active ? "desactivar" : "activar"} el
              equipo{" "}
              <strong className="text-gray-900">
                {selectedEquipoForStatus?.marca} {selectedEquipoForStatus?.tipo}{" "}
                ({selectedEquipoForStatus?.num_serie})
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
                selectedEquipoForStatus?.is_active
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

export default EquiposPage;
