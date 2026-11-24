export interface EncargadoRequest {
  nombre: string;
  apellido: string;
  telefono_contacto: string;
  correo_corporativo: string;
}

export interface SucursalRequest {
  nombre_sucursal: string;
  direccion: string;
  latitud: number;
  longitud: number;
  id_cliente: number;
  id_zona?: number | null;
  encargado: EncargadoRequest;
  is_active?: boolean;
}
