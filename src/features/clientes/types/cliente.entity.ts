export enum TipoCliente {
  JURIDICA = "JURIDICA",
  NATURAL = "NATURAL",
}

export interface Cliente {
  id_cliente: number;
  tipo_cliente: TipoCliente;
  numero_documento: string;
  nombre_principal: string;
  direccion: string;
  telefono: string;
  correo: string;
  rubro: string;
  fecha_inicio_plan: string | Date;
  fecha_finalizacion_plan: string | Date;
  costo_negociado: number;
  limite_equipos_contratado: number;
  id_plan: number;
  is_active: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
}
