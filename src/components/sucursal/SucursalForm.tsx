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
import { Mail } from "lucide-react";
import {
  sucursalSchema,
  SucursalFormData,
} from "@/schema/sucursal/sucursal.schema";
import { SelectOption } from "@/shared/types/select-option.types";

interface SucursalDetail {
  id_sucursal?: number;
  id_cliente?: number;
  nombre?: string;
  direccion?: string;
  encargado_nombre?: string;
  encargado_apellido?: string;
  telefono?: string;
  correo?: string;
}

interface SucursalFormProps {
  sucursalToEdit?: SucursalDetail | null;
  onSuccess: () => void;
  onClose: () => void;
  clientes?: SelectOption[];
}

export const SucursalForm = ({
  sucursalToEdit,
  onSuccess,
  onClose,
  clientes = [],
}: SucursalFormProps) => {
  const isEditing = Boolean(sucursalToEdit);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm<SucursalFormData>({
    resolver: zodResolver(
      sucursalSchema,
    ) as unknown as Resolver<SucursalFormData>,
    defaultValues: {
      id_cliente: undefined,
      nombre: "",
      direccion: "",
      encargado_nombre: "",
      encargado_apellido: "",
      telefono: "",
      correo: "",
    },
  });

  // Rellenar o resetear formulario según si es Edición o Creación
  React.useEffect(() => {
    if (sucursalToEdit) {
      reset({
        id_cliente: sucursalToEdit.id_cliente
          ? Number(sucursalToEdit.id_cliente)
          : undefined,
        nombre: sucursalToEdit.nombre || "",
        direccion: sucursalToEdit.direccion || "",
        encargado_nombre: sucursalToEdit.encargado_nombre || "",
        encargado_apellido: sucursalToEdit.encargado_apellido || "",
        telefono: sucursalToEdit.telefono || "",
        correo: sucursalToEdit.correo || "",
      });
    } else {
      reset({
        id_cliente: undefined,
        nombre: "",
        direccion: "",
        encargado_nombre: "",
        encargado_apellido: "",
        telefono: "",
        correo: "",
      });
      setStep(1);
    }
  }, [sucursalToEdit, reset]);

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isValid = await trigger(["id_cliente", "nombre", "direccion"]);
    if (isValid) {
      setStep(2);
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const onSubmit = async (data: SucursalFormData) => {
    try {
      setIsSubmitting(true);
      if (isEditing) {
        console.log("Actualizar Sucursal Payload:", data);
      } else {
        console.log("Crear Sucursal y Cuenta Payload:", data);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al procesar la sucursal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      {/* Indicador de Pasos (Solo si es Creación) */}
      {!isEditing && (
        <div className="my-2 flex items-center justify-between px-2 py-1">
          <div
            className={`flex items-center gap-2 text-xs ${step >= 1 ? "text-[#ff5722] font-semibold" : "text-slate-400"}`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white ${step >= 1 ? "bg-[#ff5722]" : "bg-slate-300"}`}
            >
              1
            </span>
            Datos de la Sede
          </div>
          <div className="h-0.5 w-16 bg-slate-200" />
          <div
            className={`flex items-center gap-2 text-xs ${step === 2 ? "text-[#ff5722] font-semibold" : "text-slate-400"}`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white ${step === 2 ? "bg-[#ff5722]" : "bg-slate-300"}`}
            >
              2
            </span>
            Cuenta Cliente Sucursal
          </div>
        </div>
      )}

      {/* EDICIÓN (Todo en una sola vista) */}
      {isEditing ? (
        <div className="space-y-4">
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
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                      <SelectValue placeholder="Selecciona una empresa cliente...">
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
              <p className="text-[11px] text-red-500 font-semibold">
                {errors.id_cliente.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Nombre de la Sucursal <span className="text-red-500">*</span>
            </Label>
            <Input {...register("nombre")} className="h-10 text-xs" />
            {errors.nombre && (
              <p className="text-[11px] text-red-500 font-semibold">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Nombre del Encargado <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("encargado_nombre")}
                className="h-10 text-xs"
              />
              {errors.encargado_nombre && (
                <p className="text-[11px] text-red-500 font-semibold">
                  {errors.encargado_nombre.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Apellido del Encargado <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("encargado_apellido")}
                className="h-10 text-xs"
              />
              {errors.encargado_apellido && (
                <p className="text-[11px] text-red-500 font-semibold">
                  {errors.encargado_apellido.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input {...register("telefono")} className="h-10 text-xs" />
              {errors.telefono && (
                <p className="text-[11px] text-red-500 font-semibold">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Correo Electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                {...register("correo")}
                className="h-10 text-xs"
              />
              {errors.correo && (
                <p className="text-[11px] text-red-500 font-semibold">
                  {errors.correo.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Dirección Fiscal / Ubicación{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input {...register("direccion")} className="h-10 text-xs" />
            {errors.direccion && (
              <p className="text-[11px] text-red-500 font-semibold">
                {errors.direccion.message}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* CREACIÓN (En 2 Pasos) */
        <>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Empresa Cliente <span className="text-red-500">*</span>
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
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                          <SelectValue placeholder="Selecciona una empresa cliente...">
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
                  <p className="text-[11px] text-red-500 font-semibold">
                    {errors.id_cliente.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Nombre de la Sucursal <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("nombre")}
                  placeholder="Ej. Sede Central, Planta Norte, Milan Abancay"
                  className="h-10 text-xs"
                />
                {errors.nombre && (
                  <p className="text-[11px] text-red-500 font-semibold">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Dirección Fiscal / Ubicación{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("direccion")}
                  placeholder="Ej. Av. Abancay 450, Cercado de Lima"
                  className="h-10 text-xs"
                />
                {errors.direccion && (
                  <p className="text-[11px] text-red-500 font-semibold">
                    {errors.direccion.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800 font-medium flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Nota:</strong> Este usuario tendrá el rol{" "}
                  <strong>CLIENTE SUCURSAL</strong> y recibirá un correo
                  electrónico de verificación para habilitar sus credenciales de
                  acceso.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Nombres del Encargado{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("encargado_nombre")}
                    placeholder="Ej. Rosa María"
                    className="h-10 text-xs bg-white"
                  />
                  {errors.encargado_nombre && (
                    <p className="text-[11px] text-red-500 font-semibold">
                      {errors.encargado_nombre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Apellidos del Encargado{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("encargado_apellido")}
                    placeholder="Ej. Gonzales Pérez"
                    className="h-10 text-xs bg-white"
                  />
                  {errors.encargado_apellido && (
                    <p className="text-[11px] text-red-500 font-semibold">
                      {errors.encargado_apellido.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Teléfono de Contacto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("telefono")}
                    placeholder="Ej. +51 987 654 321"
                    className="h-10 text-xs bg-white"
                  />
                  {errors.telefono && (
                    <p className="text-[11px] text-red-500 font-semibold">
                      {errors.telefono.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Correo Electrónico Corporativo{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    {...register("correo")}
                    placeholder="Ej. encargado@empresa.com"
                    className="h-10 text-xs bg-white"
                  />
                  {errors.correo && (
                    <p className="text-[11px] text-red-500 font-semibold">
                      {errors.correo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* BOTONES INFERIORES DE ACCIÓN */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        {!isEditing && step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            className="h-10 px-4 text-xs font-bold text-slate-700 border-slate-200 cursor-pointer"
          >
            Atrás
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 text-xs font-bold text-slate-700 border-slate-200 cursor-pointer"
          >
            Cancelar
          </Button>

          {!isEditing && step === 1 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="h-10 px-5 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer"
            >
              Continuar
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer"
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                  ? "Actualizar sucursal"
                  : "Crear Sucursal y Cuenta"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
