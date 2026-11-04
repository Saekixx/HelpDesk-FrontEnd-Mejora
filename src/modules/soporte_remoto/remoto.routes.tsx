import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EquiposPage from "./pages/EquiposPage";
import TicketPage from "./pages/TicketPage";
import SoftwarePage from "./pages/SoftwarePage";
import HardwarePage from "./pages/HardwarePage";
import CronogramaPage from "./pages/CronogramaPage";

function RemotoRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="equipos" element={<EquiposPage />} />
      <Route path="hardware" element={<HardwarePage />} />
      <Route path="software" element={<SoftwarePage />} />
      <Route path="tickets" element={<TicketPage />} />
      <Route path="cronograma-citas" element={<CronogramaPage />} />
    </Routes>
  );
}

export default RemotoRoutes;
