import { PlanItem } from "@/types/planes/plan.types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Edit2 } from "lucide-react";

interface PlanCardProps {
  plan: PlanItem;
  onEdit: (plan: PlanItem) => void;
  onToggleStatus: (plan: PlanItem) => void;
  isToggling?: boolean;
}

export const PlanCard = ({
  plan,
  onEdit,
  onToggleStatus,
  isToggling,
}: PlanCardProps) => {
  // Forzamos explícitamente a booleano asegurándonos de leer la propiedad del plan
  const isChecked = Boolean(plan.is_active);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 transition-all duration-300 flex flex-col justify-between p-6 shadow-sm hover:shadow-md">
      <div>
        {/* Cabecera de Estado */}
        <div className="flex items-center justify-end mb-4">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isChecked
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            {isChecked ? "● Activo" : "● Inactivo"}
          </span>
        </div>

        {/* Título y Descripción */}
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">
          {plan.tipo}
        </h3>
        <p className="text-slate-500 text-xs mb-6 min-h-[32px]">
          Cobertura y soporte especializado para operaciones corporativas.
        </p>

        {/* Precio */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">
              S/{Number(plan.precio).toFixed(2)}
            </span>
            <span className="text-slate-400 text-xs font-medium">/ mes</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50/60 text-orange-800 text-xs font-semibold border border-orange-100">
            <span>Límite: Hasta {plan.limite_equipos} equipos incluidos</span>
          </div>
        </div>

        {/* Servicios Incluidos */}
        <div className="space-y-3 mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Servicios Incluidos
          </p>
          <ul className="space-y-2.5">
            {plan.servicio?.map((serv, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-xs text-slate-700 font-medium"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>{serv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pie de la Tarjeta */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={isChecked}
            onCheckedChange={() => onToggleStatus(plan)}
            disabled={isToggling}
            className="cursor-pointer"
            style={{
              backgroundColor: isChecked ? "#ff5722" : "#e2e8f0",
            }}
          />
          <span className="text-xs font-bold text-slate-700">
            {isChecked ? "Activo" : "Inactivo"}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer h-9 px-3 rounded-xl"
          onClick={() => onEdit(plan)}
        >
          <Edit2 className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
          Editar Plan
        </Button>
      </div>
    </div>
  );
};
