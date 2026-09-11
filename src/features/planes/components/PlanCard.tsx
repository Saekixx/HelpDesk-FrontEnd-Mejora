import React from "react";
import { Plan } from "../types/planes.types";
import { DollarSign, CheckCircle2, Edit3, Power, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onToggleStatus: (id: number) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onEdit,
  onToggleStatus,
}) => {
  const formattedPrice = new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(plan.precio);

  return (
    <Card
      className={`relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all ${
        !plan.is_active ? "opacity-75 bg-gray-50/50" : "hover:shadow-md"
      }`}
    >
      <div className="space-y-6">
        {/* Cabecera del Card */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {plan.tipo}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Plan #{String(plan.numero_plan).padStart(3, "0")}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`px-2.5 py-0.5 rounded-full text-xs font-normal border ${
              plan.is_active
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {plan.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        {/* Precio y Límite de Equipos */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-900">
              S/ {formattedPrice}
            </span>
            <span className="text-sm text-gray-500 font-normal">/mes</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {plan.limite_equipos > 0
              ? `Hasta ${plan.limite_equipos} equipos`
              : "Equipos ilimitados"}
          </p>
        </div>

        {/* Lista de Servicios */}
        <ul className="space-y-3">
          {plan.servicio.map((item, index) => (
            <li
              key={index}
              className={`flex items-start gap-2.5 text-sm ${
                plan.is_active ? "text-gray-600" : "text-gray-400"
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 mt-0.5 shrink-0 ${
                  plan.is_active ? "text-orange-500" : "text-gray-300"
                }`}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pie de Tarjeta con Botones de Acción */}
      <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(plan)}
          className="text-gray-500 hover:text-gray-900 hover:bg-transparent h-auto p-0 font-normal"
        >
          <Edit3 className="h-4 w-4 mr-1.5" />
          Editar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleStatus(plan.id_plan)}
          className={`h-auto p-0 hover:bg-transparent font-normal ${
            plan.is_active
              ? "text-rose-500 hover:text-rose-700"
              : "text-emerald-600 hover:text-emerald-800"
          }`}
        >
          {plan.is_active ? (
            <>
              <Power className="h-4 w-4 mr-1.5" />
              Desactivar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1.5" />
              Activar
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
