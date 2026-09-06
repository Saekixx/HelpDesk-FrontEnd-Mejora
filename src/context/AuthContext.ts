// src/context/AuthContext.ts
import { createContext } from "react";
import type { AuthContextType } from "../types/auth";

// Contexto de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
