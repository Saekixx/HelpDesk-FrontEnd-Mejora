import { z } from "zod";

const sucursalPrincipalSchema = z.object({
  nombre: z.string().min(1, "El nombre de la sede es obligatorio"),
  encargado_nombre: z.string().optional(),
  encargado_apellido: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  direccion: z.string().min(1, "La dirección es obligatoria"),
});

export const clienteSchema = z.object({
  tipo_cliente: z.enum(["NATURAL", "JURIDICA"]),
  numero_documento: z.string().refine(
    (val) => {
      if (!val) return false;
      return val.length === 8 || val.length === 11;
    },
    {
      message:
        "El documento debe ser un DNI válido (8 dígitos) o RUC (11 dígitos)",
    },
  ),
  nombre_principal: z
    .string()
    .min(1, "La Razón Social o Nombre es obligatorio"),
  direccion: z.string().optional(),
  telefono: z.string().optional().or(z.literal("")),
  correo: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),
  rubro: z.string().optional(),
  id_plan: z.coerce.number({ error: "Selecciona un plan de soporte" }),
  is_active: z.boolean().optional(),
  sucursal_principal: sucursalPrincipalSchema.optional(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
