// src/config/navigation.ts
import {
  LayoutGrid,
  User,
  Users,
  Building2,
  MapPin,
  Laptop,
  Cpu,
  Boxes,
  Package,
  Ticket,
  CalendarDays,
  LucideIcon,
} from "lucide-react";

// Interfaz para los elementos de navegación
export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  roles: string[];
}

// Definición del menú de navegación con rutas y roles permitidos
export const NAVIGATION_MENU: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard", // Nota: Esto se ajustará de manera dinámica o por rol abajo
    icon: LayoutGrid,
    roles: [
      "ADMINISTRADOR",
      "SOPORTE_REMOTO",
      "SOPORTE_INSITU",
      "CLIENTE_EMPRESA",
      "CLIENTE_SUCURSAL",
    ],
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icon: User,
    roles: [
      "ADMINISTRADOR",
      "SOPORTE_REMOTO",
      "SOPORTE_INSITU",
      "CLIENTE_EMPRESA",
      "CLIENTE_SUCURSAL",
    ],
  },
  {
    title: "Clientes",
    path: "/clientes",
    icon: Users,
    roles: ["ADMINISTRADOR", "SOPORTE_REMOTO", "SOPORTE_INSITU"],
  },
  {
    title: "Sucursales",
    path: "/sucursales",
    icon: MapPin,
    roles: ["ADMINISTRADOR"],
  },
  {
    title: "Áreas",
    path: "/areas",
    icon: Building2,
    roles: ["ADMINISTRADOR"],
  },
  {
    title: "Equipos",
    path: "/equipos",
    icon: Laptop,
    roles: [
      "ADMINISTRADOR",
      "SOPORTE_REMOTO",
      "SOPORTE_INSITU",
      "CLIENTE_EMPRESA",
      "CLIENTE_SUCURSAL",
    ],
  },
  {
    title: "Hardware",
    path: "/hardware",
    icon: Cpu,
    roles: ["ADMINISTRADOR", "SOPORTE_REMOTO", "SOPORTE_INSITU"],
  },
  {
    title: "Software",
    path: "/software",
    icon: Boxes,
    roles: ["ADMINISTRADOR", "SOPORTE_REMOTO", "SOPORTE_INSITU"],
  },
  {
    title: "Planes",
    path: "/planes",
    icon: Package,
    roles: ["ADMINISTRADOR"],
  },
  {
    title: "Tickets",
    path: "/tickets",
    icon: Ticket,
    roles: [
      "ADMINISTRADOR",
      "SOPORTE_REMOTO",
      "SOPORTE_INSITU",
      "CLIENTE_EMPRESA",
      "CLIENTE_SUCURSAL",
      "CLIENTE_TRABAJADOR"
    ],
  },
  {
    title: "Cronograma de Citas",
    path: "/citas",
    icon: CalendarDays,
    roles: [
      "ADMINISTRADOR",
      "SOPORTE_INSITU",
      "CLIENTE_EMPRESA",
      "CLIENTE_SUCURSAL",
    ],
  },
];