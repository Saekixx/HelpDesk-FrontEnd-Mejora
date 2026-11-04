import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  hardwareSchema,
  HardwareFormData,
} from "@/schema/hardware/hardware.schema";
import { HardwareItem } from "@/types/hardware/hardware.types";
import { SelectOption } from "@/shared/types/select-option.types";

interface HardwareFormProps {
  hardwareToEdit?: HardwareItem | null;
  onSubmit: (data: HardwareFormData) => Promise<void>;
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

const TIPOS_COMPONENTE = [
  { label: "Memoria RAM", value: "MEMORIA_RAM" },
  { label: "Almacenamiento SSD", value: "ALMACENAMIENTO_SSD" },
  { label: "Almacenamiento HDD", value: "ALMACENAMIENTO_HDD" },
  { label: "Fuente de Poder", value: "FUENTE_PODER" },
  { label: "Procesador", value: "PROCESADOR" },
  { label: "Tarjeta Gráfica", value: "TARJETA_GRAFICA" },
  { label: "Placa Base", value: "PLACA_BASE" },
];

export const HardwareForm = ({
  hardwareToEdit,
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
}: HardwareFormProps) => {
  const isEditing = !!hardwareToEdit;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof hardwareSchema>, any, HardwareFormData>({
    resolver: zodResolver(hardwareSchema),
    defaultValues: {
      tipo_componente: "MEMORIA_RAM",
      numero_serie: "",
      marca_modelo: "",
      proveedor: "",
      fecha_compra: "",
      costo_unitario: 0,
      url_factura: "",
      ubicacion_inicial: "ALMACEN_CENTRAL",
      id_cliente_temp: "",
      id_sucursal_temp: "",
      id_area_temp: "",
      id_equipo_destino: undefined,
    } as any,
  });

  const ubicacionInicial = watch("ubicacion_inicial");
  const selectedClienteTemp = watch("id_cliente_temp");
  const selectedSucursalTemp = watch("id_sucursal_temp");
  const selectedAreaTemp = watch("id_area_temp");

  useEffect(() => {
    if (hardwareToEdit) {
      reset({
        tipo_componente: hardwareToEdit.tipo_componente,
        numero_serie: hardwareToEdit.numero_serie || "",
        marca_modelo: hardwareToEdit.marca_modelo || "",
        proveedor: hardwareToEdit.proveedor || "",
        fecha_compra: hardwareToEdit.fecha_compra
          ? hardwareToEdit.fecha_compra.split("T")[0]
          : "",
        costo_unitario: hardwareToEdit.costo_unitario || 0,
        url_factura: hardwareToEdit.url_factura || "",
        id_cliente_temp: "",
        id_sucursal_temp: "",
        id_area_temp: "",
        id_equipo_destino: undefined,
      } as any);
    } else {
      reset({
        tipo_componente: "MEMORIA_RAM",
        numero_serie: "",
        marca_modelo: "",
        proveedor: "",
        fecha_compra: "",
        costo_unitario: 0,
        url_factura: "",
        ubicacion_inicial: "ALMACEN_CENTRAL",
        id_cliente_temp: "",
        id_sucursal_temp: "",
        id_area_temp: "",
        id_equipo_destino: undefined,
      } as any);
    }
  }, [hardwareToEdit, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[75vh] overflow-y-auto px-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Componente */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Tipo de Componente *
          </label>
          <select
            {...register("tipo_componente")}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
          >
            {TIPOS_COMPONENTE.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.tipo_componente && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.tipo_componente.message}
            </span>
          )}
        </div>

        {/* Número de Serie */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Número de Serie (S/N) *
          </label>
          <input
            type="text"
            placeholder="Ej. SN-X900-55102"
            {...register("numero_serie")}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
          />
          {errors.numero_serie && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.numero_serie.message}
            </span>
          )}
        </div>
      </div>

      {/* Marca y Modelo */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          Marca y Modelo Técnico *
        </label>
        <input
          type="text"
          placeholder="Ej. Kingston Fury Beast 32GB DDR5"
          {...register("marca_modelo")}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
        />
        {errors.marca_modelo && (
          <span className="text-[10px] text-rose-500 font-medium">
            {errors.marca_modelo.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proveedor */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Proveedor Comercial *
          </label>
          <input
            type="text"
            placeholder="Ej. TechSupply Corp Latam"
            {...register("proveedor")}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
          />
          {errors.proveedor && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.proveedor.message}
            </span>
          )}
        </div>

        {/* Fecha de Compra */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Fecha de Adquisición *
          </label>
          <input
            type="date"
            {...register("fecha_compra")}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
          />
          {errors.fecha_compra && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.fecha_compra.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Costo Unitario */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Costo Unitario (S/. soles) *
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="95.50"
            {...register("costo_unitario")}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
          />
          {errors.costo_unitario && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.costo_unitario.message}
            </span>
          )}
        </div>

        {/* Factura / O.C. (Archivo) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Factura / Comprobante (Archivo PDF o Imagen)
          </label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                setValue("url_factura", files[0]);
              }
            }}
            className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#ff5722] hover:file:bg-orange-100 cursor-pointer"
          />
          {errors.url_factura && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.url_factura.message as string}
            </span>
          )}
        </div>
      </div>

      {/* Ubicación Inicial (Se muestra ÚNICAMENTE en modo creación) */}
      {!isEditing && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700">
            Ubicación Inicial / Destino *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                ubicacionInicial === "ALMACEN_CENTRAL"
                  ? "border-[#ff5722] bg-orange-50/30"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                value="ALMACEN_CENTRAL"
                {...register("ubicacion_inicial")}
                className="mt-0.5 text-[#ff5722]"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Almacén Central
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Queda en Stock Disponible
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                ubicacionInicial === "INSTALAR_EQUIPO"
                  ? "border-[#ff5722] bg-orange-50/30"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                value="INSTALAR_EQUIPO"
                {...register("ubicacion_inicial")}
                className="mt-0.5 text-[#ff5722]"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Instalar en Equipo
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Vincular directamente a PC o Servidor
                </span>
              </div>
            </label>
          </div>

          {/* Filtros en Cascada con resolución de etiqueta (Label) */}
          {ubicacionInicial === "INSTALAR_EQUIPO" && (
            <div className="p-4 rounded-xl bg-orange-50/40 border border-orange-100 space-y-3 mt-3">
              <span className="text-[11px] font-extrabold text-[#ff5722] uppercase tracking-wider block">
                Selección jerárquica del equipo destino:
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
                          setValue("id_equipo_destino", undefined as any);
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
                            setValue("id_equipo_destino", undefined as any);
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
                            setValue("id_equipo_destino", undefined as any);
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
                    name="id_equipo_destino"
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
                  {errors.id_equipo_destino && (
                    <span className="text-[10px] text-rose-500 font-medium">
                      {errors.id_equipo_destino.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
          className="bg-[#b33900] hover:bg-[#802800] text-white font-bold rounded-xl text-xs px-5 cursor-pointer"
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Actualizar Hardware"
              : "Guardar Hardware"}
        </Button>
      </div>
    </form>
  );
};
