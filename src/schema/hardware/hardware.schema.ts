import { z } from "zod";

export const hardwareSchema = z
  .object({
    tipo_componente: z.string().min(1, "Seleccione un tipo de componente"),
    numero_serie: z.string().min(1, "El número de serie es obligatorio"),
    marca_modelo: z
      .string()
      .min(1, "La marca y modelo técnico son obligatorios"),
    proveedor: z.string().min(1, "El proveedor comercial es obligatorio"),
    fecha_compra: z.string().min(1, "La fecha de adquisición es obligatoria"),
    costo_unitario: z.coerce
      .number()
      .min(0, "El costo unitario debe ser mayor o igual a 0"),
    url_factura: z.any().optional(),
    ubicacion_inicial: z
      .enum(["ALMACEN_CENTRAL", "INSTALAR_EQUIPO"])
      .optional(),
    id_equipo_destino: z.coerce.number().optional(),
    id_cliente_temp: z.any().optional(),
    id_sucursal_temp: z.any().optional(),
    id_area_temp: z.any().optional(),
  })
  .refine(
    (data) => {
      if (
        data.ubicacion_inicial === "INSTALAR_EQUIPO" &&
        !data.id_equipo_destino
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Debe especificar el ID del equipo destino para la instalación",
      path: ["id_equipo_destino"],
    },
  );

export type HardwareFormData = z.infer<typeof hardwareSchema>;
