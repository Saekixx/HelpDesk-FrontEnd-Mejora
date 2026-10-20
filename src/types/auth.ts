// src/types/auth.ts
import type { Role } from "../config/rolePermissions";

// Estructura de datos del usuario autenticado
export interface User {
  nombre: string;
  apellido: string;
  correo: string;
  role: Role;
}

// Contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: {
    token: string;
    user: { nombre: string; apellido: string; correo: string; role: string };
  }) => void;
  logout: () => void;
}
