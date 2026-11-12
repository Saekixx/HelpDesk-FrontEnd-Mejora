import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, PlusCircle, Monitor, Code2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTicketMutations } from "@/hooks/ticket/useTicketMutations";
import { TicketFormValues, ticketSchema } from "@/schema/ticket/ticket.schema";
import { SelectOption } from "@/shared/types/select-option.types";
import { getEquiposOptions } from "@/shared/services/catalog.service";

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId: number; // Recibe el ID del usuario desde la page
  onSuccess?: () => void; // Callback para refrescar la tabla al crear
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  open,
  onOpenChange,
  usuarioId,
  onSuccess,
}) => {
  // Estados locales para los equipos del trabajador y su carga
  const [equipos, setEquipos] = useState<SelectOption<number>[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState<boolean>(false);

  // Hook centralizado de mutaciones para crear el ticket
  const { createTicket, isCreating } = useTicketMutations(() => {
    onOpenChange(false);
    onSuccess?.(); // Esto disparará el refetch en la página principal
  });

  // Cargar exclusivamente los equipos vinculados al ID del trabajador cuando se abre el modal
  useEffect(() => {
    let isMounted = true;

    if (open && usuarioId) {
      const fetchEquiposByTrabajador = async () => {
        setLoadingEquipos(true);
        try {
          // Usamos tu query reutilizable pasándole el id_trabajador directamente
          const data = await getEquiposOptions({ id_trabajador: usuarioId });
          if (isMounted) {
            setEquipos(data || []);
          }
        } catch (error) {
          console.error("Error al cargar los equipos del trabajador:", error);
        } finally {
          if (isMounted) {
            setLoadingEquipos(false);
          }
        }
      };

      fetchEquiposByTrabajador();
    } else {
      setEquipos([]);
    }

    return () => {
      isMounted = false;
    };
  }, [open, usuarioId]);

  // Configuración del formulario con React Hook Form y Zod
  const form = useForm<
    z.input<typeof ticketSchema>,
    any,
    z.output<typeof ticketSchema>
  >({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      asunto: "",
      detalle: "",
      id_equipo: 0,
      es_software: false,
    },
  });

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: TicketFormValues) => {
    await createTicket({
      asunto: values.asunto,
      detalle: values.detalle,
      equipoId: Number(values.id_equipo),
      esSoftware: values.es_software,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Crear Nuevo Ticket
          </DialogTitle>
          <DialogDescription>
            Completa los detalles de la incidencia. Los equipos mostrados
            pertenecen a tu usuario.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo: Equipo Afectado (Muestra la etiqueta del equipo en lugar del ID numérico) */}
            <FormField
              control={form.control}
              name="id_equipo"
              render={({ field }) => {
                const selectedEquipo = equipos.find(
                  (eq) => Number(eq.value) === Number(field.value),
                );

                return (
                  <FormItem>
                    <FormLabel>Equipo afectado</FormLabel>
                    <Select
                      disabled={loadingEquipos || isCreating}
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un equipo">
                            {selectedEquipo
                              ? selectedEquipo.label
                              : "Selecciona un equipo"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipos.length > 0 ? (
                          equipos.map((eq) => (
                            <SelectItem key={eq.value} value={String(eq.value)}>
                              {eq.label}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            {loadingEquipos
                              ? "Cargando equipos..."
                              : "No hay equipos vinculados a tu usuario"}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Campo: Tipo de Incidencia con Dos Cards (Hardware = false, Software = true) */}
            <FormField
              control={form.control}
              name="es_software"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Tipo de Incidencia</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Card Hardware (es_software = false) */}
                    <div
                      onClick={() => !isCreating && field.onChange(false)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        field.value === false
                          ? "border-[#ff5722] bg-orange-50/50 text-slate-900 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                      }`}
                    >
                      <Monitor
                        className={`h-5 w-5 mb-1 ${field.value === false ? "text-[#ff5722]" : "text-slate-400"}`}
                      />
                      <span className="text-xs font-bold">Hardware</span>
                      <span className="text-[10px] text-slate-400 text-center">
                        Problema físico / equipo
                      </span>
                    </div>

                    {/* Card Software (es_software = true) */}
                    <div
                      onClick={() => !isCreating && field.onChange(true)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        field.value === true
                          ? "border-[#ff5722] bg-orange-50/50 text-slate-900 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                      }`}
                    >
                      <Code2
                        className={`h-5 w-5 mb-1 ${field.value === true ? "text-[#ff5722]" : "text-slate-400"}`}
                      />
                      <span className="text-xs font-bold">Software</span>
                      <span className="text-[10px] text-slate-400 text-center">
                        Aplicaciones / sistemas
                      </span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Asunto */}
            <FormField
              control={form.control}
              name="asunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Error al iniciar sesión en el sistema"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Detalle */}
            <FormField
              control={form.control}
              name="detalle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalle de la incidencia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe qué ocurrió detalladamente..."
                      className="min-h-[100px] resize-none"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-[#ff5722] hover:bg-[#f4511e] text-white"
              >
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear Ticket
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
