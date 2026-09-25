// Payload para registrar un equipo (POST /equipos)
export interface CreateEquipoDto {
  tipo: string;
  marca: string;
  num_serie: string;
  nombre_usuario?: string | null;
  ult_revision?: string | null;
  rev_programada?: string | null;
  id_trabajador?: number | null;
  id_cliente?: number | null;
  id_sucursal?: number | null;
  id_area?: number | null;
  is_active?: boolean;
}

// Payload para actualizar un equipo (PUT /equipos/:id)
export interface UpdateEquipoDto {
  tipo?: string;
  marca?: string;
  num_serie?: string;
  nombre_usuario?: string | null;
  ult_revision?: string | null;
  rev_programada?: string | null;
  id_trabajador?: number | null;
  id_cliente?: number | null;
  id_sucursal?: number | null;
  id_area?: number | null;
  is_active?: boolean;
}
