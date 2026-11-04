import {
  EstadoHardwareApi,
  TipoComponenteApi,
  UbicacionInicialHardware,
} from "./hardware.types";

// DTO para registrar nuevo hardware (POST /hardware)
export interface CreateHardwareDTO {
  tipo_componente: TipoComponenteApi;
  numero_serie: string;
  marca_modelo: string;
  proveedor: string;
  fecha_compra: string; // Formato YYYY-MM-DD
  costo_unitario: number;
  url_factura?: string | null;
  ubicacion_inicial: UbicacionInicialHardware;
  id_equipo_destino?: number; // Requerido si ubicacion_inicial es "INSTALAR_EQUIPO"
}

// DTO para actualizar ficha técnica (PATCH /hardware/{id})
export interface UpdateHardwareDTO {
  tipo_componente?: TipoComponenteApi;
  numero_serie?: string;
  marca_modelo?: string;
  proveedor?: string;
  fecha_compra?: string;
  costo_unitario?: number;
  url_factura?: string | null;
}

// DTO para la transición de estado (PATCH /hardware/{id}/transition)
export interface TransitionHardwareDTO {
  estado: EstadoHardwareApi;
  id_equipo?: number | null; // Obligatorio solo si el estado es "INSTALADO"
  motivo: string;
}
