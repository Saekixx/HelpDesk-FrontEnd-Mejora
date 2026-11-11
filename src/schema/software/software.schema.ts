import { z } from "zod";

export const softwareSchema = z.object({
  id_cliente: z.coerce.number().min(1, "Seleccione un cliente válido"),
  id_sucursal: z.coerce.number().min(1, "Seleccione una sucursal válida"),
  nombre_software: z.string().min(1, "El nombre del software es obligatorio"),
  categoria: z.string().min(1, "Seleccione una categoría"),
  proveedor: z.string().min(1, "El proveedor es obligatorio"),
  tipo_licencia: z.string().min(1, "Seleccione un tipo de modelo/licencia"),
  limite_equipos: z.coerce
    .number()
    .min(1, "El límite de equipos debe ser al menos 1"),
  licencia_master_key: z.string().optional().nullable(),
  fecha_compra: z.string().optional().nullable(),
  fecha_caducidad: z.string().optional().nullable(),
});

export type SoftwareFormData = z.infer<typeof softwareSchema>;
