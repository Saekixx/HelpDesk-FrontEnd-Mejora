import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ForgotPasswordFields } from "./ForgotPasswordFields";
import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "../schemas/forgot-password.schema";

export const ForgotPasswordForm = () => {
  const { requestReset, isLoading, isSuccess, errorMessage } =
    useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      correo: "",
    },
  });

  return (
    <div className="flex-1 p-8 sm:p-10 pr-6">
      {/* Icono Principal */}
      <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff5722] mb-6">
        <KeyRound className="h-5 w-5" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-[290px]">
        No te preocupes. Ingresa tu correo electrónico y te enviaremos las
        instrucciones para restablecerla.
      </p>

      {isSuccess ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 leading-relaxed font-medium">
              Si la cuenta existe, hemos enviado las instrucciones a tu correo
              electrónico.
            </p>
          </div>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-xs font-semibold text-[#ff5722] hover:underline pt-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(requestReset)}
            className="space-y-4"
          >
            {errorMessage && (
              <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            <ForgotPasswordFields control={form.control} />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-xl transition-all shadow-md shadow-orange-500/20 text-xs mt-2"
            >
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
