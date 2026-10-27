// src/modules/administrador/admin.routes.tsx
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import PerfilPage from "./pages/PerfilPage";
import CronogramaCitasPage from "./pages/CronogramaCitasPage";
import ClientePage from "./pages/ClientePage";
import SucursalPage from "./pages/SucursalPage";
import AreasPage from "./pages/AreaPage";
import PlanesPage from "./pages/PlanesPage";
import EquiposPage from "./pages/EquiposPage";
import HardwarePage from "./pages/HardwarePage";
import SoftwarePage from "./pages/SoftwarePage";
import TicketPage from "./pages/TicketPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="usuarios" element={<UsuariosPage />} />
      <Route path="clientes" element={<ClientePage />} />
      <Route path="sucursales" element={<SucursalPage />} />
      <Route path="areas" element={<AreasPage />} />
      <Route path="equipos" element={<EquiposPage />} />
      <Route path="hardware" element={<HardwarePage />} />
      <Route path="software" element={<SoftwarePage />} />
      <Route path="planes" element={<PlanesPage />} />
      <Route path="tickets" element={<TicketPage />} />
      <Route path="cronograma-citas" element={<CronogramaCitasPage />} />

      <Route path="perfil" element={<PerfilPage />} />

      {/* Redirección por defecto dentro del módulo si es necesario */}
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
};
