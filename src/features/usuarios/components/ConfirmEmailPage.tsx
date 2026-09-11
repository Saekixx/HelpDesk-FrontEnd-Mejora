/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage(
        "El enlace de confirmación no es válido o falta el token.",
      );
      return;
    }

    const confirmAccount = async () => {
      try {
        await api.get(`/auth/confirmar-cuenta?token=${token}`);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.message ||
            "El token ha expirado o ya fue utilizado.",
        );
      }
    };

    confirmAccount();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center space-y-6">
        {status === "loading" && (
          <div className="space-y-4 py-6">
            <Loader2 className="h-12 w-12 text-[#FF5722] animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">
              Confirmando tu cuenta...
            </h2>
            <p className="text-xs text-gray-500">
              Por favor espera un momento mientras verificamos tu correo.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 py-2">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              ¡Cuenta Confirmada!
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tu correo ha sido verificado con éxito. Ya puedes iniciar sesión
              con tus credenciales.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium flex items-center justify-center gap-2 h-11 rounded-xl"
            >
              Iniciar Sesión
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 py-2">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <XCircle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Enlace Inválido o Expirado
            </h2>
            <p className="text-xs text-red-600 leading-relaxed">
              {errorMessage}
            </p>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 h-11 rounded-xl"
            >
              Volver al Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
