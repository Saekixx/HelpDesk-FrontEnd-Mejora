import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planSchema, PlanFormValues } from "../schemas/plan.schema";
import { Plan } from "../types/planes.types";
import { PlanFormField } from "./PlanFormField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Omitimos los campos autogenerados por el backend
  onSubmit: (
    data: Omit<Plan, "id_plan" | "is_active" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  planToEdit?: Plan | null;
  isLoading?: boolean;
}

export const PlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  planToEdit,
  isLoading = false,
}: PlanModalProps) => {
  const isEditing = !!planToEdit;

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      numero_plan: 0,
      tipo: "",
      precio: 0,
      limite_equipos: 0,
      servicio: [{ value: "" }],
    },
  });

  useEffect(() => {
    if (planToEdit) {
      form.reset({
        numero_plan: planToEdit.numero_plan,
        tipo: planToEdit.tipo,
        precio: planToEdit.precio,
        limite_equipos: planToEdit.limite_equipos ?? 0,
        servicio: planToEdit.servicio.map((s) => ({ value: s })),
      });
    } else {
      form.reset({
        numero_plan: 0,
        tipo: "",
        precio: 0,
        limite_equipos: 0,
        servicio: [{ value: "" }],
      });
    }
  }, [planToEdit, isOpen, form]);

  const handleSubmit = async (values: PlanFormValues) => {
    const payload: Omit<
      Plan,
      "id_plan" | "is_active" | "createdAt" | "updatedAt"
    > = {
      numero_plan: values.numero_plan,
      tipo: values.tipo,
      precio: values.precio,
      limite_equipos: values.limite_equipos,
      servicio: values.servicio.map((s) => s.value),
    };

    await onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEditing ? "Editar plan" : "Nuevo plan"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <PlanFormField form={form} />

            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium"
              >
                {isLoading
                  ? "Guardando..."
                  : isEditing
                    ? "Guardar cambios"
                    : "Crear plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
