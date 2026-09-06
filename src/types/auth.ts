// src/types/auth.ts
import type { Permission } from "../config/permissions";

export interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  rolNombre: string; // ej: "CLIENTE_TRABAJADOR", "ADMIN", "SOPORTE"
  permissions: Permission[]; // Array devuelto por la API o calculado
}
