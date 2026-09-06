import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/auth";
import { ROLE_PERMISSIONS } from "../config/rolePermissions";
import type { Role } from "../config/rolePermissions";
import type { Permission } from "../config/permissions";
import { useNavigate } from "react-router-dom";

// Componente proveedor de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  // Función para iniciar sesión y almacenar el token y el usuario en el estado y en localStorage
  const login = (data: {
    token: string;
    user: { nombre: string; apellido: string; correo: string; role: string };
  }) => {
    const userRole = data.user.role as Role;
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    const userWithPermissions: User = {
      ...data.user,
      role: userRole,
      permissions,
    };

    setToken(data.token);
    setUser(userWithPermissions);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userWithPermissions));
  };

  // Función para cerrar sesión y limpiar el estado y localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Función para verificar si el usuario tiene un permiso específico
  const can = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  // Renderiza el proveedor de contexto con los valores de autenticación
  return (
    <AuthContext.Provider value={{ user, token, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};
