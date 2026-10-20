/* eslint-disable preserve-caught-error */
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
import { LoginFormData } from "../schemas/login.schema";
import {
  AuthData,
  ConfirmRegisterPayload,
  ConfirmRegisterResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/auth.types";

export const loginService = async (data: LoginFormData): Promise<AuthData> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data.data;
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

export const confirmRegisterService = async (
  data: ConfirmRegisterPayload,
): Promise<ConfirmRegisterResponse["data"]> => {
  try {
    const response = await api.post<ConfirmRegisterResponse>(
      "/auth/confirm-register",
      data,
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const serverMessage = error.response.data?.message;
      throw new Error(
        Array.isArray(serverMessage)
          ? serverMessage[0]
          : serverMessage ||
              "El enlace es inválido o ha expirado. Solicita una nueva invitación.",
      );
    }
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión.",
    );
  }
};

export const forgotPasswordService = async (
  data: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const serverMessage = error.response.data?.message;
      throw new Error(
        Array.isArray(serverMessage)
          ? serverMessage[0]
          : serverMessage ||
              "No se pudo procesar la solicitud de recuperación.",
      );
    }
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión.",
    );
  }
};

export const resetPasswordService = async (
  data: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  try {
    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const serverMessage = error.response.data?.message;
      throw new Error(
        Array.isArray(serverMessage)
          ? serverMessage[0]
          : serverMessage ||
              "El enlace de recuperación es inválido o ha expirado.",
      );
    }
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión.",
    );
  }
};
