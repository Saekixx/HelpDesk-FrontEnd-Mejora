// src/pages/ResetPasswordPage.tsx
import { useSearchParams, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {!token ? (
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Enlace no válido
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              El enlace de recuperación es inválido o no contiene un token de
              acceso.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block text-xs font-semibold text-[#ff5722] hover:underline pt-2"
            >
              Solicitar un nuevo enlace
            </Link>
          </div>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
