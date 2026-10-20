import { Route, Routes } from "react-router-dom"

function RemotoRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<div>Dashboard Soporte REMOTO</div>} />
      <Route path="usuarios" element={<div>Usuarios Soporte REMOTO</div>} />
      {/* Redirección por defecto dentro del módulo si es necesario */}
      <Route path="*" element={<div>Dashboard Soporte REMOTO</div>} />
    </Routes>
  )
}

export default RemotoRoutes