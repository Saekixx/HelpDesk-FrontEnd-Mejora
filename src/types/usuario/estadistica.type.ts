export interface DetalleUsuarios {
  cantidad: number;
  activos: number;
  inactivos: number;
}

export interface DetalleRol {
  cantidad: number;
}

export interface EstadisticaUsuarios {
  totalUsuarios: DetalleUsuarios;
  personalTecnico: DetalleRol;
  cuentasClientes: DetalleRol;
}
