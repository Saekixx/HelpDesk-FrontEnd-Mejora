import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { PlanFormValues } from "../schemas/plan.schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlanFormFieldProps {
  form: UseFormReturn<PlanFormValues>;
}

export const PlanFormField = ({ form }: PlanFormFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "servicio",
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="numero_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Número de plan
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Plan #004"
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Nombre del plan
              </FormLabel>
              <FormControl>
                <Input placeholder="Plan Pro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="precio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Precio
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="S/ 250.00 /mes"
                  type="number"
                  step="0.01"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limite_equipos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Límite de equipos (opcional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Hasta 5 equipos"
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <FormLabel className="text-gray-800 font-bold text-base">
            Servicios incluidos
          </FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: "" })}
            className="border-dashed border-orange-400 text-orange-500 hover:text-orange-600 hover:bg-orange-50 gap-1 rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>

        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`servicio.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-0">
                    <FormControl>
                      <Input placeholder="Ej: Soporte remoto 24/7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
