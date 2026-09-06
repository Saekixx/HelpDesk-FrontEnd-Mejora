/* eslint-disable preserve-caught-error */
import { api } from "@/lib/axios";
import { LoginFormData } from "../schemas/login.schema";
import { LoginResponse } from "../types/auth.types";
import { isAxiosError } from "axios";

export const loginService = async (
  data: LoginFormData,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const serverMessage = error.response.data?.message;
      throw new Error(
        Array.isArray(serverMessage)
          ? serverMessage[0]
          : serverMessage || "Credenciales inválidas",
      );
    }

    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión.",
    );
  }
};
