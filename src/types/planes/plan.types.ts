export interface PlanItem {
  id_plan: number;
  numero_plan: number;
  tipo: string;
  servicio: string[];
  precio: number;
  limite_equipos: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PlanDetail = PlanItem;
