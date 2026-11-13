import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EquipoPage from "./pages/EquipoPage";
import TicketPage from "./pages/TicketPage";
import ProfilePage from "./pages/ProfilePage";
import CronogranaPage from "./pages/CronogranaPage";
import TicketDetailPage from "./pages/TicketDetailPage";

function TrabajadorRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="equipos" element={<EquipoPage />} />
      <Route path="tickets" element={<TicketPage />} />
      <Route path="/tickets/:id" element={<TicketDetailPage />} />
      <Route path="cronograma-citas" element={<CronogranaPage />} />
      <Route path="perfil" element={<ProfilePage />} />
    </Routes>
  );
}

export default TrabajadorRoutes;
