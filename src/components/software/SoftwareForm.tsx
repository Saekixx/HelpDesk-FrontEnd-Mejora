import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  softwareSchema,
  SoftwareFormData,
} from "@/schema/software/software.schema";
import { SoftwareItem } from "@/types/software/software.type";
import { SelectOption } from "@/shared/types/select-option.types";
import { KeyRound, Loader2 } from "lucide-react";

interface SoftwareFormProps {
  softwareToEdit?: SoftwareItem | null;
  onSubmit: (data: SoftwareFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
}

const CATEGORIAS_SOFTWARE = [
  {
    label: "Suites Ofimáticas",
    value: "Suites Ofimáticas",
    desc: "Herramientas de productividad y ofimática.",
  },
  {
    label: "Sistemas Operativos",
    value: "Sistemas Operativos",
    desc: "Software base para gestión de equipos.",
  },
  {
    label: "Seguridad & EDR",
    value: "Seguridad & EDR",
    desc: "Antivirus, firewalls y protección de terminales.",
  },
  {
    label: "Diseño & Edición",
    value: "Diseño & Edición",
    desc: "Multimedia, diseño gráfico y maquetación.",
  },
  {
    label: "Bases de Datos & Dev",
    value: "Bases de Datos & Dev",
    desc: "Entornos de desarrollo y motores SQL.",
  },
  {
    label: "Ingeniería & Arquitectura",
    value: "Ingeniería & Arquitectura",
    desc: "CAD, modelado 3D y simulación.",
  },
];

const MODELOS_LICENCIA = [
  {
    label: "Por Asiento (SSO)",
    value: "Monousuario_OEM",
    desc: "Licenciamiento vinculado a una máquina o estación de trabajo fija individual.",
  },
  {
    label: "Por Usuario Nominativo",
    value: "Pool_Limitado",
    desc: "Asignado a una persona específica independientemente del equipo que utilice.",
  },
  {
    label: "OEM Endpoint",
    value: "OEM_Endpoint",
    desc: "Licencia de fábrica preinstalada o asociada al hardware original del dispositivo.",
  },
  {
    label: "Flotante Corporativa",
    value: "Corporativa_Flotante",
    desc: "Pool compartido de licencias concurrentes gestionadas por un servidor central.",
  },
  {
    label: "Empresarial Ilimitada",
    value: "Empresarial_Ilimitada",
    desc: "Acuerdo de volumen corporativo sin restricción estricta de asientos simultáneos.",
  },
  {
    label: "Pool Licencias Red",
    value: "Pool_Licencias_Red",
    desc: "Bolsa de licencias dinámicas distribuidas bajo demanda en la red local de la sede.",
  },
];

export const SoftwareForm = ({
  softwareToEdit,
  onSubmit,
  onCancel,
  isSubmitting,
  clientes = [],
  sucursales = [],
  onClienteChange,
}: SoftwareFormProps) => {
  const isEditing = Boolean(softwareToEdit);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SoftwareFormData>({
    resolver: zodResolver(softwareSchema),
    defaultValues: {
      id_cliente: undefined,
      id_sucursal: undefined,
      nombre_software: "",
      categoria: "",
      proveedor: "",
      tipo_licencia: "",
      limite_equipos: 1,
      licencia_master_key: "",
      fecha_compra: "",
      fecha_caducidad: "",
    },
  });

  useEffect(() => {
    if (softwareToEdit) {
      reset({
        id_cliente: softwareToEdit.id_cliente
          ? Number(softwareToEdit.id_cliente)
          : undefined,
        id_sucursal: softwareToEdit.id_sucursal
          ? Number(softwareToEdit.id_sucursal)
          : undefined,
        nombre_software: softwareToEdit.nombre_software || "",
        categoria: softwareToEdit.categoria || "",
        proveedor: softwareToEdit.proveedor || "",
        tipo_licencia: softwareToEdit.tipo_licencia || "",
        limite_equipos: softwareToEdit.limite_equipos || 1,
        licencia_master_key: softwareToEdit.licencia_master_key || "",
        fecha_compra: softwareToEdit.fecha_compra
          ? softwareToEdit.fecha_compra.split("T")[0]
          : "",
        fecha_caducidad: softwareToEdit.fecha_caducidad
          ? softwareToEdit.fecha_caducidad.split("T")[0]
          : "",
      });
    } else {
      reset({
        id_cliente: undefined,
        id_sucursal: undefined,
        nombre_software: "",
        categoria: "",
        proveedor: "",
        tipo_licencia: "",
        limite_equipos: 1,
        licencia_master_key: "",
        fecha_compra: "",
        fecha_caducidad: "",
      });
    }
  }, [softwareToEdit, reset]);

  const selectedCliente = watch("id_cliente");
  const selectedCategoria = watch("categoria");
  const selectedTipoLicencia = watch("tipo_licencia");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[75vh] overflow-y-auto px-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Empresa / Cliente */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Empresa / Cliente *
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
                    setValue("id_sucursal", undefined as any);
                    if (onClienteChange) onClienteChange(val);
                  }}
                >
                  <SelectTrigger className="h-10 text-xs bg-slate-50/50 font-semibold">
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
          {errors.id_cliente && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.id_cliente.message}
            </span>
          )}
        </div>

        {/* Sucursal / Sede */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Sucursal / Sede *
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
                  onValueChange={field.onChange}
                  disabled={!selectedCliente}
                >
                  <SelectTrigger className="h-10 text-xs bg-slate-50/50 font-semibold">
                    <SelectValue
                      placeholder={
                        selectedCliente
                          ? "Selecciona sucursal..."
                          : "Primero selecciona empresa"
                      }
                    >
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
          {errors.id_sucursal && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.id_sucursal.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nombre del Software */}
        <div className="space-y-1.5 md:col-span-1">
          <Label className="text-xs font-bold text-slate-700">
            Nombre del Software *
          </Label>
          <Input
            type="text"
            placeholder="Ej. Adobe Creative Cloud Pro..."
            {...register("nombre_software")}
            className="h-10 text-xs bg-slate-50/50 font-medium"
          />
          {errors.nombre_software && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.nombre_software.message}
            </span>
          )}
        </div>

        {/* Categoría */}
        <div className="space-y-1.5 md:col-span-1">
          <Label className="text-xs font-bold text-slate-700">
            Categoría *
          </Label>
          <Controller
            name="categoria"
            control={control}
            render={({ field }) => {
              const currentLabel = CATEGORIAS_SOFTWARE.find(
                (cat) => cat.value === field.value,
              )?.label;
              return (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 text-xs bg-slate-50/50 font-semibold">
                    <SelectValue placeholder="Seleccione categoría...">
                      {currentLabel || undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS_SOFTWARE.map((cat) => (
                      <SelectItem
                        key={cat.value}
                        value={cat.value}
                        className="text-xs font-medium"
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {selectedCategoria && (
            <span className="text-[10px] text-slate-400 block">
              {
                CATEGORIAS_SOFTWARE.find((c) => c.value === selectedCategoria)
                  ?.desc
              }
            </span>
          )}
          {errors.categoria && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.categoria.message}
            </span>
          )}
        </div>

        {/* Proveedor / Mayorista */}
        <div className="space-y-1.5 md:col-span-1">
          <Label className="text-xs font-bold text-slate-700">
            Proveedor / Mayorista *
          </Label>
          <Input
            type="text"
            placeholder="Ej. Microsoft Corporation..."
            {...register("proveedor")}
            className="h-10 text-xs bg-slate-50/50 font-medium"
          />
          <span className="text-[10px] text-slate-400 block">
            Proveedor comercial o partner distribuidor.
          </span>
          {errors.proveedor && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.proveedor.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Modelo con Descripción */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Tipo de Modelo *
          </Label>
          <Controller
            name="tipo_licencia"
            control={control}
            render={({ field }) => {
              const currentLabel = MODELOS_LICENCIA.find(
                (mod) => mod.value === field.value,
              )?.label;
              return (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 text-xs bg-slate-50/50 font-semibold">
                    <SelectValue placeholder="Seleccione modelo...">
                      {currentLabel || undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MODELOS_LICENCIA.map((mod) => (
                      <SelectItem
                        key={mod.value}
                        value={mod.value}
                        className="text-xs font-medium"
                      >
                        {mod.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {selectedTipoLicencia && (
            <span className="text-[10px] text-slate-500 font-medium block bg-orange-50/50 p-2 rounded-lg border border-orange-100/60">
              💡{" "}
              {
                MODELOS_LICENCIA.find((m) => m.value === selectedTipoLicencia)
                  ?.desc
              }
            </span>
          )}
          {errors.tipo_licencia && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.tipo_licencia.message}
            </span>
          )}
        </div>

        {/* Límite de Equipos / Capacidad Total */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Límite de Equipos / Capacidad Total *
          </Label>
          <Input
            type="number"
            placeholder="Ej. 50"
            {...register("limite_equipos")}
            className="h-10 text-xs bg-slate-50/50 font-medium"
          />
          <span className="text-[10px] text-slate-400 block">
            Total de cupos o asientos adquiridos en este contrato.
          </span>
          {errors.limite_equipos && (
            <span className="text-[10px] text-rose-500 font-medium">
              {errors.limite_equipos.message}
            </span>
          )}
        </div>
      </div>

      {/* Master Key / Licencia KMS (Global) */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5 text-[#ff5722]" />
          Master Key / Licencia KMS (Global)
        </Label>
        <Input
          type="text"
          placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
          {...register("licencia_master_key")}
          className="h-10 text-xs bg-slate-50/50 font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha de Compra */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Fecha de Compra
          </Label>
          <Input
            type="date"
            {...register("fecha_compra")}
            className="h-10 text-xs bg-slate-50/50 font-medium"
          />
        </div>

        {/* Fecha de Expiración / Caducidad */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Fecha de Expiración / Caducidad
          </Label>
          <Input
            type="date"
            {...register("fecha_caducidad")}
            className="h-10 text-xs bg-slate-50/50 font-medium"
          />
        </div>
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
          className="bg-[#b33900] hover:bg-[#802800] text-white font-bold rounded-xl text-xs px-5 cursor-pointer flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar Cambios"
              : "Registrar Lote de Software"}
        </Button>
      </div>
    </form>
  );
};
