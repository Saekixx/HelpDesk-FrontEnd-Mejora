// Sub-estructura para los datos de la empresa
export interface DatosEmpresaRequest {
  tipo_cliente: "NATURAL" | "JURIDICA";
  numero_documento: string; // DNI o RUC
  nombre_principal: string; // Nombre o Razón Social
  direccion?: string;
  rubro?: string;
  id_plan: number;
}

// Sub-estructura para el usuario responsable de la empresa
export interface ResponsableClienteRequest {
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  correo: string;
}

// Sub-estructura para la sucursal matriz/principal
export interface SucursalPrincipalRequest {
  nombre_sucursal: string;
  encargado?: string;
  direccion?: string;
  is_principal: boolean;
}

// Payload atómico de creación (POST /clientes/create)
export interface CrearClientePayload {
  datos_empresa: DatosEmpresaRequest;
  responsable: ResponsableClienteRequest;
  sucursal_principal: SucursalPrincipalRequest;
}

// Payload de edición parcial (PATCH /clientes/{id})
export interface ActualizarClientePayload {
  nombre_principal?: string;
  numero_documento?: string;
  rubro?: string;
  id_plan?: number;
}
