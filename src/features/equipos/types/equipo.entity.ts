// Objeto anidado simple para relaciones
export interface EntityRelationInfo {
  id: number;
  nombre: string;
}

// Estructura de un componente de hardware individual
export interface ComponenteHardware {
  id_RH: number;
  tipo: string;
  marca: string;
  descripcion: string;
  serie: string;
  proveedor: string;
  fecha_instalacion: string;
  url_factura: string | null;
  is_active: boolean;
}

// Estructura del objeto hardware (componentes actuales e historial)
export interface HardwareEquipo {
  componentes_actuales: ComponenteHardware[];
  historial: ComponenteHardware[];
}

// Estructura de un software instalado
export interface SoftwareEquipo {
  id_software_equipos: number;
  id_software: number;
  nombre: string;
  vencimiento: string;
  licencia_asignada: string;
  fecha_instalacion: string;
  observaciones: string;
  is_active: boolean;
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

// Detalle completo del equipo
export interface EquipoDetail extends EquipoListItem {
  codigo?: string;
  ult_revision?: string | null;
  rev_programada?: string | null;
  hardware?: HardwareEquipo;
  software?: SoftwareEquipo[];
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
