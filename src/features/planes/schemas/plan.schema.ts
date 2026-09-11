import { z } from "zod";

export const planSchema = z.object({
  numero_plan: z
    .number({ message: "Debe ser un número válido" })
    .min(1, "El número de plan debe ser mayor a 0"),

  tipo: z.string().min(2, "El nombre del plan es requerido"),

  precio: z
    .number({ message: "Debe ser un número válido" })
    .min(0, "El precio no puede ser negativo"),

  limite_equipos: z
    .number({ message: "Debe ser un número válido" })
    .min(0, "Debe ser 0 o mayor"),

  servicio: z
    .array(
      z.object({
        value: z.string().min(1, "El servicio no puede estar vacío"),
      }),
    )
    .min(1, "Debe incluir al menos un servicio"),
});

export type PlanFormValues = z.infer<typeof planSchema>;
