export interface User {
  nombre: string;
  apellido: string;
  correo: string;
  role: string;
  id_empresa: number | null;
  id_sucursal: number | null;
  id_area: number | null;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: AuthData;
}
