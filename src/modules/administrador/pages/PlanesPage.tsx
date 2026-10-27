import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { ConfirmStatusModal } from "@/components/ConfirmStatusModal";
import {
  HardDrive,
  Award,
  CheckCircle2,
  PauseCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { usePlanes } from "@/hooks/planes/usePlanes";
import { usePlanMutations } from "@/hooks/planes/usePlanMutations";
import { PlanItem } from "@/types/planes/plan.types";
import { PlanRequest } from "@/types/planes/plan.request.type";
import { PlanCard } from "../components/planes/PlanCard";
import { PlanModal } from "../components/planes/PlanModal";

function PlanesPage() {
  // 1. Hook de Consultas (Lectura)
  const { planes, isLoading, refetch } = usePlanes();

  // 2. Hook de Mutaciones (Escritura / Crear / Editar / Cambio de estado)
  const {
    crearPlan,
    actualizarPlan,
    togglePlanStatus,
    isSubmitting: isMutating,
  } = usePlanMutations();

  // Estados para el modal de formulario (Crear / Editar)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPlanToEdit, setSelectedPlanToEdit] = useState<PlanItem | null>(
    null,
  );

  // Estados para el modal de confirmación de estado
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [planToToggle, setPlanToToggle] = useState<PlanItem | null>(null);

  // Cálculos dinámicos para las métricas
  const totalActivos = planes.filter((p) => p.is_active).length;
  const totalInactivos = planes.filter((p) => !p.is_active).length;

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setSelectedPlanToEdit(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (plan: PlanItem) => {
    setSelectedPlanToEdit(plan);
    setIsFormModalOpen(true);
  };

  // Guardar plan (Crear o Editar según corresponda)
  const handleSavePlan = async (data: PlanRequest, id?: number) => {
    try {
      if (id) {
        await actualizarPlan(id, data);
        toast.success("Plan de soporte actualizado correctamente");
      } else {
        await crearPlan(data);
        toast.success("Nuevo plan de soporte creado correctamente");
      }
      setIsFormModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al guardar el plan.");
    }
  };

  // Abrir modal de confirmación de estado
  const handleOpenToggleStatus = (plan: PlanItem) => {
    setPlanToToggle(plan);
    setIsStatusModalOpen(true);
  };

  // Confirmar cambio de estado
  const handleConfirmToggleStatus = async () => {
    if (!planToToggle) return;
    try {
      const mensaje = await togglePlanStatus(planToToggle.id_plan);
      toast.success(mensaje || "Estado del plan actualizado exitosamente");
      setIsStatusModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al cambiar el estado.");
    }
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-6">
      {/* 1. CABECERA */}
      <PageHeader
        category="MÓDULOS DE GESTIÓN > OFERTAS COMERCIALES"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión de Planes de Soporte</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ff5722] border border-orange-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              {totalActivos} Planes Activos
            </span>
          </div>
        }
        description="Configura las ofertas comerciales, límites de equipos y servicios incluidos por tipo de suscripción."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Plan
            </Button>
          </div>
        }
      />

      {/* 2. MÉTRICAS ESTÁNDAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="SUSCRIPCIONES TOTALES"
          value="142 Clientes"
          icon={<Award className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="EQUIPOS PROTEGIDOS"
          value="1,294 Dispositivos"
          icon={<HardDrive className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="PLANES ACTIVOS"
          value={`${totalActivos} Planes`}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="PLANES INACTIVOS"
          value={`${totalInactivos} Desactivados`}
          icon={<PauseCircle className="h-5 w-5 text-slate-600" />}
          iconContainerClassName="bg-slate-100 text-slate-600"
        />
      </div>

      {/* 3. GRID DE TARJETAS DE PLANES */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 font-medium">
          Cargando planes de soporte...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <PlanCard
              key={plan.id_plan}
              plan={plan}
              onEdit={handleEdit}
              onToggleStatus={handleOpenToggleStatus}
              isToggling={isMutating}
            />
          ))}
        </div>
      )}

      {/* MODAL FORMULARIO DE CREAR / EDITAR */}
      <PlanModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSavePlan}
        planToEdit={selectedPlanToEdit}
        isLoading={isMutating}
      />

      {/* MODAL DE CONFIRMACIÓN DE ESTADO */}
      <ConfirmStatusModal
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        isActive={planToToggle?.is_active ?? false}
        itemName={planToToggle?.tipo}
        itemSubInfo={`Precio: S/${planToToggle?.precio}`}
        itemBadge={`Límite: ${planToToggle?.limite_equipos} equipos`}
        description={`Al ${
          planToToggle?.is_active ? "desactivar" : "activar"
        } este plan de soporte, se restringirá su selección para nuevas asignaciones de clientes o empresas.`}
        isLoading={isMutating}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}

export default PlanesPage;
