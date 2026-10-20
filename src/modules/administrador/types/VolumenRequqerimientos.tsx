// Estructura de un punto en la evolución diaria (para el gráfico)
export interface RequerimientoDia {
  dia: string; // Ej: "Lun", "Mar", "Mié", etc.
  creados: number; // Cantidad de tickets creados/registrados
  resueltos: number; // Cantidad de tickets resueltos
}

// Estructura general que recibe el componente de Volumen de Requerimientos
export interface ResumenVolumenRequerimientos {
  ratio_porcentaje: number; // Porcentaje de tickets resueltos vs. registrados (resueltos/registrados * 100)
  total_registrados: number; // Total de tickets registrados/creados
  total_resueltos: number; // Total de tickets resueltos
  tendencia_dias: RequerimientoDia[];
}
