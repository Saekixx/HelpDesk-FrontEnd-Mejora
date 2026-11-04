import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  hardwareTransitionSchema,
  HardwareTransitionFormData,
} from "@/schema/hardware/hardwareTransition.schema";
import { HardwareItem } from "@/types/hardware/hardware.types";
import { SelectOption } from "@/shared/types/select-option.types";

interface HardwareTransitionFormProps {
  hardware: HardwareItem;
  onSubmit: (data: HardwareTransitionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  areas?: SelectOption[];
  equipos?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
  onSucursalChange?: (sucursalId: string | number) => void;
  onAreaChange?: (areaId: string | number) => void;
}

export const HardwareTransitionForm = ({
  hardware,
  onSubmit,
  onCancel,
  isSubmitting,
  clientes = [],
  sucursales = [],
  areas = [],
  equipos = [],
  onClienteChange,
  onSucursalChange,
  onAreaChange,
}: HardwareTransitionFormProps) => {
  // Filtramos las opciones de estados permitidos según el estado actual del componente
  // Ej: Si ya está instalado, no se muestra "INSTALADO" como opción principal de transición directa sin pasar por disponible/retiro,
  // o filtramos el estado actual para que el usuario no seleccione el mismo en el que ya está.
  const ESTADOS_DISPONIBLES = [
    { label: "Disponible (Stock Central)", value: "DISPONIBLE" },
    { label: "Instalado en Equipo", value: "INSTALADO" },
    { label: "En Mantenimiento / Revisión", value: "EN_MANTENIMIENTO" },
    { label: "Baja / Descarte Definitivo", value: "BAJA" },
  ].filter((e) => e.value !== hardware.estado); // Evita cambiar al mismo estado actual

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HardwareTransitionFormData>({
    resolver: zodResolver(hardwareTransitionSchema),
    defaultValues: {
      estado: ESTADOS_DISPONIBLES[0]?.value || "DISPONIBLE",
      motivo: "",
      id_equipo: undefined,
      id_cliente_temp: "",
      id_sucursal_temp: "",
      id_area_temp: "",
    },
  });

  const estadoSeleccionado = watch("estado");
  const selectedClienteTemp = watch("id_cliente_temp");
  const selectedSucursalTemp = watch("id_sucursal_temp");
  const selectedAreaTemp = watch("id_area_temp");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[75vh] overflow-y-auto px-1"
    >
      {/* Alerta de Estado Actual */}
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
        <span>
          Estado actual:{" "}
          <strong className="uppercase text-slate-900">
            {hardware.estado_label}
          </strong>
        </span>
        <span className="text-slate-500">S/N: {hardware.numero_serie}</span>
      </div>

      {/* Nuevo Estado */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          Nuevo Estado del Hardware *
        </label>
        <Controller
          name="estado"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                <SelectValue placeholder="Selecciona nuevo estado..." />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_DISPONIBLES.map((est) => (
                  <SelectItem
                    key={est.value}
                    value={est.value}
                    className="text-xs font-medium"
                  >
                    {est.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.estado && (
          <span className="text-[10px] text-rose-500 font-medium">
            {errors.estado.message}
          </span>
        )}
      </div>

      {/* Selección en cascada obligatoria ÚNICAMENTE si el estado es INSTALADO */}
      {estadoSeleccionado === "INSTALADO" && (
        <div className="p-4 rounded-xl bg-orange-50/40 border border-orange-100 space-y-3">
          <span className="text-[11px] font-extrabold text-[#ff5722] uppercase tracking-wider block">
            Asignación de Equipo de Destino (Requerido):
          </span>

          {/* 1. Empresa / Cliente */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Empresa / Cliente *
            </Label>
            <Controller
              name="id_cliente_temp"
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
                      setValue("id_sucursal_temp", "");
                      setValue("id_area_temp", "");
                      setValue("id_equipo", undefined as any);
                      if (onClienteChange) onClienteChange(val);
                    }}
                  >
                    <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                      <SelectValue placeholder="Selecciona empresa...">
                        {currentLabel || undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem
                          key={String(c.value)}
                          value={String(c.value)}
                          className="text-xs font-medium"
                        >
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </div>

          {/* 2. Sucursal */}
          {selectedClienteTemp && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Sucursal / Sede *
              </Label>
              <Controller
                name="id_sucursal_temp"
                control={control}
                render={({ field }) => {
                  const currentLabel = sucursales.find(
                    (s) => String(s.value) === String(field.value),
                  )?.label;
                  return (
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("id_area_temp", "");
                        setValue("id_equipo", undefined as any);
                        if (onSucursalChange) onSucursalChange(val);
                      }}
                    >
                      <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                        <SelectValue placeholder="Selecciona sucursal...">
                          {currentLabel || undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {sucursales.map((s) => (
                          <SelectItem
                            key={String(s.value)}
                            value={String(s.value)}
                            className="text-xs font-medium"
                          >
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
          )}

          {/* 3. Área */}
          {selectedSucursalTemp && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Área / Departamento *
              </Label>
              <Controller
                name="id_area_temp"
                control={control}
                render={({ field }) => {
                  const currentLabel = areas.find(
                    (a) => String(a.value) === String(field.value),
                  )?.label;
                  return (
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("id_equipo", undefined as any);
                        if (onAreaChange) onAreaChange(val);
                      }}
                    >
                      <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                        <SelectValue placeholder="Selecciona área...">
                          {currentLabel || undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((a) => (
                          <SelectItem
                            key={String(a.value)}
                            value={String(a.value)}
                            className="text-xs font-medium"
                          >
                            {a.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
          )}

          {/* 4. Equipo */}
          {selectedAreaTemp && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Equipo de Destino *
              </Label>
              <Controller
                name="id_equipo"
                control={control}
                render={({ field }) => {
                  const currentLabel = equipos.find(
                    (eq) => String(eq.value) === String(field.value),
                  )?.label;
                  return (
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                        <SelectValue placeholder="Selecciona equipo...">
                          {currentLabel || undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {equipos.map((eq) => (
                          <SelectItem
                            key={String(eq.value)}
                            value={String(eq.value)}
                            className="text-xs font-medium"
                          >
                            {eq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.id_equipo && (
                <span className="text-[10px] text-rose-500 font-medium">
                  {errors.id_equipo.message}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Motivo del Cambio */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          Motivo / Justificación del Cambio *
        </label>
        <textarea
          rows={3}
          placeholder="Ej. Se retira del equipo anterior por actualización de componentes..."
          {...register("motivo")}
          className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
        />
        {errors.motivo && (
          <span className="text-[10px] text-rose-500 font-medium">
            {errors.motivo.message}
          </span>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl text-xs cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold rounded-xl text-xs px-5 cursor-pointer"
        >
          {isSubmitting ? "Procesando..." : "Registrar Transición"}
        </Button>
      </div>
    </form>
  );
};
