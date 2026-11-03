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
import { useAreaMutations } from "@/hooks/area/useAreaMutations";

interface AreaFormProps {
  areaToEdit?: any | null;
  onSuccess: () => void;
  onClose: () => void;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
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
  const { crearArea, actualizarArea, isSubmitting } = useAreaMutations();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema) as unknown as Resolver<AreaFormData>,
    defaultValues: {
      id_cliente: "",
      id_sucursal: "",
      nombre_area: "",
      contacto_encargado: "",
      telefono: "",
      correo: "",
    } as any,
  });

  const selectedClienteId = watch("id_cliente");

  // Rellenar o resetear formulario sólo al cambiar areaToEdit
  React.useEffect(() => {
    if (areaToEdit) {
      const clienteId =
        areaToEdit.cliente?.id_cliente ??
        areaToEdit.id_cliente ??
        areaToEdit.id_empresa ??
        "";

      const sucursalId =
        areaToEdit.sucursal?.id_sucursal ?? areaToEdit.id_sucursal ?? "";

      // Disparamos la carga de sucursales del cliente actual
      if (clienteId && onClienteChange) {
        onClienteChange(clienteId);
      }

      reset({
        id_cliente: clienteId != null ? String(clienteId) : "",
        id_sucursal: sucursalId != null ? String(sucursalId) : "",
        nombre_area: areaToEdit.nombre_area || "",
        contacto_encargado: areaToEdit.contacto || "",
        telefono: areaToEdit.telefono || "",
        correo: areaToEdit.correo || "",
      } as any);
    } else {
      reset({
        id_cliente: "",
        id_sucursal: "",
        nombre_area: "",
        contacto_encargado: "",
        telefono: "",
        correo: "",
      } as any);
    }
  }, [areaToEdit, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        id_sucursal: Number(data.id_sucursal),
        nombre_area: data.nombre_area,
        contacto: data.contacto_encargado || undefined,
        telefono: data.telefono || undefined,
        correo: data.correo || undefined,
      };

      if (isEditing && areaToEdit) {
        const id = areaToEdit.id_area;
        await actualizarArea(id, payload);
      } else {
        await crearArea(payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al procesar el área:", error);
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
                value={field.value != null ? String(field.value) : ""}
                onValueChange={(val) => {
                  field.onChange(val);
                  // Limpiamos la sucursal seleccionada al cambiar de empresa
                  setValue("id_sucursal", "");
                  if (onClienteChange) {
                    onClienteChange(val);
                  }
                }}
              >
                <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                  <SelectValue placeholder="Selecciona una empresa cliente...">
                    {currentLabel ||
                      (isEditing && field.value
                        ? `Cargando... (${field.value})`
                        : undefined)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
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
                value={field.value != null ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(val)}
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
                    {currentLabel ||
                      (isEditing && field.value
                        ? `Cargando... (${field.value})`
                        : undefined)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
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

      {/* RESPONSABLE DEL ÁREA */}
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

      {/* BOTONES INFERIORES */}
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
