import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { Permission } from "../config/permissions";

interface ProtectedRouteProps {
  requiredPermission?: Permission;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  requiredPermission,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { user, can } = useAuth();

  // 1. Si no hay sesión activa, redirigir al Login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // 2. Si se requiere un permiso específico y el usuario no lo tiene
  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Si pasa las verificaciones, renderiza la ruta hija
  return <Outlet />;
};
