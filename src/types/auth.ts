// src/types/auth.ts
import type { Role } from "../config/rolePermissions";

// Estructura de datos del usuario autenticado
export interface User {
  id?: number; // Opcional por si viene del JWT
  nombre: string;
  apellido: string;
  correo: string;
  role: Role;
  id_empresa?: number | null;
  id_sucursal?: number | null;
  id_area?: number | null;
}

// Contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: {
    token: string;
    user: {
      id?: number;
      id_trabajador?: number;
      nombre: string;
      apellido: string;
      correo: string;
      role: string;
      id_empresa?: number | null;
      id_sucursal?: number | null;
      id_area?: number | null;
    };
  }) => void;
  logout: () => void;
}
