import React, { useEffect } from "react";
import {
  Control,
  UseFormWatch,
  UseFormSetValue,
  useFieldArray,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { TipoCliente } from "../types/cliente.entity";
import { ClienteFormValues } from "../schemas/cliente.schema";
import { SelectOption } from "@/shared/types/select-option.types";

interface ClienteFormFieldsProps {
  control: Control<ClienteFormValues>;
  watch: UseFormWatch<ClienteFormValues>;
  setValue: UseFormSetValue<ClienteFormValues>;
  planesOptions?: SelectOption<number>[];
}

export const ClienteFormFields: React.FC<ClienteFormFieldsProps> = ({
  control,
  watch,
  setValue,
  planesOptions = [],
}) => {
  const tipoCliente = watch("tipo_cliente");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sucursales_adicionales",
  });

  useEffect(() => {
    if (tipoCliente === TipoCliente.NATURAL && fields.length > 0) {
      setValue("sucursales_adicionales", []);
    }
  }, [tipoCliente, setValue, fields.length]);

  return (
    <div className="space-y-6">
      {/* SECCIÓN: Datos de la empresa */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
          Datos de la empresa
        </h3>

        <FormField
          control={control}
          name="tipo_cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de cliente</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TipoCliente.JURIDICA}>
                    Jurídica (empresa)
                  </SelectItem>
                  <SelectItem value={TipoCliente.NATURAL}>
                    Natural (persona)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="numero_documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {tipoCliente === TipoCliente.JURIDICA
                    ? "RUC (11 dígitos)"
                    : "DNI (8 dígitos)"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      tipoCliente === TipoCliente.JURIDICA
                        ? "20XXXXXXXXX"
                        : "XXXXXXXX"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="nombre_principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre / Razón social</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre completo o razón social"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Av. Ejemplo 123, Ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="01-000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contacto@empresa.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="rubro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rubro (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Tecnología, Logística..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="id_plan"
            render={({ field }) => {
              const selectedOption = planesOptions.find(
                (plan) => plan.value === field.value,
              );

              return (
                <FormItem>
                  <FormLabel>Plan (opcional)</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plan">
                          {selectedOption?.label}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {planesOptions.map((plan) => (
                        <SelectItem key={plan.value} value={String(plan.value)}>
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>

      {/* SECCIÓN: Sucursal Principal */}
      <div className="space-y-4 pt-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">
            Sucursal principal {tipoCliente === TipoCliente.JURIDICA && "*"}
          </h3>
          {tipoCliente === TipoCliente.NATURAL && (
            <p className="text-xs text-gray-500">
              Si dejas estos campos vacíos, se crea automáticamente con valores
              por defecto.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="sucursal_principal.nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Sucursal Principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sucursal_principal.encargado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encargado</FormLabel>
                <FormControl>
                  <Input placeholder="Por Asignar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="sucursal_principal.telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="01-000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sucursal_principal.correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="sucursal@empresa.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="sucursal_principal.direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Av. Principal 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* SECCIÓN: Sucursales Adicionales */}
      {tipoCliente === TipoCliente.JURIDICA && (
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Sucursales adicionales
            </h3>
            <p className="text-xs text-gray-500">
              Cada una se crea como una sucursal independiente ligada a esta
              empresa.
            </p>
          </div>

          {fields.length === 0 ? (
            <p className="text-sm text-center text-gray-400 py-4">
              No has agregado sucursales adicionales.
            </p>
          ) : (
            fields.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg bg-gray-50/50 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Sucursal #{index + 2}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`sucursales_adicionales.${index}.nombre`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Sucursal Norte" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`sucursales_adicionales.${index}.encargado`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Encargado</FormLabel>
                        <FormControl>
                          <Input placeholder="Por Asignar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`sucursales_adicionales.${index}.telefono`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="01-000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`sucursales_adicionales.${index}.correo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="sucursal@empresa.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`sucursales_adicionales.${index}.direccion`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Av. Sur 456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))
          )}

          <Button
            type="button"
            variant="outline"
            className="border-dashed border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            onClick={() =>
              append({
                nombre: "",
                encargado: "",
                telefono: "",
                correo: "",
                direccion: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" /> Nueva sucursal
          </Button>
        </div>
      )}
    </div>
  );
};
