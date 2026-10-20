import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROLE_BASE_PATH } from "@/types/roles";

// Pages de Auth
import LoginPage from "@/modules/auth/pages/LoginPage";
import ConfirmRegisterPage from "@/modules/auth/pages/ConfirmRegisterPage";
import ResetPasswordPage from "@/modules/auth/pages/ResetPasswordPage";
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import UnauthorizedPage from "@/modules/auth/pages/UnauthorizedPage";

// Pages de Administrador
import { AdminRoutes } from "@/modules/administrador/admin.routes";
import TrabajadorRoutes from "@/modules/cliente_trabajador/trabajador.routes";
import SucursalRoutes from "@/modules/cliente_sucursal/sucursal.routes";
import EmpresaRoutes from "@/modules/cliente_empresa/empresa.routes";
import RemotoRoutes from "@/modules/soporte_remoto/remoto.routes";
import InsituRoutes from "@/modules/soporte_insitu/insitu.routes";



export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/confirm-email" element={<ConfirmRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas protegidas dentro del Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={`${ROLE_BASE_PATH.ADMINISTRADOR}/*`} element={<AdminRoutes />} />

          <Route path={`${ROLE_BASE_PATH.SOPORTE_TECNICO}/*`} element={<RemotoRoutes />} />
          <Route path={`${ROLE_BASE_PATH.SOPORTE_INSITU}/*`} element={<InsituRoutes />} />

          <Route path={`${ROLE_BASE_PATH.CLIENTE_EMPRESA}/*`} element={<EmpresaRoutes />} />
          <Route path={`${ROLE_BASE_PATH.CLIENTE_SUCURSAL}/*`} element={<SucursalRoutes />} />
          <Route path={`${ROLE_BASE_PATH.CLIENTE_TRABAJADOR}/*`} element={<TrabajadorRoutes />} />
          
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
