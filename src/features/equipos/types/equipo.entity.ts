// Objeto anidado simple para relaciones
export interface EntityRelationInfo {
  id: number;
  nombre: string;
}

// Elemento base de equipo utilizado en listados
export interface EquipoListItem {
  id_equipo: number;
  tipo: string;
  marca: string;
  num_serie: string;
  nombre_usuario: string | null;
  id_trabajador: number | null;
  id_cliente: number | null;
  id_sucursal: number | null;
  id_area: number | null;
  is_active: boolean;

  // Relaciones anidadas del listado
  cliente?: EntityRelationInfo | null;
  sucursal?: EntityRelationInfo | null;
  area?: EntityRelationInfo | null;
  trabajador?: EntityRelationInfo | null;
}

// Detalle completo del equipo (incluye código, fechas y componentes)
export interface EquipoDetail extends EquipoListItem {
  codigo?: string;
  ult_revision?: string | null;
  rev_programada?: string | null;
  hardware?: {
    componentes_actuales?: Array<Record<string, unknown>>;
    [key: string]: unknown;
  };
  software?: Array<Record<string, unknown>>;
}

// Parámetros de consulta para filtrado y paginación
export interface GetEquiposQueryParams {
  id_cliente?: number;
  id_sucursal?: number;
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}
