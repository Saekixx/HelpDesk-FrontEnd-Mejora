import { z } from "zod";

export const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  id_rol: z.string().min(1, "Selecciona un rol de acceso"),
  id_cliente: z.string().optional(),
  id_sucursal: z.string().optional(),
  id_area: z.string().optional(),
  id_zona: z.string().optional(),
  zonas_ids: z.array(z.number().or(z.string())).optional(),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
