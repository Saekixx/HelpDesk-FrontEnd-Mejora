import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Si no hay sesión activa, redirigir al Login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si pasa las verificaciones, renderiza la ruta hija
  return <Outlet />;
};
