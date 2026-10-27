import * as React from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { areaSchema, AreaFormData } from "@/schema/area/area.schema";
import { SelectOption } from "@/shared/types/select-option.types";

interface AreaFormProps {
  areaToEdit?: any | null;
  onSuccess: () => void;
  onClose: () => void;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  onClienteChange?: (clienteId: number | null) => void;
}

export const AreaForm = ({
  areaToEdit,
  onSuccess,
  onClose,
  clientes = [],
  sucursales = [],
  onClienteChange,
}: AreaFormProps) => {
  const isEditing = Boolean(areaToEdit);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema) as unknown as Resolver<AreaFormData>,
    defaultValues: {
      id_cliente: undefined,
      id_sucursal: undefined,
      nombre_area: "",
      contacto_encargado: "",
      telefono: "",
      correo: "",
    },
  });

  const selectedClienteId = watch("id_cliente");

  // Notificar al padre cada vez que cambie la empresa seleccionada
  React.useEffect(() => {
    if (onClienteChange) {
      onClienteChange(selectedClienteId ? Number(selectedClienteId) : null);
    }
  }, [selectedClienteId, onClienteChange]);

  // Cargar datos al editar o limpiar al crear
  React.useEffect(() => {
    if (areaToEdit) {
      const clienteId =
        areaToEdit.id_cliente ??
        areaToEdit.id_empresa ??
        areaToEdit.empresa_id ??
        areaToEdit.sucursal?.id_cliente ??
        areaToEdit.cliente_empresa?.id ??
        undefined;

      const sucursalId =
        areaToEdit.id_sucursal ??
        areaToEdit.sucursal?.id_sucursal ??
        areaToEdit.sucursal?.id ??
        undefined;

      reset({
        id_cliente: clienteId ? Number(clienteId) : undefined,
        id_sucursal: sucursalId ? Number(sucursalId) : undefined,
        nombre_area: areaToEdit.nombre_area || areaToEdit.nombre || "",
        contacto_encargado:
          areaToEdit.contacto_encargado || areaToEdit.encargado || "",
        telefono: areaToEdit.telefono || "",
        correo: areaToEdit.correo || "",
      });

      if (clienteId && onClienteChange) {
        onClienteChange(Number(clienteId));
      }
    } else {
      reset({
        id_cliente: undefined,
        id_sucursal: undefined,
        nombre_area: "",
        contacto_encargado: "",
        telefono: "",
        correo: "",
      });
    }
  }, [areaToEdit, reset]);

  const onSubmit = async (data: AreaFormData) => {
    try {
      setIsSubmitting(true);
      if (isEditing) {
        console.log("Actualizar Área Payload:", data);
      } else {
        console.log("Crear Área Payload:", data);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al procesar el área:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      {/* EMPRESA */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700">
          Empresa <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="id_cliente"
          control={control}
          render={({ field }) => {
            const currentLabel = clientes.find(
              (c) => String(c.value) === String(field.value),
            )?.label;
            return (
              <Select
                key={field.value ?? "empresa-empty"}
                value={field.value != null ? String(field.value) : ""}
                onValueChange={(val) => {
                  field.onChange(Number(val));
                }}
              >
                <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                  <SelectValue placeholder="Selecciona una empresa cliente...">
                    {currentLabel || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 z-[9999] bg-white shadow-lg border border-slate-200">
                  {clientes.map((c) => (
                    <SelectItem
                      key={String(c.value)}
                      value={String(c.value)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.id_cliente && (
          <p className="text-[11px] text-red-500 font-semibold">
            {errors.id_cliente.message}
          </p>
        )}
      </div>

      {/* SUCURSAL */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700">
          Sucursal <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="id_sucursal"
          control={control}
          render={({ field }) => {
            const currentLabel = sucursales.find(
              (s) => String(s.value) === String(field.value),
            )?.label;
            return (
              <Select
                key={`${selectedClienteId}-${field.value ?? "sucursal-empty"}`}
                value={field.value != null ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
                disabled={!selectedClienteId}
              >
                <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                  <SelectValue
                    placeholder={
                      selectedClienteId
                        ? "Selecciona una sucursal..."
                        : "Primero selecciona una empresa..."
                    }
                  >
                    {currentLabel || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 z-[9999] bg-white shadow-lg border border-slate-200">
                  {sucursales.map((s) => (
                    <SelectItem
                      key={String(s.value)}
                      value={String(s.value)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.id_sucursal && (
          <p className="text-[11px] text-red-500 font-semibold">
            {errors.id_sucursal.message}
          </p>
        )}
      </div>

      {/* NOMBRE DEL ÁREA */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700">
          Nombre del Área <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("nombre_area")}
          placeholder="Ej. Contabilidad, Sistemas y TI, Almacén"
          className="h-10 text-xs"
        />
        {errors.nombre_area && (
          <p className="text-[11px] text-red-500 font-semibold">
            {errors.nombre_area.message}
          </p>
        )}
      </div>

      {/* RESPONSABLE DEL ÁREA (SECCIÓN INFORMATIVA) */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Responsable del área (Contacto informativo)
          </span>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Contacto / Encargado
          </Label>
          <Input
            {...register("contacto_encargado")}
            placeholder="Ej. Eduardo Gonzales"
            className="h-10 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Teléfono</Label>
            <Input
              {...register("telefono")}
              placeholder="+51 987 654 321"
              className="h-10 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Correo Electrónico
            </Label>
            <Input
              type="email"
              {...register("correo")}
              placeholder="encargado@empresa.com"
              className="h-10 text-xs"
            />
          </div>
        </div>
      </div>

      {/* BOTONES INFERIORES DE ACCIÓN */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="h-10 px-4 text-xs font-bold text-slate-700 border-slate-200 cursor-pointer"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-5 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer"
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Actualizar área"
              : "Crear área"}
        </Button>
      </div>
    </form>
  );
};
