import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ResetPasswordFields } from "./ResetPasswordFields";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "../schemas/reset-password.schema";
import { useResetPassword } from "../hooks/useResetPassword";

interface Props {
  token: string;
}

export const ResetPasswordForm = ({ token }: Props) => {
  const { resetPassword, isLoading, isSuccess, errorMessage } =
    useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(token, data.password);
  };

  return (
    <div className="flex-1 p-8 sm:p-10 pr-6">
      {/* Icono Principal */}
      <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff5722] mb-6">
        <ShieldCheck className="h-5 w-5" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        Restablecer Contraseña
      </h1>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-[280px]">
        Crea una nueva contraseña segura para acceder a tu cuenta.
      </p>

      {isSuccess ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 leading-relaxed font-medium">
            ¡Contraseña actualizada con éxito! Redirigiendo al inicio de
            sesión...
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            <ResetPasswordFields control={form.control} />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-xl transition-all shadow-md shadow-orange-500/20 text-xs mt-2"
            >
              {isLoading ? "Actualizando..." : "Restablecer Contraseña"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
