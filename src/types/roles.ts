// src/router/roles.ts
// Definición de roles y rutas base para cada rol en la aplicación
// Se utiliza para determinar la ruta de inicio de cada rol y para la protección de rutas en el router principal.

export const ROLE_BASE_PATH = {
  ADMINISTRADOR: "/admin",
  SOPORTE_TECNICO: "/soporte-tecnico",
  SOPORTE_INSITU: "/soporte-insitu",
  CLIENTE_EMPRESA: "/cliente-empresa",
  CLIENTE_SUCURSAL: "/cliente-sucursal",
  CLIENTE_TRABAJADOR: "/cliente-trabajador",
} as const;

export type AppRole = keyof typeof ROLE_BASE_PATH;

// Devuelve la pantalla de inicio del rol, o null si el rol no es uno de los conocidos.
export const getRoleHome = (role: string | undefined): string | null => {
  if (role && Object.prototype.hasOwnProperty.call(ROLE_BASE_PATH, role)) {
    return `${ROLE_BASE_PATH[role as AppRole]}/dashboard`;
  }
  return null;
};
