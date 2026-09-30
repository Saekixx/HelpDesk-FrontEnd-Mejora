import React, { useState } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { EquipoFormValues } from "../schemas/equipo.schema";
import { SelectOption } from "@/shared/types/select-option.types";

interface EquipoFormFieldsProps {
  control: Control<EquipoFormValues>;
  setValue?: UseFormSetValue<EquipoFormValues>;
  clientesOptions?: SelectOption<number>[];
  sucursalesOptions?: SelectOption<number>[];
  areasOptions?: SelectOption<number>[];
  trabajadoresOptions?: SelectOption<number>[];
  loadingCatalogos?: {
    clientes?: boolean;
    sucursales?: boolean;
    areas?: boolean;
    trabajadores?: boolean;
  };
}

export const EquipoFormFields: React.FC<EquipoFormFieldsProps> = ({
  control,
  setValue,
  clientesOptions = [],
  sucursalesOptions = [],
  areasOptions = [],
  trabajadoresOptions = [],
  loadingCatalogos,
}) => {
  const [openTrabajadorPopover, setOpenTrabajadorPopover] = useState(false);

  return (
    <div className="space-y-4">
      {/* Nombre / Identificador del equipo */}
      <FormField
        control={control}
        name="nombre_usuario"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre / Modelo / Referencia</FormLabel>
            <FormControl>
              <Input
                placeholder="Ej. Dell Precision 5570 - Carlos Ruiz"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Empresa / Cliente y Sucursal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Empresa / Cliente */}
        <FormField
          control={control}
          name="id_cliente"
          render={({ field }) => {
            const selected = clientesOptions.find(
              (opt) => opt.value === field.value,
            );
            return (
              <FormItem>
                <FormLabel>Empresa / Cliente *</FormLabel>
                <Select
                  onValueChange={(val) => {
                    const numVal = Number(val);
                    field.onChange(numVal);
                    if (setValue) {
                      setValue("id_sucursal", undefined as any);
                      setValue("id_area", null);
                      setValue("id_trabajador", null);
                    }
                  }}
                  value={field.value ? String(field.value) : undefined}
                  disabled={loadingCatalogos?.clientes}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCatalogos?.clientes
                            ? "Cargando..."
                            : "Seleccionar cliente"
                        }
                      >
                        {selected?.label}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientesOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Sucursal */}
        <FormField
          control={control}
          name="id_sucursal"
          render={({ field }) => {
            const selected = sucursalesOptions.find(
              (opt) => opt.value === field.value,
            );
            return (
              <FormItem>
                <FormLabel>Sucursal *</FormLabel>
                <Select
                  onValueChange={(val) => {
                    const numVal = Number(val);
                    field.onChange(numVal);
                    if (setValue) {
                      setValue("id_area", null);
                      setValue("id_trabajador", null);
                    }
                  }}
                  value={field.value ? String(field.value) : undefined}
                  disabled={
                    loadingCatalogos?.sucursales ||
                    sucursalesOptions.length === 0
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCatalogos?.sucursales
                            ? "Cargando..."
                            : sucursalesOptions.length === 0
                              ? "Seleccione cliente primero"
                              : "Seleccionar sucursal"
                        }
                      >
                        {selected?.label}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sucursalesOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
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

      {/* Área y Tipo de equipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Área */}
        <FormField
          control={control}
          name="id_area"
          render={({ field }) => {
            const selected = areasOptions.find(
              (opt) => opt.value === field.value,
            );
            return (
              <FormItem>
                <FormLabel>Área (opcional)</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val ? Number(val) : null);
                    if (setValue) {
                      setValue("id_trabajador", null);
                    }
                  }}
                  value={field.value ? String(field.value) : undefined}
                  disabled={
                    loadingCatalogos?.areas || areasOptions.length === 0
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCatalogos?.areas
                            ? "Cargando..."
                            : areasOptions.length === 0
                              ? "Sin áreas disponibles"
                              : "Sin área"
                        }
                      >
                        {selected?.label}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {areasOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Tipo de equipo */}
        <FormField
          control={control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de equipo *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                  <SelectItem value="All-in-One">All-in-One</SelectItem>
                  <SelectItem value="Servidor">Servidor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Marca y Número de Serie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="marca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca *</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Dell, HP, Apple..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="num_serie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de serie *</FormLabel>
              <FormControl>
                <Input placeholder="Ej. DL5570-2023-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Trabajador asignado con Combobox / Buscador */}
      <FormField
        control={control}
        name="id_trabajador"
        render={({ field }) => {
          const selectedTrabajador = trabajadoresOptions.find(
            (opt) => opt.value === field.value,
          );

          return (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Trabajador asignado (opcional)</FormLabel>
              <Popover
                open={openTrabajadorPopover}
                onOpenChange={setOpenTrabajadorPopover}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openTrabajadorPopover}
                      className={cn(
                        "w-full justify-between font-normal rounded-md border",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={loadingCatalogos?.trabajadores}
                    >
                      <span className="truncate">
                        {loadingCatalogos?.trabajadores
                          ? "Cargando trabajadores..."
                          : selectedTrabajador
                            ? selectedTrabajador.label
                            : "Buscar o seleccionar trabajador..."}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {field.value && (
                          <X
                            className="h-4 w-4 opacity-50 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(null);
                            }}
                          />
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="p-0" align="start">
                  <Command className="w-full border-none shadow-none">
                    <CommandInput
                      placeholder="Buscar por nombre o correo..."
                      className="h-9 border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                    />
                    <CommandList className="max-h-[200px] overflow-y-auto">
                      <CommandEmpty className="py-2 text-center text-sm">
                        No se encontraron trabajadores.
                      </CommandEmpty>
                      <CommandGroup>
                        {trabajadoresOptions.map((opt) => (
                          <CommandItem
                            key={opt.value}
                            value={opt.label}
                            onSelect={() => {
                              field.onChange(opt.value);
                              setOpenTrabajadorPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                opt.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {opt.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
