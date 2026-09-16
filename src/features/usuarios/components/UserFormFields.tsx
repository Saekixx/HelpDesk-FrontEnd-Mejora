/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ROLE_IDS, UpdateUserFormValues } from "../schemas/user-form.schema";

interface Option {
  value: number | string;
  label: string;
  [key: string]: any;
}

interface UserFormFieldsProps {
  form: UseFormReturn<UpdateUserFormValues>;
  rolesOptions: Option[];
  clientesOptions: Option[];
  sucursalesOptions: Option[];
  areasOptions: Option[];
  onClienteChange: (id: number | null) => void;
  onSucursalChange: (id: number | null) => void;
  isLoadingCatalogs?: boolean;
}

export const UserFormFields = ({
  form,
  rolesOptions,
  clientesOptions,
  sucursalesOptions,
  areasOptions,
  onClienteChange,
  onSucursalChange,
  isLoadingCatalogs,
}: UserFormFieldsProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedRoleId = watch("id_rol");
  const selectedClienteId = watch("id_cliente");
  const selectedSucursalId = watch("id_sucursal");

  // Deduplicación estricta basada en el texto visible del label
  const normalizeOptions = (opts: any[]) => {
    if (!Array.isArray(opts)) return [];

    const seenLabels = new Set<string>();
    const result: { value: number; label: string }[] = [];

    opts.forEach((opt) => {
      const rawVal =
        opt.id_rol ??
        opt.id_cliente ??
        opt.id_sucursal ??
        opt.id_area ??
        opt.value ??
        opt.id;

      const rawLabel = opt.nombre ?? opt.razon_social ?? opt.label ?? "";

      const value = Number(rawVal);
      const label = String(rawLabel).trim();
      const normalizedKey = label.toLowerCase();

      if (!isNaN(value) && label && !seenLabels.has(normalizedKey)) {
        seenLabels.add(normalizedKey);
        result.push({ value, label });
      }
    });

    return result;
  };

  const normalizedRoles = normalizeOptions(rolesOptions);
  const normalizedClientes = normalizeOptions(clientesOptions);
  const normalizedSucursales = normalizeOptions(sucursalesOptions);
  const normalizedAreas = normalizeOptions(areasOptions);

  const showCliente = (
    [
      ROLE_IDS.CLIENTE_EMPRESA,
      ROLE_IDS.CLIENTE_SUCURSAL,
      ROLE_IDS.CLIENTE_TRABAJADOR,
    ] as number[]
  ).includes(selectedRoleId);

  const showSucursal = (
    [ROLE_IDS.CLIENTE_SUCURSAL, ROLE_IDS.CLIENTE_TRABAJADOR] as number[]
  ).includes(selectedRoleId);

  const showArea = selectedRoleId === ROLE_IDS.CLIENTE_TRABAJADOR;

  return (
    <div className="space-y-3.5">
      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">Nombre</Label>
          <Input
            className="h-10 text-sm"
            placeholder="Ej: Daniel"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="text-xs text-red-500">{errors.nombre.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">
            Apellido
          </Label>
          <Input
            className="h-10 text-sm"
            placeholder="Ej: Singer"
            {...register("apellido")}
          />
          {errors.apellido && (
            <p className="text-xs text-red-500">{errors.apellido.message}</p>
          )}
        </div>
      </div>

      {/* Correo */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">Correo</Label>
        <Input
          type="email"
          className="h-10 text-sm"
          placeholder="correo@empresa.com"
          {...register("correo")}
        />
        {errors.correo && (
          <p className="text-xs text-red-500">{errors.correo.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">Teléfono</Label>
        <Input
          className="h-10 text-sm"
          placeholder="987654321"
          {...register("telefono")}
        />
      </div>

      {/* Rol */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">Rol</Label>
        <Select
          value={selectedRoleId ? String(selectedRoleId) : ""}
          onValueChange={(val) => {
            const roleId = Number(val);
            setValue("id_rol", roleId, { shouldValidate: true });
            setValue("id_cliente", null);
            setValue("id_sucursal", null);
            setValue("id_area", null);
            onClienteChange(null);
          }}
        >
          <SelectTrigger className="w-full h-10 text-sm bg-white">
            <SelectValue placeholder="Seleccione un rol">
              {normalizedRoles.find((r) => r.value === selectedRoleId)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {normalizedRoles.map((r) => (
              <SelectItem key={`${r.value}-${r.label}`} value={String(r.value)}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.id_rol && (
          <p className="text-xs text-red-500">{errors.id_rol.message}</p>
        )}
      </div>

      {/* Empresa */}
      {showCliente && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">Empresa</Label>
          <Select
            value={selectedClienteId ? String(selectedClienteId) : ""}
            onValueChange={(val) => {
              const clienteId = Number(val);
              setValue("id_cliente", clienteId, { shouldValidate: true });
              setValue("id_sucursal", null);
              setValue("id_area", null);
              onClienteChange(clienteId);
            }}
          >
            <SelectTrigger className="w-full h-10 text-sm bg-white">
              <SelectValue placeholder="Seleccione Empresa">
                {
                  normalizedClientes.find((c) => c.value === selectedClienteId)
                    ?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {normalizedClientes.map((c) => (
                <SelectItem
                  key={`${c.value}-${c.label}`}
                  value={String(c.value)}
                >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_cliente && (
            <p className="text-xs text-red-500">{errors.id_cliente.message}</p>
          )}
        </div>
      )}

      {/* Sucursal y Área */}
      {(showSucursal || showArea) && (
        <div className={showArea ? "grid grid-cols-2 gap-3" : "space-y-1.5"}>
          {showSucursal && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Sucursal
              </Label>
              <Select
                disabled={!selectedClienteId || isLoadingCatalogs}
                value={selectedSucursalId ? String(selectedSucursalId) : ""}
                onValueChange={(val) => {
                  const sucursalId = Number(val);
                  setValue("id_sucursal", sucursalId, { shouldValidate: true });
                  setValue("id_area", null);
                  onSucursalChange(sucursalId);
                }}
              >
                <SelectTrigger className="w-full h-10 text-sm bg-white">
                  <SelectValue placeholder="Seleccione Sucursal">
                    {
                      normalizedSucursales.find(
                        (s) => s.value === selectedSucursalId,
                      )?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {normalizedSucursales.map((s) => (
                    <SelectItem
                      key={`${s.value}-${s.label}`}
                      value={String(s.value)}
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_sucursal && (
                <p className="text-xs text-red-500">
                  {errors.id_sucursal.message}
                </p>
              )}
            </div>
          )}

          {showArea && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Área
              </Label>
              <Select
                disabled={!selectedSucursalId || isLoadingCatalogs}
                value={watch("id_area") ? String(watch("id_area")) : ""}
                onValueChange={(val) =>
                  setValue("id_area", Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full h-10 text-sm bg-white">
                  <SelectValue placeholder="Seleccione Área">
                    {
                      normalizedAreas.find((a) => a.value === watch("id_area"))
                        ?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {normalizedAreas.map((a) => (
                    <SelectItem
                      key={`${a.value}-${a.label}`}
                      value={String(a.value)}
                    >
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_area && (
                <p className="text-xs text-red-500">{errors.id_area.message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
