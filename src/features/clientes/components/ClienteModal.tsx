/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  Control,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { TipoCliente } from "../types/cliente.entity";
import { ClienteDetail } from "../types/cliente.response";
import {
  clienteFormSchema,
  ClienteFormValues,
} from "../schemas/cliente.schema";
import { ClienteFormFields } from "./ClienteFormFields";
import { SelectOption } from "@/shared/types/select-option.types";

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteEditar?: ClienteDetail | null;
  planesOptions?: SelectOption<number>[];
  // Recibimos las funciones y el estado de carga desde la Page
  onCreate: (data: any) => Promise<any>;
  onUpdate: (id: number, data: any) => Promise<any>;
  isSubmitting?: boolean;
}

export const ClienteModal: React.FC<ClienteModalProps> = ({
  isOpen,
  onClose,
  clienteEditar,
  planesOptions = [],
  onCreate,
  onUpdate,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(clienteEditar);

  const form = useForm<
    z.input<typeof clienteFormSchema>,
    unknown,
    z.output<typeof clienteFormSchema>
  >({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: {
      tipo_cliente: TipoCliente.JURIDICA,
      numero_documento: "",
      nombre_principal: "",
      direccion: "",
      telefono: "",
      correo: "",
      rubro: "",
      id_plan: undefined,
      sucursal_principal: {
        nombre: "",
        encargado: "",
        telefono: "",
        correo: "",
        direccion: "",
      },
      sucursales_adicionales: [],
    },
  });

  const { reset, handleSubmit, control, watch, setValue } = form;

  useEffect(() => {
    if (isOpen) {
      if (clienteEditar) {
        reset({
          tipo_cliente: clienteEditar.tipo_cliente,
          numero_documento: clienteEditar.numero_documento || "",
          nombre_principal: clienteEditar.nombre_principal || "",
          direccion: clienteEditar.direccion || "",
          telefono: clienteEditar.telefono || "",
          correo: clienteEditar.correo || "",
          rubro: clienteEditar.rubro || "",
          id_plan: clienteEditar.id_plan || undefined,
          sucursal_principal: {
            nombre: clienteEditar.sucursales?.[0]?.nombre || "",
            encargado: clienteEditar.sucursales?.[0]?.encargado || "",
            telefono: clienteEditar.sucursales?.[0]?.telefono || "",
            correo: clienteEditar.sucursales?.[0]?.correo || "",
            direccion: clienteEditar.sucursales?.[0]?.direccion || "",
          },
          sucursales_adicionales: [],
        });
      } else {
        reset({
          tipo_cliente: TipoCliente.JURIDICA,
          numero_documento: "",
          nombre_principal: "",
          direccion: "",
          telefono: "",
          correo: "",
          rubro: "",
          id_plan: undefined,
          sucursal_principal: {
            nombre: "",
            encargado: "",
            telefono: "",
            correo: "",
            direccion: "",
          },
          sucursales_adicionales: [],
        });
      }
    }
  }, [isOpen, clienteEditar, reset]);

  const onSubmit: SubmitHandler<ClienteFormValues> = async (values) => {
    const sucursalesAdicionalesFormateadas =
      values.tipo_cliente === TipoCliente.JURIDICA
        ? (values.sucursales_adicionales || []).map((suc) => ({
            nombre: suc.nombre || "",
            encargado: suc.encargado || "",
            telefono: suc.telefono || "",
            correo: suc.correo || "",
            direccion: suc.direccion || "",
          }))
        : [];

    const sucursalPrincipalFormateada = {
      nombre: values.sucursal_principal?.nombre || "",
      encargado: values.sucursal_principal?.encargado || "",
      telefono: values.sucursal_principal?.telefono || "",
      correo: values.sucursal_principal?.correo || "",
      direccion: values.sucursal_principal?.direccion || "",
    };

    const payload = {
      tipo_cliente: values.tipo_cliente,
      numero_documento: values.numero_documento,
      nombre_principal: values.nombre_principal,
      direccion: values.direccion,
      telefono: values.telefono,
      correo: values.correo,
      rubro: values.rubro || "",
      fecha_inicio_plan: values.fecha_inicio_plan || new Date().toISOString(),
      fecha_finalizacion_plan:
        values.fecha_finalizacion_plan || new Date().toISOString(),
      costo_negociado: values.costo_negociado || 0,
      limite_equipos_contratado: values.limite_equipos_contratado || 0,
      id_plan: values.id_plan ? Number(values.id_plan) : 1,
      sucursal_principal: sucursalPrincipalFormateada,
      sucursales_adicionales: sucursalesAdicionalesFormateadas,
    };

    if (isEditing && clienteEditar) {
      await onUpdate(clienteEditar.id_cliente, payload);
    } else {
      await onCreate(payload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[800px] !w-[90vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Editar empresa" : "Nueva empresa"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <ClienteFormFields
              control={control as unknown as Control<ClienteFormValues>}
              watch={watch as unknown as UseFormWatch<ClienteFormValues>}
              setValue={
                setValue as unknown as UseFormSetValue<ClienteFormValues>
              }
              planesOptions={planesOptions}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting
                  ? "Guardando..."
                  : isEditing
                    ? "Guardar cambios"
                    : "Crear empresa"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
