import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PERMISSIONS } from "../config/permissions";

// Importación de las páginas de la aplicación
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TicketsPage from "../pages/TicketsPage";
import ClientsPage from "../pages/ClientsPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Rutas Protegidas generales (Requieren solo autenticación) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Rutas Protegidas por Permisos Específicos */}
        <Route
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.TICKETS_READ} />
          }
        >
          <Route path="/tickets" element={<TicketsPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.CLIENTS_READ} />
          }
        >
          <Route path="/clientes" element={<ClientsPage />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
