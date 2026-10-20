import { User, UserDetail } from "./user.type";

export interface AuthData {
  token: string;
  user: User;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: AuthData;
}

export interface ConfirmRegisterPayload {
  token: string;
  password: string;
}

export interface ConfirmRegisterResponse {
  status: number;
  message: string;
  data: UserDetail;
}

export interface ForgotPasswordPayload {
  correo: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
