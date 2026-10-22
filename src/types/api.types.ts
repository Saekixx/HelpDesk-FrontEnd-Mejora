// Estructura genérica para respuestas estándar del Backend
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Estructura estándar para respuestas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
