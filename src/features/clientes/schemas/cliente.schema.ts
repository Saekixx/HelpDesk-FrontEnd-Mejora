import { z } from "zod";
import { TipoCliente } from "../types/cliente.entity";

export const sucursalSchema = z.object({
  nombre: z.string().optional(),
  encargado: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email("Correo inválido").or(z.literal("")).optional(),
  direccion: z.string().optional(),
});

export const clienteFormSchema = z
  .object({
    tipo_cliente: z.nativeEnum(TipoCliente),
    numero_documento: z.string().min(1, "El documento es obligatorio"),
    nombre_principal: z
      .string()
      .min(1, "El nombre o razón social es obligatorio"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
    telefono: z.string().min(1, "El teléfono es obligatorio"),
    correo: z.string().email("Correo electrónico inválido"),
    rubro: z.string().optional(),
    id_plan: z.number().optional().nullable(),
    fecha_inicio_plan: z.string().optional(),
    fecha_finalizacion_plan: z.string().optional(),
    costo_negociado: z.number().optional(),
    limite_equipos_contratado: z.number().optional(),
    sucursal_principal: sucursalSchema.optional(),
    sucursales_adicionales: z.array(sucursalSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.tipo_cliente === TipoCliente.JURIDICA) {
      if (!/^\d{11}$/.test(data.numero_documento)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El RUC debe tener exactamente 11 dígitos",
          path: ["numero_documento"],
        });
      }
    } else if (data.tipo_cliente === TipoCliente.NATURAL) {
      if (!/^\d{8}$/.test(data.numero_documento)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El DNI debe tener exactamente 8 dígitos",
          path: ["numero_documento"],
        });
      }
    }
  });

export type ClienteFormValues = z.infer<typeof clienteFormSchema>;
