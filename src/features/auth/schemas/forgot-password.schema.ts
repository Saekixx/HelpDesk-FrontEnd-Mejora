// src/schemas/auth/forgot-password.schema.ts
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  correo: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingrese un correo electrónico válido"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
