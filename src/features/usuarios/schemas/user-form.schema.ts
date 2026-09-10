import * as z from "zod";

export const ROLE_IDS = {
  ADMINISTRADOR: 1,
  SOPORTE_REMOTO: 2,
  SOPORTE_INSITU: 3,
  CLIENTE_EMPRESA: 4,
  CLIENTE_SUCURSAL: 5,
  CLIENTE_TRABAJADOR: 6,
} as const;

const baseUserSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  id_rol: z.number({ error: "El rol es obligatorio" }),
  id_cliente: z.number().nullable().optional(),
  id_sucursal: z.number().nullable().optional(),
  id_area: z.number().nullable().optional(),
});

const validateUserDependencies = (
  data: z.infer<typeof baseUserSchema>,
  ctx: z.RefinementCtx,
) => {
  const { id_rol, id_cliente, id_sucursal, id_area } = data;

  if (id_rol === ROLE_IDS.CLIENTE_EMPRESA && !id_cliente) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La empresa es obligatoria para este rol",
      path: ["id_cliente"],
    });
  }

  if (id_rol === ROLE_IDS.CLIENTE_SUCURSAL) {
    if (!id_cliente) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La empresa es obligatoria para este rol",
        path: ["id_cliente"],
      });
    }
    if (!id_sucursal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La sucursal es obligatoria para este rol",
        path: ["id_sucursal"],
      });
    }
  }

  if (id_rol === ROLE_IDS.CLIENTE_TRABAJADOR) {
    if (!id_cliente) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La empresa es obligatoria para un trabajador",
        path: ["id_cliente"],
      });
    }
    if (!id_sucursal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La sucursal es obligatoria para un trabajador",
        path: ["id_sucursal"],
      });
    }
    if (!id_area) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El área es obligatoria para un trabajador",
        path: ["id_area"],
      });
    }
  }
};

export const createUserSchema = baseUserSchema.superRefine(
  validateUserDependencies,
);

export const updateUserSchema = baseUserSchema
  .extend({
    resetPassword: z.boolean().optional(),
  })
  .superRefine(validateUserDependencies);

// Exportación alias para resolver imports existentes
export const userSchema = updateUserSchema;

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
