import { Route, Routes } from "react-router-dom"

function TrabajadorRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<div>Dashboard Trabajador</div>} />
      <Route path="usuarios" element={<div>Usuarios Trabajador</div>} />
      {/* Redirección por defecto dentro del módulo si es necesario */}
      <Route path="*" element={<div>Dashboard Trabajador</div>} />
    </Routes>
  )
}

export default TrabajadorRoutes