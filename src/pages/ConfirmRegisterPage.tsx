// src/features/auth/pages/ConfirmRegisterPage.tsx

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmRegisterForm } from "@/features/auth/components/ConfirmRegisterForm";

export const ConfirmRegisterPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Estado: Si no existe token en la URL
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-gray-200 shadow-lg text-center p-6 space-y-4">
          <div className="h-14 w-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Enlace Inválido
          </CardTitle>
          <CardDescription className="text-xs text-gray-600">
            No se encontró ningún token de activación en la dirección
            solicitada.
          </CardDescription>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl h-11"
          >
            Ir al Iniciar Sesión
          </Button>
        </Card>
      </div>
    );
  }

  // 2. Estado: Confirmación exitosa
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-gray-200 shadow-lg text-center p-6 space-y-4">
          <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            ¡Registro Completado!
          </CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Tu cuenta ha sido creada y tu contraseña guardada exitosamente. Ya
            puedes acceder al sistema.
          </CardDescription>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium rounded-xl h-11"
          >
            Iniciar Sesión
          </Button>
        </Card>
      </div>
    );
  }

  // 3. Estado Principal: Render del Formulario
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white rounded-2xl overflow-hidden">
        <CardHeader className="space-y-2 text-center pb-4 pt-8">
          <div className="h-12 w-12 bg-orange-100 text-[#FF5722] rounded-xl flex items-center justify-center mx-auto mb-2">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Activa tu Cuenta
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Ingresa una contraseña segura para completar la creación de tu
            cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <ConfirmRegisterForm
            token={token}
            onSuccess={() => setIsSuccess(true)}
          />
        </CardContent>
      </Card>
    </div>
  );
};
