// Estructura genérica para respuestas estándar del Backend
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Estructura estándar para respuestas paginadas planas (ej. Usuarios)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Estructura estándar para respuestas paginadas con objeto 'meta' anidado
export interface NestedPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
