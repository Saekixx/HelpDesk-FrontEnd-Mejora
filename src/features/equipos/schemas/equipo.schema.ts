import { z } from "zod";

export const equipoFormSchema = z.object({
  nombre_usuario: z.string().optional().nullable(),
  id_cliente: z.coerce
    .number({
      error: "Debe seleccionar una empresa / cliente",
    })
    .min(1, "Debe seleccionar una empresa / cliente"),
  id_sucursal: z.coerce
    .number({
      error: "Debe seleccionar una sucursal",
    })
    .min(1, "Debe seleccionar una sucursal"),
  id_area: z.coerce.number().optional().nullable(),
  tipo: z.string().min(1, "El tipo de equipo es obligatorio"),
  marca: z.string().min(1, "La marca es obligatoria"),
  num_serie: z.string().min(1, "El número de serie es obligatorio"),
  id_trabajador: z.coerce.number().optional().nullable(),
  ult_revision: z.string().optional().nullable(),
  rev_programada: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export type EquipoFormValues = z.infer<typeof equipoFormSchema>;
