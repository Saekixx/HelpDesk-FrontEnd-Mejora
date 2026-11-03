// Lo que devuelve el listado plano (GET /clientes)
export interface ClienteListItem {
  id_cliente: number;
  nombre_principal: string;
  rubro: string;
  tipo_cliente: "NATURAL" | "JURIDICA";
  numero_documento: string;
  totalSucursales: number;
  // Actualizado: planSoporte ahora puede venir como un objeto con id_plan y tipo, o como string/número por compatibilidad
  planSoporte:
    | {
        id_plan: number;
        tipo: string;
        servicios?: string;
      }
    | string
    | number;
  // Actualizado: se usa is_active como booleano (y mantenemos estado por si acaso)
  is_active: boolean;
  estado?: "activo" | "inactivo" | string;
}

// Sub-entidades para el detalle
export interface ClientePlanInfo {
  id_plan: number;
  nombre: string;
  tipo: string;
  precio: number;
  limite_equipos: number;
  is_active: boolean;
}

export interface ClienteSucursalInfo {
  id_sucursal: number;
  nombre: string;
  encargado: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  is_active: boolean;
}

// Lo que devuelve el detalle completo (GET /clientes/{id})
export interface ClienteDetail {
  id_cliente: number;
  tipo_cliente: "NATURAL" | "JURIDICA";
  numero_documento: string;
  nombre_principal: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  rubro: string | null;
  fecha_inicio_plan: string | null;
  fecha_finalizacion_plan: string | null;
  costo_negociado: number | null;
  limite_equipos_contratado: number | null;
  id_plan: number | null;
  is_active: boolean;
  fecha_registro: string;
  createdAt: string;
  updatedAt: string;
  plan: ClientePlanInfo | null;
  sucursales: ClienteSucursalInfo[];
}

// --- Parámetros de Consulta (Query Params) ---

export interface GetClientesParams {
  search?: string; // Búsqueda parcial por nombre, documento o correo
  tipo_cliente?: "NATURAL" | "JURIDICA";
  is_active?: boolean;
  page?: number;
  limit?: number;
}

// Estructura del plan contratado
export interface ClienteDetailPlan {
  id_plan: number;
  tipo: string;
  limite_equipos: number;
}

// Estructura del contacto de enlace principal
export interface ClienteDetailContacto {
  nombre_responsable: string;
  cargo: string;
  correo: string;
  telefono: string;
}

// Estructura de las sucursales activas
export interface ClienteDetailSucursal {
  id_sucursal: number;
  is_principal: boolean;
  nombre: string;
  direccion: string;
  total_equipos: number;
}

// Estructura principal del detalle de cliente (GET /clientes/{id})
export interface ClienteDetailData {
  id_cliente: number;
  nombre_principal: string;
  numero_documento: string;
  tipo_cliente: "NATURAL" | "JURIDICA";
  rubro: string;
  direccion: string;
  plan: ClienteDetailPlan | null;
  contacto_enlace: ClienteDetailContacto | null;
  sucursales_activas: ClienteDetailSucursal[];
}
