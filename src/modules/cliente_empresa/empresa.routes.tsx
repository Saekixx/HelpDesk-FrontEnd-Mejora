import { Route, Routes } from "react-router-dom"

function EmpresaRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<div>Dashboard Empresa</div>} />
      <Route path="usuarios" element={<div>Usuarios Empresa</div>} />
        {/* Redirección por defecto dentro del módulo si es necesario */}
        <Route path="*" element={<div>Dashboard Empresa</div>} />
    </Routes>
  )
}

export default EmpresaRoutes