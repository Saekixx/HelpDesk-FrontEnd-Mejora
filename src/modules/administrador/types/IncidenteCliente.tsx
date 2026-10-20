// Interface para definir la estructura de un incidente de cliente
// para el grafico de incidentes por cliente en el dashboard

export interface IncidenteCliente {
    cliente: string; // Nombre del cliente
    sucursal: string; // Nombre de la sucursal del cliente
    numero_tickets: number; // Número de tickets asociados al cliente y sucursal
    porcentaje_tickets: number; // Porcentaje de tickets asociados al cliente y sucursal respecto al total
}

export interface ResumenIncidenciasCliente {
  total_tickets: number; // Total global de tickets en el periodo 
  fecha_mes: string; // Mes/Periodo del reporte (ej: "Mayo 2024" o "2024-05")
  incidencias: IncidenteCliente[]; // Listado de los top clientes
  cobertura_porcentaje?: number; // Opcional para el pie de página (ej: 82)
}