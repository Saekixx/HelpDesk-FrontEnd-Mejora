import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  UserCheck,
  AlertTriangle,
  KeyRound,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UsuarioItem } from "@/types/usuario/usuario.types";
import { UsuarioRequest } from "@/types/usuario/usuario.request.type";
import { useUsuarioMutations } from "@/shared/hooks/usuario/useUsuarioMutations";
import {
  UsuarioFormData,
  usuarioSchema,
} from "@/schema/usuario/usuario.schema";
import { SelectOption } from "@/shared/types/select-option.types";

interface UsuarioFormProps {
  usuarioToEdit?: (UsuarioItem & { zonas_ids?: number[] }) | null;
  onSuccess: () => void;
  onClose: () => void;
  roles?: SelectOption[];
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  areas?: SelectOption[];
  zonas?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
  onSucursalChange?: (sucursalId: string | number) => void;
  onFormValuesChange?: (values: {
    nombre: string;
    apellido: string;
    rolName: string;
  }) => void;
}

export const UsuarioForm = ({
  usuarioToEdit,
  onSuccess,
  onClose,
  roles = [],
  clientes = [],
  sucursales = [],
  areas = [],
  zonas = [],
  onClienteChange,
  onSucursalChange,
  onFormValuesChange,
}: UsuarioFormProps) => {
  const isEditing = Boolean(usuarioToEdit);
  const [resetPassword, setResetPassword] = React.useState(false);
  const { crearUsuario, actualizarUsuario, isSubmitting } =
    useUsuarioMutations();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      id_rol: "",
      id_cliente: "",
      id_sucursal: "",
      id_area: "",
      id_zona: "",
      zonas_ids: [],
    } as any,
  });

  const selectedRolId = watch("id_rol");
  const selectedClienteId = watch("id_cliente");
  const selectedSucursalId = watch("id_sucursal");
  const nombreWatch = watch("nombre");
  const apellidoWatch = watch("apellido");

  // Rellenar o resetear formulario con conversión robusta a string
  React.useEffect(() => {
    if (usuarioToEdit) {
      reset({
        nombre: usuarioToEdit.nombre || "",
        apellido: usuarioToEdit.apellido || "",
        correo: usuarioToEdit.correo || "",
        telefono: usuarioToEdit.telefono || "",
        id_rol:
          usuarioToEdit.id_rol != null ? String(usuarioToEdit.id_rol) : "",
        id_cliente:
          usuarioToEdit.id_cliente != null
            ? String(usuarioToEdit.id_cliente)
            : "",
        id_sucursal:
          usuarioToEdit.id_sucursal != null
            ? String(usuarioToEdit.id_sucursal)
            : "",
        id_area:
          usuarioToEdit.id_area != null ? String(usuarioToEdit.id_area) : "",
        id_zona:
          usuarioToEdit.zonas_ids?.[0] != null
            ? String(usuarioToEdit.zonas_ids[0])
            : "",
        zonas_ids: usuarioToEdit.zonas_ids || [],
      } as any);

      if (usuarioToEdit.id_cliente && onClienteChange) {
        onClienteChange(usuarioToEdit.id_cliente);
      }
      if (usuarioToEdit.id_sucursal && onSucursalChange) {
        onSucursalChange(usuarioToEdit.id_sucursal);
      }
    } else {
      reset({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        id_rol: "",
        id_cliente: "",
        id_sucursal: "",
        id_area: "",
        id_zona: "",
        zonas_ids: [],
      } as any);
    }
    setResetPassword(false);
  }, [usuarioToEdit, reset, onClienteChange, onSucursalChange]);

  const selectedRolObj = roles.find(
    (r) => String(r.value) === String(selectedRolId),
  );
  const rolName = (
    selectedRolObj?.label ||
    usuarioToEdit?.nombre_rol ||
    ""
  ).toUpperCase();

  const isInSitu = rolName.includes("INSITU") || rolName.includes("IN_SITU");

  React.useEffect(() => {
    if (onFormValuesChange) {
      onFormValuesChange({
        nombre: nombreWatch,
        apellido: apellidoWatch,
        rolName,
      });
    }
  }, [nombreWatch, apellidoWatch, rolName, onFormValuesChange]);

  const onSubmit = async (data: any) => {
    try {
      const payload: UsuarioRequest = {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono || "",
        id_rol: Number(data.id_rol),
        id_cliente: data.id_cliente ? Number(data.id_cliente) : null,
        id_sucursal: data.id_sucursal ? Number(data.id_sucursal) : null,
        id_area: data.id_area ? Number(data.id_area) : null,
        zonas_ids: isInSitu
          ? (data.zonas_ids || []).map(Number)
          : data.id_zona
            ? [Number(data.id_zona)]
            : [],
      };

      if (isEditing && usuarioToEdit) {
        await actualizarUsuario(usuarioToEdit.id_usuario, {
          ...payload,
          resetPassword,
        });
      } else {
        await crearUsuario(payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al procesar el usuario:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("nombre")}
            placeholder="Ej. Jack"
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
            Apellido <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("apellido")}
            placeholder="Ej. Leandro"
            className="h-10 text-xs"
          />
          {errors.apellido && (
            <p className="text-[11px] text-red-500 font-semibold">
              {errors.apellido.message}
            </p>
          )}
        </div>
      </div>

      {/* Correo y Teléfono */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Correo Electrónico Corporativo{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            {...register("correo")}
            placeholder="usuario@empresa.com"
            className="h-10 text-xs"
          />
          {errors.correo && (
            <p className="text-[11px] text-red-500 font-semibold">
              {errors.correo.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">
            Teléfono / Celular
          </Label>
          <Input
            {...register("telefono")}
            placeholder="+51 987 654 321"
            className="h-10 text-xs"
          />
          {errors.telefono && (
            <p className="text-[11px] text-red-500 font-semibold">
              {errors.telefono.message}
            </p>
          )}
        </div>
      </div>

      {/* Rol del Sistema */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold text-slate-700">
            Perfil & Rol del Sistema <span className="text-red-500">*</span>
          </Label>
          <span className="text-[11px] text-slate-400 font-medium">
            Ajusta los accesos del módulo
          </span>
        </div>
        <Controller
          name="id_rol"
          control={control}
          render={({ field }) => {
            const currentRolLabel = roles.find(
              (r) => String(r.value) === String(field.value),
            )?.label;
            return (
              <Select
                value={field.value != null ? String(field.value) : ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="h-10 text-xs font-semibold bg-white">
                  <SelectValue placeholder="Selecciona el rol de acceso...">
                    {currentRolLabel ||
                      (isEditing && field.value
                        ? `Cargando... (${field.value})`
                        : undefined)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem
                      key={String(rol.value)}
                      value={String(rol.value)}
                      className="text-xs font-medium"
                    >
                      {rol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.id_rol && (
          <p className="text-[11px] text-red-500 font-semibold">
            {errors.id_rol.message}
          </p>
        )}
      </div>

      {/* CAMPOS CONTEXTUALES SEGÚN ROL */}
      <div className="p-4 rounded-xl bg-orange-50/40 border border-orange-100 space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#ff5722] uppercase tracking-wider">
          <UserCheck className="h-3.5 w-3.5" />
          <span>Campos contextuales según el rol seleccionado:</span>
        </div>

        {/* Administrador / Soporte Técnico Puro */}
        {(rolName.includes("ADMINISTRADOR") ||
          (rolName.includes("SOPORTE_TECNICO") && !isInSitu)) && (
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-800 font-medium flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Este rol no requiere vinculación jerárquica con clientes finales;
              opera transversalmente en el HelpDesk.
            </span>
          </div>
        )}

        {/* Soporte In-Situ (Zonas Múltiples) */}
        {isInSitu && (
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-xs font-bold text-slate-700">
              Zonas / Cuadrillas Asignadas (Múltiple){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="zonas_ids"
              control={control}
              render={({ field }) => {
                const selectedZonas = Array.isArray(field.value)
                  ? field.value
                  : [];
                const selectedLabels = zonas
                  .filter((z) =>
                    selectedZonas.map(String).includes(String(z.value)),
                  )
                  .map((z) => z.label);

                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        role="combobox"
                        tabIndex={0}
                        aria-expanded="false"
                        className="flex h-auto min-h-[40px] w-full items-center justify-between rounded-md border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400"
                      >
                        <div className="flex flex-wrap gap-1 items-center">
                          {selectedLabels.length > 0 ? (
                            selectedLabels.map((label, idx) => (
                              <span
                                key={idx}
                                className="bg-orange-100 text-[#ff5722] px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1"
                              >
                                {label}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 font-normal">
                              Selecciona zonas operativas...
                            </span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[450px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Buscar zona..."
                          className="text-xs"
                        />
                        <CommandList>
                          <CommandEmpty>No se encontraron zonas.</CommandEmpty>
                          <CommandGroup>
                            {zonas.map((z) => {
                              const isSelected = selectedZonas
                                .map(String)
                                .includes(String(z.value));
                              return (
                                <CommandItem
                                  key={String(z.value)}
                                  value={z.label}
                                  onSelect={() => {
                                    const current = [...selectedZonas];
                                    if (isSelected) {
                                      field.onChange(
                                        current.filter(
                                          (item) =>
                                            String(item) !== String(z.value),
                                        ),
                                      );
                                    } else {
                                      field.onChange([...current, z.value]);
                                    }
                                  }}
                                  className="text-xs cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 text-[#ff5722]",
                                      isSelected ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {z.label}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>
        )}

        {/* Roles de Clientes (EMPRESA, SUCURSAL, TRABAJADOR) */}
        {(rolName.includes("CLIENTE") ||
          rolName.includes("EMPRESA") ||
          rolName.includes("SUCURSAL") ||
          rolName.includes("TRABAJADOR")) && (
          <div className="space-y-3">
            {/* Empresa */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Empresa Contratante <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="id_cliente"
                control={control}
                render={({ field }) => {
                  const currentClientLabel = clientes.find(
                    (c) => String(c.value) === String(field.value),
                  )?.label;
                  return (
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("id_sucursal", "");
                        setValue("id_area", "");
                        setValue("id_zona", "");
                        if (onClienteChange && val !== null)
                          onClienteChange(val);
                      }}
                    >
                      <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                        <SelectValue placeholder="Selecciona empresa...">
                          {currentClientLabel ||
                            (isEditing && field.value
                              ? `Cargando... (${field.value})`
                              : undefined)}
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

            {/* Sucursal (SÓLO para SUCURSAL y TRABAJADOR) */}
            {selectedClienteId && !rolName.includes("CLIENTE_EMPRESA") && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Sucursal / Sede <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="id_sucursal"
                  control={control}
                  render={({ field }) => {
                    const currentSucursalLabel = sucursales.find(
                      (s) => String(s.value) === String(field.value),
                    )?.label;
                    return (
                      <Select
                        value={field.value != null ? String(field.value) : ""}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setValue("id_area", "");
                          if (onSucursalChange && val !== null)
                            onSucursalChange(val);
                        }}
                      >
                        <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                          <SelectValue placeholder="Selecciona sucursal...">
                            {currentSucursalLabel ||
                              (isEditing && field.value
                                ? `Cargando... (${field.value})`
                                : undefined)}
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

            {/* Zona para el rol Sucursal (Selección Única) */}
            {selectedSucursalId && rolName.includes("SUCURSAL") && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Zona Geográfica / Operativa{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="id_zona"
                  control={control}
                  render={({ field }) => {
                    const currentZonaLabel = zonas.find(
                      (z) => String(z.value) === String(field.value),
                    )?.label;
                    return (
                      <Select
                        value={field.value != null ? String(field.value) : ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                          <SelectValue placeholder="Selecciona zona...">
                            {currentZonaLabel ||
                              (isEditing && field.value
                                ? `Cargando... (${field.value})`
                                : undefined)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {zonas.map((z) => (
                            <SelectItem
                              key={String(z.value)}
                              value={String(z.value)}
                              className="text-xs font-medium"
                            >
                              {z.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
            )}

            {/* Área (SÓLO para el rol TRABAJADOR) */}
            {selectedSucursalId && rolName.includes("TRABAJADOR") && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Área / Departamento <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="id_area"
                  control={control}
                  render={({ field }) => {
                    const currentAreaLabel = areas.find(
                      (a) => String(a.value) === String(field.value),
                    )?.label;
                    return (
                      <Select
                        value={field.value != null ? String(field.value) : ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 text-xs bg-white font-semibold">
                          <SelectValue placeholder="Selecciona área...">
                            {currentAreaLabel ||
                              (isEditing && field.value
                                ? `Cargando... (${field.value})`
                                : undefined)}
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
          </div>
        )}
      </div>

      {/* Seguridad en Edición */}
      {isEditing && (
        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">
              <span className="font-bold block text-amber-950 mb-0.5">
                Advertencia de Seguridad
              </span>
              Restablecer la contraseña generará una nueva credencial segura por
              defecto y enviará un correo de recuperación.
            </div>
          </div>

          <label
            htmlFor="resetPasswordCheck"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <Label
                  htmlFor="resetPasswordCheck"
                  className="text-xs font-bold text-slate-900 cursor-pointer"
                >
                  Restablecer contraseña
                </Label>
                <p className="text-[11px] text-slate-500 font-medium">
                  Genera y envía un token de recuperación inmediatamente.
                </p>
              </div>
            </div>
            <Checkbox
              id="resetPasswordCheck"
              checked={resetPassword}
              onCheckedChange={(checked) => setResetPassword(Boolean(checked))}
              className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#ff5722] data-[state=checked]:border-[#ff5722]"
            />
          </label>
        </div>
      )}

      {/* Botones de acción */}
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
              ? "Actualizar Usuario"
              : "Guardar Usuario"}
        </Button>
      </div>
    </form>
  );
};
