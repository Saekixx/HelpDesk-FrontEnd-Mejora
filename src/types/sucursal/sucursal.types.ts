// Sub-entidad Cliente Empresa en Sucursal
export interface SucursalClienteInfo {
  id_cliente: number;
  nombre: string;
  numero_documento?: string;
}

// Sub-entidad Encargado en Sucursal (Usuario asignado)
export interface SucursalEncargadoInfo {
  id_usuario: number;
  nombre: string;
  apellido: string;
  telefono_contacto: string | null;
  correo: string;
}

// Sub-entidad Zona en Sucursal
export interface SucursalZonaInfo {
  id_zona: number;
  nombre: string;
}

// Lo que devuelve el listado paginado (GET /sucursales) y el detalle
export interface SucursalListItem {
  id_sucursal: number;
  nombre_sucursal: string;
  direccion: string | null;
  total_areas: number;
  is_active: boolean;
  cliente_empresa: SucursalClienteInfo;
  encargado: SucursalEncargadoInfo | null;
  zona: SucursalZonaInfo | null;
  createdAt: string;
  updatedAt: string;

  // Propiedades opcionales/compatibles por si en alguna vista las usas directamente:
  id_cliente?: number;
  id_zona?: number | null;
}

// --- Parámetros de Consulta (Query Params) ---
export interface GetSucursalesParams {
  id_cliente?: number;
  search?: string; // Búsqueda parcial por nombre de sucursal o dirección
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface SucursalAreaVinculada {
  id_area: number;
  nombre_area: string;
  is_active: boolean;
}

export interface SucursalClienteEmpresa {
  id_cliente: number;
  nombre_principal: string;
  numero_documento: string;
}

export interface SucursalEncargado {
  id_usuario?: number;
  nombre: string;
  apellido: string;
  telefono_contacto: string;
  correo_corporativo: string;
}

// Estructura de detalle de una sucursal (GET /sucursales/{id})
export interface SucursalDetail {
  id_sucursal: number;
  nombre_sucursal: string;
  is_active: boolean;
  direccion: string;
  id_zona: number | null;
  areasVinculadas: SucursalAreaVinculada[];
  clienteEmpresa: SucursalClienteEmpresa | null;
  encargado: SucursalEncargado | null;
  createdAt: string;
  updatedAt: string;
}

// Estadísticas de sucursales (GET /sucursales/estadisticas)
export interface SucursalesEstadisticas {
  totalSucursales: { cantidad: number; nuevasEsteMes: number };
  sedesPrincipales: { cantidad: number };
  sucursalesOperativas: { cantidad: number };
  areasCoberturadas: { cantidad: number };
}

// Payloads para creación y actualización
export interface CrearSucursalPayload {
  id_cliente: number;
  nombre_sucursal: string;
  direccion: string;
  id_zona: number | null;
  encargado: SucursalEncargado;
}

export interface ActualizarSucursalPayload {
  id_cliente?: number;
  nombre_sucursal?: string;
  direccion?: string;
  id_zona?: number | null;
  encargado?: SucursalEncargado;
}
