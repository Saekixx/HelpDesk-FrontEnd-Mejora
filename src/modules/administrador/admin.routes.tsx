// src/modules/administrador/admin.routes.tsx
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="usuarios" element={<UsuariosPage />} />

      {/* Redirección por defecto dentro del módulo si es necesario */}
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
};