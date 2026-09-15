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
import { AreaFormValues } from "../schemas/area.schema";

interface AreaFormFieldsProps {
  form: UseFormReturn<AreaFormValues>;
  empresasOptions: SelectOption<number>[];
  sucursalesOptions: SelectOption<number>[];
  selectedClienteId: number | null;
  onSelectCliente: (clienteId: number) => void;
  loadingEmpresas?: boolean;
  loadingSucursales?: boolean;
  isEditing?: boolean;
}

export const AreaFormFields = ({
  form,
  empresasOptions,
  sucursalesOptions,
  selectedClienteId,
  onSelectCliente,
  loadingEmpresas,
  loadingSucursales,
  isEditing,
}: AreaFormFieldsProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedSucursal = watch("id_sucursal");

  // Obtener etiquetas actuales
  const selectedEmpresaLabel = empresasOptions.find(
    (opt) => Number(opt.value) === Number(selectedClienteId),
  )?.label;

  const selectedSucursalLabel = sucursalesOptions.find(
    (opt) => Number(opt.value) === Number(selectedSucursal),
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
            selectedClienteId !== null && selectedClienteId !== undefined
              ? String(selectedClienteId)
              : ""
          }
          onValueChange={(val) => onSelectCliente(Number(val))}
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
      </div>

      {/* Sucursal */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">
          Sucursal <span className="text-red-500">*</span>
        </Label>
        <Select
          disabled={loadingSucursales || !selectedClienteId}
          value={
            selectedSucursal !== undefined && selectedSucursal !== null
              ? String(selectedSucursal)
              : ""
          }
          onValueChange={(val) =>
            setValue("id_sucursal", Number(val), { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full text-xs h-9">
            <SelectValue
              placeholder={
                !selectedClienteId
                  ? "Primero selecciona una empresa"
                  : "Selecciona una sucursal"
              }
            >
              {selectedSucursalLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sucursalesOptions.map((item) => (
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
        {errors.id_sucursal && (
          <p className="text-[11px] text-red-500">
            {errors.id_sucursal.message}
          </p>
        )}
      </div>

      {/* Nombre del área */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">
          Nombre del área <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("nombre_area")}
          placeholder="Ej: Sistemas, Logística..."
          className="text-xs h-9"
        />
        {errors.nombre_area && (
          <p className="text-[11px] text-red-500">
            {errors.nombre_area.message}
          </p>
        )}
      </div>

      {/* Contacto */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">Contacto</Label>
        <Input
          {...register("contacto")}
          placeholder="Nombre del encargado"
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
            placeholder="area@empresa.com"
            className="text-xs h-9"
          />
          {errors.correo && (
            <p className="text-[11px] text-red-500">{errors.correo.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
