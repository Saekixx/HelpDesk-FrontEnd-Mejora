import { z } from "zod";

export const areaSchema = z.object({
  id_sucursal: z.number({ error: "Debe seleccionar una sucursal" }),
  nombre_area: z.string().min(1, "El nombre del área es obligatorio"),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
});

export type AreaFormValues = z.infer<typeof areaSchema>;
