export interface UsuarioRequest {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  id_rol: number;
  id_cliente?: number | null;
  id_sucursal?: number | null;
  id_area?: number | null;
  zonas_ids?: number[]; // IDs de las zonas asociadas al usuario (para soporte in-situ)
}
