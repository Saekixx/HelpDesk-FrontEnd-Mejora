import { Route, Routes } from "react-router-dom"

function InsituRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<div>Dashboard Soporte INSITU</div>} />
      <Route path="usuarios" element={<div>Usuarios Soporte INSITU</div>} />
      {/* Redirección por defecto dentro del módulo si es necesario */}
      <Route path="*" element={<div>Dashboard Soporte INSITU</div>} />
    </Routes>
  )
}

export default InsituRoutes