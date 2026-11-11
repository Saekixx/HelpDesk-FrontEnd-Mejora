import { TipoLicenciaApi } from "./software.type";

// DTO para registrar un nuevo software (POST /software/create)
export interface CreateSoftwareDTO {
  id_cliente: number;
  id_sucursal: number;
  nombre_software: string;
  categoria?: string | null;
  tipo_licencia: TipoLicenciaApi;
  licencia_master_key?: string | null;
  proveedor?: string | null;
  limite_equipos?: number;
  url_factura?: string | null;
  fecha_compra?: string | null;
  fecha_caducidad?: string | null;
  is_active?: boolean;
}

// DTO para actualizar un software existente (PATCH /software/{id})
export interface UpdateSoftwareDTO {
  nombre_software?: string;
  licencia?: string;
  correo?: string;
  password?: string;
  fecha_instalacion?: string | null;
  fecha_caducidad?: string | null;
  proveedor?: string | null;
}

// DTO para asignar un equipo al software - Bóveda (POST /software/{id}/assign)
export interface AssignSoftwareDTO {
  id_equipo: number;
  correo_asociado?: string;
  licencia_especifica?: string;
  password_enc?: string;
  fecha_instalacion?: string;
}
