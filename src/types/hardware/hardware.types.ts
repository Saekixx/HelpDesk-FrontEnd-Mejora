export type EstadoHardwareApi =
  "INSTALADO" | "DISPONIBLE" | "EN_MANTENIMIENTO" | "BAJA" | string;

// Tipo para el enum o label de tipo de componente
export type TipoComponenteApi =
  | "MEMORIA_RAM"
  | "ALMACENAMIENTO_SSD"
  | "ALMACENAMIENTO_HDD"
  | "FUENTE_PODER"
  | "PROCESADOR"
  | "TARJETA_GRAFICA"
  | "PLACA_BASE"
  | string;

export type UbicacionInicialHardware = "ALMACEN_CENTRAL" | "INSTALAR_EQUIPO";

// Interfaz para la ubicación del equipo en el detalle del hardware
export interface EquipoAsociadoHardware {
  id_equipo: number;
  codigo: string;
  nombre_equipo: string;
  cliente: {
    id_cliente: number;
    nombre_principal: string;
  };
  sucursal: {
    id_sucursal: number;
    nombre_sucursal: string;
  };
  area: {
    id_area: number;
    nombre_area: string;
  };
}

// Historial de movimientos (instalaciones y retiros)
export interface HistorialHardwareItem {
  id_RH: number;
  fecha_instalacion: string;
  fecha_retiro: string | null;
  motivo_retiro: string | null;
  is_actual: boolean;
  equipo: {
    id_equipo: number;
    nombre_equipo: string;
  };
  tecnico_responsable: {
    id_usuario: number;
    nombre: string;
    apellido: string;
  } | null;
}

// Objeto base que se retorna en el listado de hardware (GET /hardware)
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

// Objeto completo que retorna el endpoint GET /hardware/{id} (con historial)
export interface HardwareDetailResponse extends HardwareItem {
  historial: HistorialHardwareItem[];
}

// Parámetros de consulta para la tabla
export interface GetHardwareParams {
  search?: string;
  id_cliente?: number;
  id_sucursal?: number;
  id_area?: number;
  estado?: EstadoHardwareApi | string;
  page?: number;
  limit?: number;
}
