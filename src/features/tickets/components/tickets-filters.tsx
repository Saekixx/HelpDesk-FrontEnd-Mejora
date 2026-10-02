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
import { GetTicketsQueryParamsDto } from "../types/ticket.dto";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";

interface TicketsFiltersProps {
  onApplyFilters: (filters: Partial<GetTicketsQueryParamsDto>) => void;
}

export const TicketsFilters = ({ onApplyFilters }: TicketsFiltersProps) => {
  const [search, setSearch] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("all");
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedEstado, setSelectedEstado] = useState<string>("all");

  const {
    clientes,
    sucursales,
    areas,
    setSelectedClienteId,
    setSelectedSucursalId,
    loading,
  } = useCatalogOptions();

  // Cambio de Empresa (con actualización en cascada)
  const handleEmpresaChange = (val: string) => {
    setSelectedEmpresa(val);
    setSelectedSucursal("all");
    setSelectedArea("all");

    if (val !== "all") {
      setSelectedClienteId(Number(val));
    } else {
      setSelectedClienteId(null);
    }
  };

  // Cambio de Sucursal (con actualización en cascada)
  const handleSucursalChange = (val: string) => {
    setSelectedSucursal(val);
    setSelectedArea("all");

    if (val !== "all") {
      setSelectedSucursalId(Number(val));
    } else {
      setSelectedSucursalId(null);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      search: search.trim() || undefined,
      id_cliente:
        selectedEmpresa !== "all" ? Number(selectedEmpresa) : undefined,
      id_sucursal:
        selectedSucursal !== "all" ? Number(selectedSucursal) : undefined,
      id_area: selectedArea !== "all" ? Number(selectedArea) : undefined,
      estado: selectedEstado !== "all" ? selectedEstado : undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setSelectedEmpresa("all");
    setSelectedSucursal("all");
    setSelectedArea("all");
    setSelectedEstado("all");
    setSelectedClienteId(null);
    setSelectedSucursalId(null);

    onApplyFilters({
      search: undefined,
      id_cliente: undefined,
      id_sucursal: undefined,
      id_area: undefined,
      estado: undefined,
    });
  };

  const selectedEmpresaObj = clientes.find(
    (opt) => String(opt.value) === selectedEmpresa,
  );
  const selectedSucursalObj = sucursales.find(
    (opt) => String(opt.value) === selectedSucursal,
  );
  const selectedAreaObj = areas.find(
    (opt) => String(opt.value) === selectedArea,
  );

  const getEstadoLabel = (val: string) => {
    switch (val) {
      case "Pendiente":
        return "Estado: Pendiente";
      case "Asignado":
        return "Estado: Asignado";
      case "En Progreso":
        return "Estado: En Progreso";
      case "Reabierto":
        return "Estado: Reabierto";
      case "Cerrado":
        return "Estado: Cerrado";
      default:
        return "Estado: Todos";
    }
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedEmpresa !== "all" ||
    selectedSucursal !== "all" ||
    selectedArea !== "all" ||
    selectedEstado !== "all";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6 space-y-4">
      {/* Campo de búsqueda */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por código (#502480), asunto o usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="pl-9 bg-white border-gray-200 text-sm h-10 w-full"
        />
      </div>

      {/* Selects y Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Select Empresa */}
        <Select
          value={selectedEmpresa}
          onValueChange={(val) => handleEmpresaChange(val ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-auto min-w-[180px] max-w-[320px] bg-white border-gray-200 h-10 text-sm gap-2">
            <SelectValue className="truncate">
              {loading.clientes
                ? "Cargando..."
                : selectedEmpresa === "all"
                  ? "Empresa: Todas"
                  : `Empresa: ${selectedEmpresaObj?.label ?? selectedEmpresa}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Empresa: Todas</SelectItem>
            {clientes.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Select Sucursal */}
        <Select
          value={selectedSucursal}
          onValueChange={(val) => handleSucursalChange(val ?? "all")}
          disabled={selectedEmpresa === "all" || loading.sucursales}
        >
          <SelectTrigger className="w-full sm:w-auto min-w-[170px] max-w-[280px] bg-white border-gray-200 h-10 text-sm gap-2">
            <SelectValue className="truncate">
              {loading.sucursales
                ? "Cargando..."
                : selectedSucursal === "all"
                  ? "Sucursal: Todas"
                  : `Sucursal: ${selectedSucursalObj?.label ?? selectedSucursal}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sucursal: Todas</SelectItem>
            {sucursales.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Select Área */}
        <Select
          value={selectedArea}
          onValueChange={(val) => setSelectedArea(val ?? "all")}
          disabled={selectedSucursal === "all" || loading.areas}
        >
          <SelectTrigger className="w-full sm:w-auto min-w-[160px] max-w-[250px] bg-white border-gray-200 h-10 text-sm gap-2">
            <SelectValue className="truncate">
              {loading.areas
                ? "Cargando..."
                : selectedArea === "all"
                  ? "Área: Todas"
                  : `Área: ${selectedAreaObj?.label ?? selectedArea}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Área: Todas</SelectItem>
            {areas.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Select Estado */}
        <Select
          value={selectedEstado}
          onValueChange={(val) => setSelectedEstado(val ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-auto min-w-[160px] bg-white border-gray-200 h-10 text-sm gap-2">
            <SelectValue>{getEstadoLabel(selectedEstado)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Estado: Todos</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Asignado">Asignado</SelectItem>
            <SelectItem value="En Progreso">En Progreso</SelectItem>
            <SelectItem value="Reabierto">Reabierto</SelectItem>
            <SelectItem value="Cerrado">Cerrado</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón Aplicar Filtros */}
        <Button
          onClick={handleApply}
          className="ml-auto bg-[#0A1128] hover:bg-[#121A38] text-white font-medium px-4 h-10 flex items-center gap-2 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Aplicar Filtros
        </Button>

        {/* Botón Limpiar */}
        {hasActiveFilters && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center gap-2 h-10"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
};
