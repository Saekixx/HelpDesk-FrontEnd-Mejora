import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/auth";
import type { Role } from "../config/rolePermissions";
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

    const userWithPermissions: User = {
      ...data.user,
      role: userRole,
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

  // Renderiza el proveedor de contexto con los valores de autenticación
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
