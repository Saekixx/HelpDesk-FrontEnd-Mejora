// Nivel de urgencia o severidad de la alerta de licencia
export type SeveridadLicencia = "critica" | "advertencia" | "info";

// Estructura de una alerta individual de software/licencia
export interface AlertaLicencia {
  id: string | number; // Identificador único de software
  nombre_software: string; // Nombre del software (Ej: "Autodesk AutoCAD LT")
  cliente: string; // Nombre del cliente o empresa propietaria de la licencia (Ej: "Banco Metrópolis")
  sucursal?: string; // Sucursal u oficina asociada opcional (Ej: "Sede Financiera")
  equipos_afectados: number; // Cantidad de equipos o puestos que tienen instalado este software
  dias_restantes: number; // Días restantes antes de la expiración de la licencia
  severidad?: SeveridadLicencia; // Nivel de severidad de la alerta (opcional)
}

// Estructura general del widget de alertas
export interface ResumenAlertasLicencias {
  rango_dias_alerta: string; // Rango temporal evaluado en el widget (Ej: "< 30 días")
  alertas: AlertaLicencia[]; // Listado de alertas de licencias próximas a vencer
}