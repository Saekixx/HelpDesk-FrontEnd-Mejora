import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { GetSucursalesFilterDto, OptionDto } from "../types/sucursal.dtos";

interface SucursalesFiltersProps {
  empresasOptions?: OptionDto[];
  onApplyFilters: (filters: Partial<GetSucursalesFilterDto>) => void;
  onNewSucursal?: () => void;
}

export const SucursalesFilters = ({
  empresasOptions = [],
  onApplyFilters,
}: SucursalesFiltersProps) => {
  const [search, setSearch] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("all");
  const [selectedEstado, setSelectedEstado] = useState<string>("all");

  const handleApply = () => {
    const filters: Partial<GetSucursalesFilterDto> = {
      search: search.trim() || undefined,
      id_cliente:
        selectedEmpresa !== "all" ? Number(selectedEmpresa) : undefined,
      is_active:
        selectedEstado === "all" ? undefined : selectedEstado === "true",
    };

    onApplyFilters(filters);
  };

  // Helper para mostrar el texto formateado en el botón del Select
  const getEmpresaLabel = () => {
    if (selectedEmpresa === "all") return "Empresa: Todas";
    const found = empresasOptions.find(
      (opt) => String(opt.value) === selectedEmpresa,
    );
    return found ? `Empresa: ${found.label}` : "Empresa: Todas";
  };

  const getEstadoLabel = () => {
    if (selectedEstado === "true") return "Estado: Activo";
    if (selectedEstado === "false") return "Estado: Inactivo";
    return "Estado: Todos";
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Campo de búsqueda */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por sucursal, dirección o encargado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="pl-9 bg-white border-gray-200 text-sm h-10"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Filtro Empresa */}
          <Select
            value={selectedEmpresa}
            onValueChange={(value) => setSelectedEmpresa(value ?? "all")}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-200 h-10 text-sm">
              <SelectValue>{getEmpresaLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Empresa: Todas</SelectItem>
              {empresasOptions.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro Estado */}
          <Select
            value={selectedEstado}
            onValueChange={(value) => setSelectedEstado(value ?? "all")}
          >
            <SelectTrigger className="w-full md:w-[160px] bg-white border-gray-200 h-10 text-sm">
              <SelectValue>{getEstadoLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Estado: Todos</SelectItem>
              <SelectItem value="true">Estado: Activo</SelectItem>
              <SelectItem value="false">Estado: Inactivo</SelectItem>
            </SelectContent>
          </Select>

          {/* Botón Aplicar Filtros */}
          <Button
            onClick={handleApply}
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium px-4 h-10 flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Filter className="h-4 w-4" />
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};
