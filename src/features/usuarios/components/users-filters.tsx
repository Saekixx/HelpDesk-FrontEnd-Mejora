import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetUsersQueryParams } from "../types/user.entity";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";

interface UsersFiltersProps {
  onApplyFilters: (filters: Partial<GetUsersQueryParams>) => void;
}

export const UsersFilters = ({ onApplyFilters }: UsersFiltersProps) => {
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const { roles: rolesOptions, loading } = useCatalogOptions();
  const selectedRole = rolesOptions.find((opt) => String(opt.value) === roleId);

  const handleApply = () => {
    let isActiveValue: boolean | undefined = undefined;
    if (status === "true") isActiveValue = true;
    if (status === "false") isActiveValue = false;

    onApplyFilters({
      search: search.trim() || undefined,
      id_rol: roleId === "ALL" ? undefined : Number(roleId),
      is_active: isActiveValue,
    });
  };

  const handleReset = () => {
    setSearch("");
    setRoleId("ALL");
    setStatus("ALL");
    onApplyFilters({
      search: undefined,
      id_rol: undefined,
      is_active: undefined,
    });
  };

  const hasActiveFilters =
    search.trim() !== "" || roleId !== "ALL" || status !== "ALL";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Input de búsqueda */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, correo o empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="pl-9 bg-white border-gray-200"
        />
      </div>

      {/* Select Rol Dinámico */}
      <Select
        value={roleId}
        onValueChange={(value) => setRoleId(value ?? "ALL")}
        disabled={loading.roles}
      >
        <SelectTrigger className="w-full sm:w-auto min-w-[200px] max-w-[280px] bg-white border-gray-200 text-gray-700">
          <SelectValue
            placeholder={loading.roles ? "Cargando roles..." : "Rol: Todos"}
          >
            <span className="truncate block">
              {roleId === "ALL"
                ? "Rol: Todos"
                : `Rol: ${selectedRole?.label ?? roleId}`}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Rol: Todos</SelectItem>
          {rolesOptions.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select Estado */}
      <Select
        value={status}
        onValueChange={(value) => setStatus(value ?? "ALL")}
      >
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

      {/* Botón Limpiar Filtros */}
      {hasActiveFilters && (
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
};
