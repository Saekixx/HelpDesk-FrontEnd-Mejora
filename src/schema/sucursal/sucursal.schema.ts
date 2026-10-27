import { z } from "zod";

export const sucursalSchema = z.object({
  id_cliente: z.coerce.number({ message: "Selecciona una empresa cliente" }),
  nombre: z.string().min(1, "El nombre de la sucursal es obligatorio"),
  direccion: z.string().min(1, "La dirección fiscal es obligatoria"),
  encargado_nombre: z.string().min(1, "El nombre del encargado es obligatorio"),
  encargado_apellido: z
    .string()
    .min(1, "El apellido del encargado es obligatorio"),
  telefono: z.string().min(1, "El teléfono de contacto es obligatorio"),
  correo: z.string().email("Correo electrónico corporativo inválido"),
});

export type SucursalFormData = z.infer<typeof sucursalSchema>;
