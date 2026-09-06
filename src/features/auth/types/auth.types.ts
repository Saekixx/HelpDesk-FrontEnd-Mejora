export interface User {
  nombre: string;
  apellido: string;
  correo: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}
