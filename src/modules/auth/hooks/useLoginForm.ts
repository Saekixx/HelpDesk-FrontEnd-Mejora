import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { loginService } from "../services/auth.service";
import { getRoleHome } from "@/types/roles";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Configuración del formulario con react-hook-form y zod para validación
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      password: "",
    },
  });

  // Función para alternar la visibilidad de la contraseña
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  // Función para manejar el login del usuario y reenviar a la ruta correspondiente según su rol
  const onSubmit = async (data: LoginFormData) => {
  setApiError(null);
  try {
    const response = await loginService(data);

    if (response?.token && response?.user) {
      // Guardamos la sesión en el contexto/estado global
      login({ token: response.token, user: response.user });

      // Obtenemos dinámicamente la ruta de inicio según el rol del usuario
      const userRole = response.user.role; // Asumiendo que el backend te devuelve el rol aquí
      const redirectTo = getRoleHome(userRole);

      // Redirigimos a su módulo correspondiente o a una ruta por defecto si falla
      navigate(redirectTo || "/unauthorized", { replace: true });
    }
  } catch (err: unknown) {
    // Manejo de errores de la API y mensajes de error personalizados
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
