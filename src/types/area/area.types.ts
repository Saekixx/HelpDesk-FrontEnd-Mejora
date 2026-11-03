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

// Interface para la respuesta de la API al obtener un area específica (GET /areas/{id})
export interface AreaDetalle {
  id_area: number;
  nombre_area: string;
  is_active: boolean;
  id_sucursal: number;
  empresa: string;
  sucursal_asignada: string;
  encargar_responsable: string;
  total_equipos: number;
  telefono: string | null;
  correo: string | null;
}
