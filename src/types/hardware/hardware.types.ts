export type EstadoHardwareApi =
  "INSTALADO" | "DISPONIBLE" | "EN_MANTENIMIENTO" | "BAJA" | string;

export type TipoComponenteApi =
  | "MEMORIA_RAM"
  | "ALMACENAMIENTO_SSD"
  | "ALMACENAMIENTO_HDD"
  | "FUENTE_PODER"
  | "PROCESADOR"
  | "TARJETA_GRAFICA"
  | "PLACA_BASE"
  | string;

export interface EquipoAsociadoHardware {
  id_equipo: number;
  codigo: string;
  nombre_equipo: string;
  cliente: {
    id: number;
    nombre: string;
  };
  sucursal: {
    id: number;
    nombre: string;
  };
  area: {
    id: number;
    nombre: string;
  };
}

export interface HardwareItem {
  id_hardware: number;
  numero_serie: string;
  tipo_componente: TipoComponenteApi;
  tipo_componente_label: string;
  marca_modelo: string;
  proveedor: string;
  fecha_compra: string;
  costo_unitario: number;
  url_factura?: string | null;
  estado: EstadoHardwareApi;
  estado_label: string;
  is_active: boolean;
  equipo_actual: EquipoAsociadoHardware | null;
  created_at: string;
  updated_at: string;
}

// Parámetros de consulta (Query Params) omitiendo tipo_componente y proveedor (ahora integrados en search)
export interface GetHardwareParams {
  search?: string; // Búsqueda general (número de serie, marca/modelo, tipo de componente o proveedor)
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  estado?: EstadoHardwareApi | string;
  page?: number;
  limit?: number;
}
