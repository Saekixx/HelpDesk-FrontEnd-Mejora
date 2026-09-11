import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { loginService } from "../services/auth.service";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      password: "",
    },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await loginService(data);

      if (response?.token) {
        login({ token: response.token, user: response.user });
        navigate("/dashboard", { replace: true });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Ocurrió un error inesperado al iniciar sesión");
      }
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    showPassword,
    toggleShowPassword,
    apiError,
  };
};
