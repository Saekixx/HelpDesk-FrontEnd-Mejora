import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TicketsPage from "@/pages/TicketsPage";
import ClientsPage from "@/pages/ClientsPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import UsersPage from "@/pages/UsersPage";
import ProfilePage from "@/pages/ProfilePage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas protegidas dentro del Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />

          {/* Vistas secundarias */}
          <Route path="/equipos" element={<div>Página Equipos</div>} />
          <Route path="/citas" element={<div>Página Citas</div>} />
          <Route path="/areas" element={<div>Página Áreas</div>} />
          <Route path="/sucursales" element={<div>Página Sucursales</div>} />
          <Route path="/hardware" element={<div>Página Hardware</div>} />
          <Route path="/software" element={<div>Página Software</div>} />
          <Route path="/planes" element={<div>Página Planes</div>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
