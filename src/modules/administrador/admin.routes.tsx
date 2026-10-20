// src/modules/administrador/admin.routes.tsx
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import PerfilPage from "./pages/PerfilPage";
import CronogramaCitasPage from "./pages/CronogramaCitasPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="usuarios" element={<UsuariosPage />} />

      
      <Route path="cronograma-citas" element={<CronogramaCitasPage />} />

      <Route path="perfil" element={<PerfilPage />} />

      {/* Redirección por defecto dentro del módulo si es necesario */}
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
};