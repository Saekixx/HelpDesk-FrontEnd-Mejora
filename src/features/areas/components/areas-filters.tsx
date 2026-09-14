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
import { GetAreasFilterDto, OptionDto } from "../types/areas.dtos";

interface AreasFiltersProps {
  empresasOptions?: OptionDto[];
  sucursalesOptions?: OptionDto[];
  onApplyFilters: (filters: Partial<GetAreasFilterDto>) => void;
}

export const AreasFilters = ({
  empresasOptions = [],
  sucursalesOptions = [],
  onApplyFilters,
}: AreasFiltersProps) => {
  const [search, setSearch] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("all");
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const [selectedEstado, setSelectedEstado] = useState<string>("all");

  const handleApply = () => {
    const filters: Partial<GetAreasFilterDto> = {
      search: search.trim() || undefined,
      id_cliente:
        selectedEmpresa !== "all" ? Number(selectedEmpresa) : undefined,
      id_sucursal:
        selectedSucursal !== "all" ? Number(selectedSucursal) : undefined,
      is_active:
        selectedEstado === "all" ? undefined : selectedEstado === "true",
    };

    onApplyFilters(filters);
  };

  const getEmpresaLabel = () => {
    if (selectedEmpresa === "all") return "Empresa: Todas";
    const found = empresasOptions.find(
      (opt) => String(opt.value) === selectedEmpresa,
    );
    return found ? `Empresa: ${found.label}` : "Empresa: Todas";
  };

  const getSucursalLabel = () => {
    if (selectedSucursal === "all") return "Sucursal: Todas";
    const found = sucursalesOptions.find(
      (opt) => String(opt.value) === selectedSucursal,
    );
    return found ? `Sucursal: ${found.label}` : "Sucursal: Todas";
  };

  const getEstadoLabel = () => {
    if (selectedEstado === "true") return "Estado: Activos";
    if (selectedEstado === "false") return "Estado: Inactivos";
    return "Estado: Todos";
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Input Búsqueda */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar área por nombre, empresa o sucursal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="pl-9 bg-white border-gray-200 text-sm h-10"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full lg:w-auto">
          {/* Select Empresa */}
          <Select
            value={selectedEmpresa}
            onValueChange={(value) => setSelectedEmpresa(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-[170px] bg-white border-gray-200 h-10 text-sm">
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

          {/* Select Sucursal */}
          <Select
            value={selectedSucursal}
            onValueChange={(value) => setSelectedSucursal(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-[170px] bg-white border-gray-200 h-10 text-sm">
              <SelectValue>{getSucursalLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sucursal: Todas</SelectItem>
              {sucursalesOptions.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select Estado */}
          <Select
            value={selectedEstado}
            onValueChange={(value) => setSelectedEstado(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-[150px] bg-white border-gray-200 h-10 text-sm">
              <SelectValue>{getEstadoLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Estado: Todos</SelectItem>
              <SelectItem value="true">Activos</SelectItem>
              <SelectItem value="false">Inactivos</SelectItem>
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
