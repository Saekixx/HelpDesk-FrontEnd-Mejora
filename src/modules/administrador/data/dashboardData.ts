import { ResumenAlertasLicencias } from "../types/AlertaLicencia";
import { ResumenCitasHoy } from "../types/CitasProgramadas";
import { ResumenIncidenciasCliente } from "../types/IncidenteCliente";
import { ResumenVolumenRequerimientos } from "../types/VolumenRequqerimientos";

// src/data/dashboardData.ts
export const mockIncidenciasClienteData: ResumenIncidenciasCliente = {
  total_tickets: 105,
  fecha_mes: "Mayo 2024",
  cobertura_porcentaje: 82,
  incidencias: [
    {
      cliente: "Banco Metrópolis",
      sucursal: "Sede Financiera",
      numero_tickets: 34,
      porcentaje_tickets: 32.4,
    },
    {
      cliente: "Logística Transandina",
      sucursal: "Hub Callao",
      numero_tickets: 26,
      porcentaje_tickets: 24.8,
    },
    {
      cliente: "Clínica San Lucas",
      sucursal: "Consultorios Norte",
      numero_tickets: 19,
      porcentaje_tickets: 18.1,
    },
    {
      cliente: "Corporación Retail Sur",
      sucursal: "Plaza Central",
      numero_tickets: 15,
      porcentaje_tickets: 14.3,
    },
    {
      cliente: "Constructora Habitual",
      sucursal: "Oficina Central",
      numero_tickets: 11,
      porcentaje_tickets: 10.4,
    },
  ],
};

// Mock data for "Citas Programadas" (Scheduled Appointments) for today
export const mockCitasHoyData: ResumenCitasHoy = {
  total_citas: 14,
  citas: [
    {
      id: 1,
      hora: "09:30 AM",
      cliente: "Banco Metrópolis",
      sucursal: "Sede Financiera",
      descripcion: "Revisión de switch Core y enlace VPN",
      tecnico: "Tec. Rodrigo A.",
      estado: "EN RUTA",
    },
    {
      id: 2,
      hora: "11:45 AM",
      cliente: "Logística Transandina",
      sucursal: "Hub Callao",
      descripcion: "Mantenimiento preventivo Servidor SQL",
      tecnico: "Tec. Carlos M.",
      estado: "AGENDADO",
    },
    {
      id: 3,
      hora: "15:30 PM",
      cliente: "Clínica San Lucas",
      sucursal: "Consultorios Norte",
      descripcion: "Configuración red Wi-Fi y APs",
      tecnico: "Tec. Elena G.",
      estado: "AGENDADO",
    },
  ],
};

// Mock data for "Volumen de Requerimientos" (Volume of Requests) for the dashboard
export const mockVolumenRequerimientosData: ResumenVolumenRequerimientos = {
  ratio_porcentaje: 94.2,
  total_registrados: 172,
  total_resueltos: 162,
  tendencia_dias: [
    { dia: "Lun", creados: 24, resueltos: 21 },
    { dia: "Mar", creados: 31, resueltos: 28 },
    { dia: "Mié", creados: 34, resueltos: 32 },
    { dia: "Jue", creados: 28, resueltos: 29 },
    { dia: "Vie", creados: 38, resueltos: 35 },
    { dia: "Sáb", creados: 18, resueltos: 19 },
    { dia: "Dom", creados: 15, resueltos: 16 },
  ],
};

// Mock data for "Alertas de Licencias" (License Alerts) for the dashboard
export const mockAlertasLicenciasData: ResumenAlertasLicencias = {
  rango_dias_alerta: "< 30 días",
  alertas: [
    {
      id: 1,
      nombre_software: "Autodesk AutoCAD LT",
      cliente: "Banco Metrópolis",
      sucursal: "Sede Financiera",
      equipos_afectados: 8,
      dias_restantes: 12,
      severidad: "critica",
    },
    {
      id: 2,
      nombre_software: "VMware vSphere Enterprise",
      cliente: "Logística Transandina",
      sucursal: "Hub Callao",
      equipos_afectados: 4,
      dias_restantes: 18,
      severidad: "advertencia",
    },
    {
      id: 3,
      nombre_software: "JetBrains All Products",
      cliente: "Clínica San Lucas",
      sucursal: "Consultorios Norte",
      equipos_afectados: 12,
      dias_restantes: 27,
      severidad: "info",
    },
  ],
};