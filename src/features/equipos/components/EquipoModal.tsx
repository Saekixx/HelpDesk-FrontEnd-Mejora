/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm, SubmitHandler, Control } from "react-hook-form";
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

import { equipoFormSchema, EquipoFormValues } from "../schemas/equipo.schema";
import { EquipoFormFields } from "./EquipoFormFields";
import { SelectOption } from "@/shared/types/select-option.types";

interface EquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipoEditar?: any | null;
  clientesOptions?: SelectOption<number>[];
  sucursalesOptions?: SelectOption<number>[];
  areasOptions?: SelectOption<number>[];
  trabajadoresOptions?: SelectOption<number>[];
  setSelectedClienteId: (id: number | null) => void;
  setSelectedSucursalId: (id: number | null) => void;
  setSelectedAreaId: (id: number | null) => void;
  loadingCatalogos?: {
    clientes: boolean;
    sucursales: boolean;
    areas: boolean;
    trabajadores?: boolean;
  };
  onCreate: (data: any) => Promise<any>;
  onUpdate: (id: number, data: any) => Promise<any>;
  isSubmitting?: boolean;
}

export const EquipoModal: React.FC<EquipoModalProps> = ({
  isOpen,
  onClose,
  equipoEditar,
  clientesOptions = [],
  sucursalesOptions = [],
  areasOptions = [],
  trabajadoresOptions = [],
  setSelectedClienteId,
  setSelectedSucursalId,
  setSelectedAreaId,
  loadingCatalogos,
  onCreate,
  onUpdate,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(equipoEditar);

  const form = useForm<
    z.input<typeof equipoFormSchema>,
    unknown,
    z.output<typeof equipoFormSchema>
  >({
    resolver: zodResolver(equipoFormSchema),
    defaultValues: {
      tipo: "",
      marca: "",
      num_serie: "",
      nombre_usuario: null,
      id_cliente: undefined,
      id_sucursal: undefined,
      id_area: null,
      id_trabajador: null,
      ult_revision: null,
      rev_programada: null,
      is_active: true,
    },
  });

  const { reset, handleSubmit, control, watch, setValue } = form;

  // Escuchamos los cambios de cliente, sucursal y área en el formulario
  const watchedClienteId = watch("id_cliente");
  const watchedSucursalId = watch("id_sucursal");
  const watchedAreaId = watch("id_area");

  useEffect(() => {
    if (watchedClienteId) {
      setSelectedClienteId(Number(watchedClienteId));
    } else {
      setSelectedClienteId(null);
    }
  }, [watchedClienteId, setSelectedClienteId]);

  useEffect(() => {
    if (watchedSucursalId) {
      setSelectedSucursalId(Number(watchedSucursalId));
    } else {
      setSelectedSucursalId(null);
    }
  }, [watchedSucursalId, setSelectedSucursalId]);

  useEffect(() => {
    if (watchedAreaId) {
      setSelectedAreaId(Number(watchedAreaId));
    } else {
      setSelectedAreaId(null);
    }
  }, [watchedAreaId, setSelectedAreaId]);

  // Resetear formulario y poblar dependencias al abrir
  useEffect(() => {
    if (isOpen) {
      if (equipoEditar) {
        const clienteId = equipoEditar.id_cliente ?? equipoEditar.cliente?.id;
        const sucursalId =
          equipoEditar.id_sucursal ?? equipoEditar.sucursal?.id;
        const areaId = equipoEditar.id_area ?? equipoEditar.area?.id ?? null;

        setSelectedClienteId(clienteId ? Number(clienteId) : null);
        setSelectedSucursalId(sucursalId ? Number(sucursalId) : null);
        setSelectedAreaId(areaId ? Number(areaId) : null);

        reset({
          tipo: equipoEditar.tipo || "",
          marca: equipoEditar.marca || "",
          num_serie: equipoEditar.num_serie || "",
          nombre_usuario: equipoEditar.nombre_usuario || null,
          id_cliente: clienteId,
          id_sucursal: sucursalId,
          id_area: areaId,
          id_trabajador:
            equipoEditar.id_trabajador ?? equipoEditar.trabajador?.id ?? null,
          ult_revision: equipoEditar.ult_revision || null,
          rev_programada: equipoEditar.rev_programada || null,
          is_active: equipoEditar.is_active ?? true,
        });
      } else {
        setSelectedClienteId(null);
        setSelectedSucursalId(null);
        setSelectedAreaId(null);
        reset({
          tipo: "",
          marca: "",
          num_serie: "",
          nombre_usuario: null,
          id_cliente: undefined,
          id_sucursal: undefined,
          id_area: null,
          id_trabajador: null,
          ult_revision: null,
          rev_programada: null,
          is_active: true,
        });
      }
    }
  }, [
    isOpen,
    equipoEditar,
    reset,
    setSelectedClienteId,
    setSelectedSucursalId,
    setSelectedAreaId,
  ]);

  const onSubmit: SubmitHandler<EquipoFormValues> = async (values) => {
    if (isEditing && equipoEditar) {
      await onUpdate(equipoEditar.id_equipo, values);
    } else {
      await onCreate(values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[700px] !w-[90vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Editar equipo" : "Nuevo equipo"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <EquipoFormFields
              control={control as unknown as Control<EquipoFormValues>}
              setValue={setValue as any}
              clientesOptions={clientesOptions}
              sucursalesOptions={sucursalesOptions}
              areasOptions={areasOptions}
              trabajadoresOptions={trabajadoresOptions}
              loadingCatalogos={loadingCatalogos}
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
                    : "Crear equipo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
