import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectOption } from "@/shared/types/select-option.types";
import { SucursalFormValues } from "../schemas/sucursal.schema";

interface SucursalFormFieldsProps {
  form: UseFormReturn<SucursalFormValues>;
  empresasOptions: SelectOption<number>[];
  loadingEmpresas?: boolean;
  isEditing?: boolean;
}

export const SucursalFormFields = ({
  form,
  empresasOptions,
  loadingEmpresas,
  isEditing,
}: SucursalFormFieldsProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedCliente = watch("id_cliente");

  // Obtener etiqueta actual
  const selectedEmpresaLabel = empresasOptions.find(
    (opt) => Number(opt.value) === Number(selectedCliente),
  )?.label;

  return (
    <div className="space-y-4">
      {/* Empresa */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">
          Empresa <span className="text-red-500">*</span>
        </Label>
        <Select
          disabled={loadingEmpresas || isEditing}
          value={
            selectedCliente !== undefined && selectedCliente !== null
              ? String(selectedCliente)
              : ""
          }
          onValueChange={(val) =>
            setValue("id_cliente", Number(val), { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full text-xs h-9">
            <SelectValue placeholder="Selecciona una empresa">
              {selectedEmpresaLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {empresasOptions.map((item) => (
              <SelectItem
                key={String(item.value)}
                value={String(item.value)}
                className="text-xs"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.id_cliente && (
          <p className="text-[11px] text-red-500">
            {errors.id_cliente.message}
          </p>
        )}
      </div>

      {/* Nombre de la sucursal */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">
          Nombre de la sucursal <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("nombre_sucursal")}
          placeholder="Ej: Sede Central, Planta Norte..."
          className="text-xs h-9"
        />
        {errors.nombre_sucursal && (
          <p className="text-[11px] text-red-500">
            {errors.nombre_sucursal.message}
          </p>
        )}
      </div>

      {/* Encargado */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">Encargado</Label>
        <Input
          {...register("encargado")}
          placeholder="Nombre del responsable"
          className="text-xs h-9"
        />
      </div>

      {/* Teléfono y Correo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">
            Teléfono
          </Label>
          <Input
            {...register("telefono")}
            placeholder="01-000-0000"
            className="text-xs h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">Correo</Label>
          <Input
            {...register("correo")}
            type="email"
            placeholder="sucursal@empresa.com"
            className="text-xs h-9"
          />
          {errors.correo && (
            <p className="text-[11px] text-red-500">{errors.correo.message}</p>
          )}
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">
          Dirección <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("direccion")}
          placeholder="Av. Ejemplo 123, Ciudad"
          className="text-xs h-9"
        />
        {errors.direccion && (
          <p className="text-[11px] text-red-500">{errors.direccion.message}</p>
        )}
      </div>
    </div>
  );
};
