/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/features/planes/components/PlanCard";
import { PlanModal } from "@/features/planes/components/PlanModal";
import { usePlanes } from "@/features/planes/hooks/usePlanes";
import { Plan, CreatePlanDto } from "@/features/planes/types/planes.types";
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

function PlanesPages() {
  const { planes, loading, error, toggleStatus, createPlan, updatePlan } =
    usePlanes();

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<Plan | null>(
    null,
  );
  const [selectedPlanForStatus, setSelectedPlanForStatus] =
    useState<Plan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers para abrir modal de creación/edición
  const handleCreate = () => {
    setSelectedPlanForEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlanForEdit(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlanForEdit(null);
  };

  // Submit del formulario (Crear o Editar con Toast notifications)
  const handleSubmitPlan = async (data: CreatePlanDto) => {
    try {
      setIsSubmitting(true);
      if (selectedPlanForEdit) {
        await updatePlan(selectedPlanForEdit.id_plan, data);
        toast.success("Plan actualizado correctamente");
      } else {
        await createPlan(data);
        toast.success("Plan creado correctamente");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error al guardar el plan:", err);
      toast.error(
        err?.response?.data?.message || "Ocurrió un error al guardar el plan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cambiar estado activo/inactivo con Toast notification
  const handleConfirmToggleStatus = async () => {
    if (!selectedPlanForStatus) return;
    try {
      const message = await toggleStatus(selectedPlanForStatus.id_plan);
      toast.success(message || "Estado del plan actualizado correctamente");
      setSelectedPlanForStatus(null);
    } catch (err: any) {
      console.error("Error al cambiar estado:", err);
      toast.error(
        err?.response?.data?.message || "No se pudo cambiar el estado del plan",
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado general */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Planes
          </h1>
          <p className="text-sm text-gray-500">
            Catálogo de planes de servicio ofrecidos a los clientes.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      {/* Estados de Carga y Error */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Cargando planes...</div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-rose-50 text-rose-600 text-sm">
          {error}
        </div>
      ) : (
        /* Grid de Tarjetas con Rendering Seguro */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(planes) && planes.length > 0 ? (
            planes.map(
              (plan) =>
                plan && (
                  <PlanCard
                    key={plan.id_plan}
                    plan={plan}
                    onEdit={handleEdit}
                    onToggleStatus={() => setSelectedPlanForStatus(plan)}
                  />
                ),
            )
          ) : (
            <div className="col-span-full text-center text-gray-500 py-6">
              No hay planes disponibles.
            </div>
          )}
        </div>
      )}

      {/* Modal de Creación / Edición */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPlan}
        planToEdit={selectedPlanForEdit}
        isLoading={isSubmitting}
      />

      {/* Modal de confirmación para cambiar estado */}
      <AlertDialog
        open={!!selectedPlanForStatus}
        onOpenChange={(open: boolean) =>
          !open && setSelectedPlanForStatus(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPlanForStatus?.is_active
                ? "¿Desactivar plan?"
                : "¿Activar plan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas{" "}
              {selectedPlanForStatus?.is_active ? "desactivar" : "activar"} el
              plan{" "}
              <strong className="text-gray-900">
                {selectedPlanForStatus?.tipo}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleStatus}
              className={
                selectedPlanForStatus?.is_active
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

export default PlanesPages;
