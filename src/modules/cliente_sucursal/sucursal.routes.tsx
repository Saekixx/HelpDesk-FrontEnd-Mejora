import { Route, Routes } from "react-router-dom"

function SucursalRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<div>Dashboard Sucursal</div>} />
      <Route path="usuarios" element={<div>Usuarios Sucursal</div>} />
      {/* Redirección por defecto dentro del módulo si es necesario */}
      <Route path="*" element={<div>Dashboard Sucursal</div>} />
    </Routes>
  )
}

export default SucursalRoutes