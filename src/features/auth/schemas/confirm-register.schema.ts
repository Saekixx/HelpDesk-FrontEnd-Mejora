// src/auth/schemas/confirm-register.schema.ts
import { z } from "zod";

export const confirmRegisterSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ConfirmRegisterFormValues = z.infer<typeof confirmRegisterSchema>;
