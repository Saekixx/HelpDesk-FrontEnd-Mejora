// Sub-estructura para la sucursal principal
export interface SucursalPrincipalRequest {
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

// Sub-estructura para sucursales adicionales
export interface SucursalAdicionalRequest {
  nombre: string;
  encargado?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

// Interfaz para la creación y edición de Clientes
export interface ClienteRequest {
  tipo_cliente: "NATURAL" | "JURIDICA";
  numero_documento: string; // DNI o RUC
  nombre_principal: string; // Nombre o Razón Social
  direccion?: string;
  telefono?: string;
  correo?: string;
  rubro?: string;
  fecha_inicio_plan?: string; // Formato YYYY-MM-DD
  fecha_finalizacion_plan?: string; // Formato YYYY-MM-DD
  costo_negociado?: number;
  limite_equipos_contratado?: number;
  id_plan: number;
  is_active?: boolean;

  // Estructuras opcionales para la creación con sucursales asociadas
  sucursal_principal?: SucursalPrincipalRequest;
  sucursales_adicionales?: SucursalAdicionalRequest[];
}
