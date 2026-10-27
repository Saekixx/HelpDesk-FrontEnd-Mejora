// Sub-entidades relacionadas en el área
export interface AreaSucursalInfo {
  id_sucursal: number;
  nombre: string;
}

export interface AreaClienteInfo {
  id_cliente: number;
  nombre: string;
}

// Lo que devuelve el listado paginado (GET /areas)
export interface AreaListItem {
  id_area: number;
  nombre_area: string;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
  is_active: boolean;
  id_sucursal: number;
  createdAt: string;
  updatedAt: string;
  sucursal: AreaSucursalInfo;
  cliente: AreaClienteInfo;
}

// Lo que devuelve el detalle completo (GET /areas/{id})
export type AreaDetail = AreaListItem;

// --- Parámetros de Consulta (Query Params) ---
export interface GetAreasParams {
  id_cliente?: number;
  id_sucursal?: number;
  search?: string; // Búsqueda parcial por nombre, contacto o correo
  is_active?: boolean;
  page?: number;
  limit?: number;
}
