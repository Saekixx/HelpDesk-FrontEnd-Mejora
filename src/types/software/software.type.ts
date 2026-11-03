export type TipoLicenciaApi =
  | "Monousuario_OEM"
  | "Pool_Limitado"
  | "Corporativa_Flotante"
  | "Empresarial_Ilimitada"
  | string;

export type SoftwareEstadoApi =
  "Activo" | "Suspendido" | "Caducado" | "Inactivo" | string;

export interface SoftwareItem {
  id_software: number;
  id_cliente?: number | null;
  id_sucursal?: number | null;
  nombre_software: string;
  categoria?: string | null;
  tipo_licencia: TipoLicenciaApi;
  licencia?: string; // Mapeo opcional según tu JSON
  licencia_master_key?: string | null;
  proveedor?: string | null;
  limite_equipos?: number;
  licencias_usadas?: number;
  fecha_instalacion?: string | null;
  fecha_compra?: string | null;
  fecha_caducidad?: string | null;
  estado: SoftwareEstadoApi;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Parámetros de consulta (Query Params) basados en el endpoint GET /software
export interface GetSoftwareParams {
  search?: string; // Término de búsqueda (tipo, marca, modelo o nombre del software)
  is_active?: boolean; // Filtrar por estado activo/inactivo
  page?: number;
  limit?: number;
}
