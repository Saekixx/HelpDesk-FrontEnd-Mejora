import { z } from "zod";

export const areaSchema = z.object({
  id_cliente: z.coerce.number({ message: "Selecciona una empresa cliente" }),
  id_sucursal: z.coerce.number({ message: "Selecciona una sucursal" }),
  nombre_area: z.string().min(1, "El nombre del área es obligatorio"),
  contacto_encargado: z.string().optional(),
  telefono: z.string().optional(),
  correo: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),
});

export type AreaFormData = z.infer<typeof areaSchema>;
