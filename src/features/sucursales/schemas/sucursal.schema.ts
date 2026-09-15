import { z } from "zod";

export const sucursalSchema = z.object({
  id_cliente: z.number({ error: "Debe seleccionar una empresa" }),
  nombre_sucursal: z.string().min(1, "El nombre de la sucursal es obligatorio"),
  encargado: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  direccion: z.string().min(1, "La dirección es obligatoria"),
});

export type SucursalFormValues = z.infer<typeof sucursalSchema>;
