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
import { Building2, Mail, Loader2 } from "lucide-react";
import { ClienteDetail } from "@/types/cliente/cliente.types";
import {
  clienteSchema,
  ClienteFormData,
} from "@/schema/cliente/cliente.schema";
import { SelectOption } from "@/shared/types/select-option.types";
import { useClienteMutations } from "@/hooks/cliente/useClienteMutations";
import { toast } from "sonner";

interface ClienteFormProps {
  clienteToEdit?: ClienteDetail | null;
  onSuccess: () => void;
  onClose: () => void;
  planes?: SelectOption[];
  onFormValuesChange?: (values: {
    nombre_principal: string;
    tipo_cliente: string;
  }) => void;
}

export const ClienteForm = ({
  clienteToEdit,
  onSuccess,
  onClose,
  planes = [],
  onFormValuesChange,
}: ClienteFormProps) => {
  const isEditing = Boolean(clienteToEdit);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);

  const { crearCliente, actualizarCliente, isSubmitting } =
    useClienteMutations();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(
      clienteSchema,
    ) as unknown as Resolver<ClienteFormData>,
    defaultValues: {
      tipo_cliente: "JURIDICA",
      numero_documento: "",
      nombre_principal: "",
      direccion: "",
      telefono: "",
      correo: "",
      rubro: "",
      id_plan: undefined,
      is_active: true,
      sucursal_principal: {
        nombre: "",
        encargado_nombre: "",
        encargado_apellido: "",
        telefono: "",
        correo: "",
        direccion: "",
      },
    },
  });

  const nombreWatch = watch("nombre_principal");
  const tipoClienteWatch = watch("tipo_cliente");

  // Rellenar o resetear formulario al abrir/editar
  React.useEffect(() => {
    if (clienteToEdit) {
      reset({
        tipo_cliente: clienteToEdit.tipo_cliente || "JURIDICA",
        numero_documento: clienteToEdit.numero_documento || "",
        nombre_principal: clienteToEdit.nombre_principal || "",
        direccion: clienteToEdit.direccion || "",
        telefono: clienteToEdit.telefono || "",
        correo: clienteToEdit.correo || "",
        rubro: clienteToEdit.rubro || "",
        id_plan:
          clienteToEdit.id_plan != null
            ? Number(clienteToEdit.id_plan)
            : undefined,
        is_active: clienteToEdit.is_active ?? true,
        sucursal_principal: {
          nombre: clienteToEdit.sucursales?.[0]?.nombre || "",
          encargado_nombre:
            (clienteToEdit.sucursales?.[0] as any)?.encargado_nombre || "",
          encargado_apellido:
            (clienteToEdit.sucursales?.[0] as any)?.encargado_apellido || "",
          telefono: clienteToEdit.sucursales?.[0]?.telefono || "",
          correo: clienteToEdit.sucursales?.[0]?.correo || "",
          direccion: clienteToEdit.sucursales?.[0]?.direccion || "",
        },
      });
    } else {
      reset({
        tipo_cliente: "JURIDICA",
        numero_documento: "",
        nombre_principal: "",
        direccion: "",
        telefono: "",
        correo: "",
        rubro: "",
        id_plan: undefined,
        is_active: true,
        sucursal_principal: {
          nombre: "",
          encargado_nombre: "",
          encargado_apellido: "",
          telefono: "",
          correo: "",
          direccion: "",
        },
      });
      setStep(1);
    }
  }, [clienteToEdit, reset]);

  React.useEffect(() => {
    if (onFormValuesChange) {
      onFormValuesChange({
        nombre_principal: nombreWatch,
        tipo_cliente: tipoClienteWatch,
      });
    }
  }, [nombreWatch, tipoClienteWatch, onFormValuesChange]);

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    let fieldsToValidate: (keyof ClienteFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = [
        "tipo_cliente",
        "numero_documento",
        "nombre_principal",
        "id_plan",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["telefono", "correo"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  // Función onSubmit adaptada para usar lo ingresado o defaults limpios si están vacíos
  const onSubmit = async (data: ClienteFormData) => {
    try {
      if (isEditing && clienteToEdit) {
        await actualizarCliente(clienteToEdit.id_cliente, {
          nombre_principal: data.nombre_principal,
          numero_documento: data.numero_documento,
          rubro: data.rubro,
          id_plan: Number(data.id_plan),
        });
      } else {
        const encNombre =
          data.sucursal_principal?.encargado_nombre || "Encargado";
        const encApellido =
          data.sucursal_principal?.encargado_apellido || "Principal";

        const payload = {
          datos_empresa: {
            tipo_cliente: data.tipo_cliente,
            numero_documento: data.numero_documento,
            nombre_principal: data.nombre_principal,
            direccion: data.direccion || "",
            rubro: data.rubro || "",
            id_plan: Number(data.id_plan),
          },
          responsable: {
            nombre: encNombre,
            apellido: encApellido,
            cargo: "Gerente de TI",
            telefono: data.telefono,
            correo: data.correo,
          },
          sucursal_principal: {
            nombre_sucursal: data.sucursal_principal?.nombre || "Sede Central",
            encargado: `${encNombre} ${encApellido}`,
            direccion:
              data.sucursal_principal?.direccion || "Dirección principal",
            is_principal: true,
          },
        };

        await crearCliente(payload as any);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error al procesar la empresa cliente:", error);
      toast.error(error?.message || "Ocurrió un error al guardar la empresa.");
    }
  };

  const onError = (errors: any) => {
    console.error("Errores de validación en el formulario:", errors);
    toast.error("Por favor completa los campos obligatorios requeridos.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 pt-2">
      {/* Indicador de Pasos */}
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
            Datos Empresa
          </div>
          <div className="h-0.5 w-8 bg-slate-200" />
          <div
            className={`flex items-center gap-2 text-xs ${step >= 2 ? "text-[#ff5722] font-semibold" : "text-slate-400"}`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white ${step >= 2 ? "bg-[#ff5722]" : "bg-slate-300"}`}
            >
              2
            </span>
            Responsable
          </div>
          <div className="h-0.5 w-8 bg-slate-200" />
          <div
            className={`flex items-center gap-2 text-xs ${step === 3 ? "text-[#ff5722] font-semibold" : "text-slate-400"}`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white ${step === 3 ? "bg-[#ff5722]" : "bg-slate-300"}`}
            >
              3
            </span>
            Sucursal Matriz
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Tipo de Cliente
              </Label>
              <Input
                {...register("tipo_cliente")}
                disabled
                className="h-10 text-xs bg-slate-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {tipoClienteWatch === "NATURAL"
                  ? "DNI o RUC (8 u 11 dígitos) *"
                  : "RUC (11 dígitos) *"}
              </Label>
              <Input
                {...register("numero_documento")}
                className="h-10 text-xs"
              />
              {errors.numero_documento && (
                <p className="text-[11px] text-red-500 font-semibold">
                  {errors.numero_documento.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              {tipoClienteWatch === "NATURAL"
                ? "Nombre de la Persona / Razón Social *"
                : "Razón Social / Nombre Comercial *"}
            </Label>
            <Input {...register("nombre_principal")} className="h-10 text-xs" />
            {errors.nombre_principal && (
              <p className="text-[11px] text-red-500 font-semibold">
                {errors.nombre_principal.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Rubro Comercial / Industria
              </Label>
              <Input {...register("rubro")} className="h-10 text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Plan de Soporte Contratado{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="id_plan"
                control={control}
                render={({ field }) => {
                  const currentLabel = planes.find(
                    (p) => String(p.value) === String(field.value),
                  )?.label;
                  return (
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                        <SelectValue placeholder="Selecciona plan...">
                          {currentLabel || undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {planes.map((p) => (
                          <SelectItem
                            key={String(p.value)}
                            value={String(p.value)}
                            className="text-xs font-medium"
                          >
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.id_plan && (
                <p className="text-[11px] text-red-500 font-semibold">
                  {errors.id_plan.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Tipo de Cliente <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="tipo_cliente"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                          <SelectValue placeholder="Selecciona tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="JURIDICA"
                            className="text-xs font-medium"
                          >
                            PERSONA JURÍDICA (RUC 20)
                          </SelectItem>
                          <SelectItem
                            value="NATURAL"
                            className="text-xs font-medium"
                          >
                            PERSONA NATURAL
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    {tipoClienteWatch === "NATURAL"
                      ? "DNI o RUC *"
                      : "RUC (11 dígitos) *"}
                  </Label>
                  <Input
                    {...register("numero_documento")}
                    placeholder={
                      tipoClienteWatch === "NATURAL"
                        ? "Ej. 45678912 o 10..."
                        : "Ej. 20559382012"
                    }
                    className="h-10 text-xs"
                  />
                  {errors.numero_documento && (
                    <p className="text-[11px] text-red-500 font-semibold">
                      {errors.numero_documento.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  {tipoClienteWatch === "NATURAL"
                    ? "Nombre Completo / Razón Social *"
                    : "Razón Social / Nombre Comercial *"}
                </Label>
                <Input
                  {...register("nombre_principal")}
                  placeholder={
                    tipoClienteWatch === "NATURAL"
                      ? "Ej. Juan Pérez"
                      : "Ej. Soluciones Financieras del Perú S.A."
                  }
                  className="h-10 text-xs"
                />
                {errors.nombre_principal && (
                  <p className="text-[11px] text-red-500 font-semibold">
                    {errors.nombre_principal.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Rubro Comercial / Industria
                  </Label>
                  <Input
                    {...register("rubro")}
                    placeholder="Ej. Tecnología / Banca"
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Plan de Soporte Contratado{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="id_plan"
                    control={control}
                    render={({ field }) => {
                      const currentLabel = planes.find(
                        (p) => String(p.value) === String(field.value),
                      )?.label;
                      return (
                        <Select
                          value={field.value != null ? String(field.value) : ""}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                            <SelectValue placeholder="Selecciona plan...">
                              {currentLabel || undefined}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {planes.map((p) => (
                              <SelectItem
                                key={String(p.value)}
                                value={String(p.value)}
                                className="text-xs font-medium"
                              >
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  {errors.id_plan && (
                    <p className="text-[11px] text-red-500 font-semibold">
                      {errors.id_plan.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800 font-medium flex items-start gap-2.5">
                <Building2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Cuenta Principal Administradora:</strong> Este
                  contacto será el enlace directo para reportes de SLA, alertas
                  críticas y acceso al portal corporativo.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Teléfono Directo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("telefono")}
                    placeholder="+51 984 219 401"
                    className="h-10 text-xs"
                  />
                  {errors.telefono && (
                    <p className="text-[11px] text-red-500 font-semibold">
                      {errors.telefono.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Correo Electrónico de Enlace{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    {...register("correo")}
                    placeholder="roberto.vargas@empresa.pe"
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
                  Dirección Fiscal Completa
                </Label>
                <Input
                  {...register("direccion")}
                  placeholder="Av. República de Panamá 3505, San Isidro"
                  className="h-10 text-xs"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800 font-medium flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Verificación de Cuenta Sucursal:</strong> Se enviará
                  un correo electrónico de verificación a la dirección
                  registrada para activar las credenciales con el rol de
                  sucursal.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/40 border border-orange-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#ff5722] uppercase tracking-wider">
                    Sucursal Principal
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="col-span-1 sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      Nombre de la Sede
                    </Label>
                    <Input
                      {...register("sucursal_principal.nombre")}
                      placeholder="Ej. Sede Central / Sucursal Norte"
                      className="h-10 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      Nombre del Encargado TI
                    </Label>
                    <Input
                      {...register("sucursal_principal.encargado_nombre")}
                      placeholder="Ej. Juan"
                      className="h-10 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      Apellido del Encargado TI
                    </Label>
                    <Input
                      {...register("sucursal_principal.encargado_apellido")}
                      placeholder="Ej. Pérez"
                      className="h-10 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      Teléfono Sede
                    </Label>
                    <Input
                      {...register("sucursal_principal.telefono")}
                      placeholder="+51 912 345 678"
                      className="h-10 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      Correo Sede
                    </Label>
                    <Input
                      {...register("sucursal_principal.correo")}
                      placeholder="sede@empresa.com"
                      className="h-10 text-xs bg-white"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      Dirección Local
                    </Label>
                    <Input
                      {...register("sucursal_principal.direccion")}
                      placeholder="Ej. Av. Los Pinos 456"
                      className="h-10 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic font-medium">
                Podrás registrar sucursales y áreas adicionales más adelante
                desde el Módulo de Sucursales.
              </p>
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
            disabled={isSubmitting}
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

          {!isEditing && step < 3 ? (
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
              className="h-10 px-5 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting
                ? "Guardando..."
                : isEditing
                  ? "Guardar Cambios"
                  : "Guardar Empresa"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
