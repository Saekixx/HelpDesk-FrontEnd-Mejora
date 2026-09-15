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
import { Search, Filter, RotateCcw } from "lucide-react";
import { GetAreasFilterDto } from "../types/areas.dtos";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";

interface AreasFiltersProps {
  onApplyFilters: (filters: Partial<GetAreasFilterDto>) => void;
}

export const AreasFilters = ({ onApplyFilters }: AreasFiltersProps) => {
  const [search, setSearch] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("all");
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const [selectedEstado, setSelectedEstado] = useState<string>("all");

  const {
    clientes: empresasOptions,
    sucursales: sucursalesOptions,
    setSelectedClienteId,
    loading,
  } = useCatalogOptions();

  const handleEmpresaChange = (value: string | null) => {
    const selectedValue = value ?? "all";
    setSelectedEmpresa(selectedValue);
    setSelectedSucursal("all");

    if (selectedValue === "all") {
      setSelectedClienteId(null);
    } else {
      setSelectedClienteId(Number(selectedValue));
    }
  };

  const handleApply = () => {
    onApplyFilters({
      search: search.trim() || undefined,
      id_cliente:
        selectedEmpresa !== "all" ? Number(selectedEmpresa) : undefined,
      id_sucursal:
        selectedSucursal !== "all" ? Number(selectedSucursal) : undefined,
      is_active:
        selectedEstado === "all" ? undefined : selectedEstado === "true",
    });
  };

  const handleReset = () => {
    setSearch("");
    setSelectedEmpresa("all");
    setSelectedSucursal("all");
    setSelectedEstado("all");
    setSelectedClienteId(null);
    onApplyFilters({
      search: undefined,
      id_cliente: undefined,
      id_sucursal: undefined,
      is_active: undefined,
    });
  };

  const selectedEmpresaObj = empresasOptions.find(
    (opt) => String(opt.value) === selectedEmpresa,
  );
  const selectedSucursalObj = sucursalesOptions.find(
    (opt) => String(opt.value) === selectedSucursal,
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedEmpresa !== "all" ||
    selectedSucursal !== "all" ||
    selectedEstado !== "all";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
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

      {/* Select Empresa */}
      <Select
        value={selectedEmpresa}
        onValueChange={handleEmpresaChange}
        disabled={loading.clientes}
      >
        <SelectTrigger className="w-full sm:w-auto min-w-[180px] max-w-[260px] bg-white border-gray-200 h-10 text-sm">
          <SelectValue
            placeholder={loading.clientes ? "Cargando..." : "Empresa: Todas"}
          >
            <span className="truncate block">
              {selectedEmpresa === "all"
                ? "Empresa: Todas"
                : `Empresa: ${selectedEmpresaObj?.label ?? selectedEmpresa}`}
            </span>
          </SelectValue>
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
        disabled={selectedEmpresa === "all" || loading.sucursales}
      >
        <SelectTrigger className="w-full sm:w-auto min-w-[180px] max-w-[260px] bg-white border-gray-200 h-10 text-sm">
          <SelectValue
            placeholder={
              loading.sucursales
                ? "Cargando..."
                : selectedEmpresa === "all"
                  ? "Seleccione Empresa"
                  : "Sucursal: Todas"
            }
          >
            <span className="truncate block">
              {selectedSucursal === "all"
                ? "Sucursal: Todas"
                : `Sucursal: ${selectedSucursalObj?.label ?? selectedSucursal}`}
            </span>
          </SelectValue>
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
          <SelectValue>
            {selectedEstado === "true"
              ? "Estado: Activo"
              : selectedEstado === "false"
                ? "Estado: Inactivo"
                : "Estado: Todos"}
          </SelectValue>
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
        className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium px-4 h-10 flex items-center gap-2 transition-colors whitespace-nowrap"
      >
        <Filter className="h-4 w-4" />
        Aplicar Filtros
      </Button>

      {/* Botón Limpiar Filtros */}
      {hasActiveFilters && (
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center gap-2 h-10"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
};
