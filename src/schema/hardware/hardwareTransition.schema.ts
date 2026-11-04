import { z } from "zod";

export const hardwareTransitionSchema = z
  .object({
    estado: z.string().min(1, "Seleccione el nuevo estado"),
    motivo: z.string().min(5, "El motivo es obligatorio (mínimo 5 caracteres)"),
    id_equipo: z.coerce.number().optional(),
    // Campos temporales para la selección en cascada cuando el estado es INSTALADO
    id_cliente_temp: z.any().optional(),
    id_sucursal_temp: z.any().optional(),
    id_area_temp: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.estado === "INSTALADO" && !data.id_equipo) {
        return false;
      }
      return true;
    },
    {
      message: "Debe seleccionar el equipo de destino para la instalación",
      path: ["id_equipo"],
    },
  );

export type HardwareTransitionFormData = z.infer<
  typeof hardwareTransitionSchema
>;
