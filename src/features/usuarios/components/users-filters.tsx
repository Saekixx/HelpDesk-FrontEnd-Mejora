import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetUsersQueryParams } from "../types/user.types";

const ROLE_MAP: Record<string, number> = {
  Administrador: 1,
  "Soporte Remoto": 2,
  "Soporte Insitu": 3,
  "Cliente Empresa": 4,
  "Cliente Sucursal": 5,
  "Cliente Trabajador": 6,
};

interface UsersFiltersProps {
  onApplyFilters: (filters: Partial<GetUsersQueryParams>) => void;
}

export const UsersFilters = ({ onApplyFilters }: UsersFiltersProps) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const handleApply = () => {
    // Convertimos explícitamente el string 'true' / 'false' a booleano real
    let isActiveValue: boolean | undefined = undefined;
    if (status === "true") isActiveValue = true;
    if (status === "false") isActiveValue = false;

    onApplyFilters({
      search: search.trim() || undefined,
      id_rol: role === "ALL" ? undefined : ROLE_MAP[role],
      is_active: isActiveValue,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Input de búsqueda */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, correo o empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-gray-200"
        />
      </div>

      {/* Select Rol */}
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-full sm:w-[170px] bg-white border-gray-200 text-gray-700">
          <SelectValue>
            {role === "ALL" ? "Rol: Todos" : `Rol: ${role}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Rol: Todos</SelectItem>
          <SelectItem value="Administrador">Administrador</SelectItem>
          <SelectItem value="Soporte Remoto">Soporte Remoto</SelectItem>
          <SelectItem value="Soporte Insitu">Soporte Insitu</SelectItem>
          <SelectItem value="Cliente Empresa">Cliente Empresa</SelectItem>
          <SelectItem value="Cliente Sucursal">Cliente Sucursal</SelectItem>
          <SelectItem value="Cliente Trabajador">Cliente Trabajador</SelectItem>
        </SelectContent>
      </Select>

      {/* Select Estado */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full sm:w-[170px] bg-white border-gray-200 text-gray-700">
          <SelectValue>
            {status === "ALL"
              ? "Estado: Todos"
              : status === "true"
                ? "Estado: Activo"
                : "Estado: Inactivo"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Estado: Todos</SelectItem>
          <SelectItem value="true">Activo</SelectItem>
          <SelectItem value="false">Inactivo</SelectItem>
        </SelectContent>
      </Select>

      {/* Botón Aplicar Filtros */}
      <Button
        onClick={handleApply}
        className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium px-5 flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Aplicar Filtros
      </Button>
    </div>
  );
};
