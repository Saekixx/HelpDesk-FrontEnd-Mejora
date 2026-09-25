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
import { GetEquiposQueryParams } from "../types/equipo.entity";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";

interface EquiposFiltersProps {
  onApplyFilters: (filters: Partial<GetEquiposQueryParams>) => void;
}

export const EquiposFilters = ({ onApplyFilters }: EquiposFiltersProps) => {
  const [search, setSearch] = useState("");
  const [clienteId, setClienteId] = useState("ALL");
  const [sucursalId, setSucursalId] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const {
    clientes: clientesOptions,
    sucursales: sucursalesOptions,
    loading,
    setSelectedClienteId,
  } = useCatalogOptions();

  const selectedCliente = clientesOptions.find(
    (opt) => String(opt.value) === clienteId,
  );
  const selectedSucursal = sucursalesOptions.find(
    (opt) => String(opt.value) === sucursalId,
  );

  const handleClienteChange = (value: string | null) => {
    const normalizedValue = value ?? "ALL";
    setClienteId(normalizedValue);
    setSucursalId("ALL");
    if (normalizedValue !== "ALL") {
      setSelectedClienteId(Number(normalizedValue));
    } else {
      setSelectedClienteId(null);
    }
  };

  const handleApply = () => {
    let isActiveValue: boolean | undefined = undefined;
    if (status === "true") isActiveValue = true;
    if (status === "false") isActiveValue = false;

    onApplyFilters({
      search: search.trim() || undefined,
      id_cliente: clienteId === "ALL" ? undefined : Number(clienteId),
      id_sucursal: sucursalId === "ALL" ? undefined : Number(sucursalId),
      is_active: isActiveValue,
    });
  };

  const handleReset = () => {
    setSearch("");
    setClienteId("ALL");
    setSucursalId("ALL");
    setStatus("ALL");
    setSelectedClienteId(null);
    onApplyFilters({
      search: undefined,
      id_cliente: undefined,
      id_sucursal: undefined,
      is_active: undefined,
    });
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    clienteId !== "ALL" ||
    sucursalId !== "ALL" ||
    status !== "ALL";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Input de búsqueda */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por tipo, marca o número de serie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="pl-9 bg-white border-gray-200"
        />
      </div>

      {/* Select Cliente / Empresa */}
      <Select
        value={clienteId}
        onValueChange={handleClienteChange}
        disabled={loading.clientes}
      >
        <SelectTrigger className="w-full sm:w-auto min-w-[180px] max-w-[240px] bg-white border-gray-200 text-gray-700">
          <SelectValue>
            <span className="truncate block">
              {loading.clientes
                ? "Cargando..."
                : clienteId === "ALL"
                  ? "Empresa: Todas"
                  : `Empresa: ${selectedCliente?.label ?? clienteId}`}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Empresa: Todas</SelectItem>
          {clientesOptions.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select Sucursal */}
      <Select
        value={sucursalId}
        onValueChange={(val) => setSucursalId(val ?? "ALL")}
        disabled={loading.sucursales || clienteId === "ALL"}
      >
        <SelectTrigger className="w-full sm:w-auto min-w-[180px] max-w-[240px] bg-white border-gray-200 text-gray-700">
          <SelectValue>
            <span className="truncate block">
              {loading.sucursales
                ? "Cargando..."
                : sucursalId === "ALL"
                  ? "Sucursal: Todas"
                  : `Sucursal: ${selectedSucursal?.label ?? sucursalId}`}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Sucursal: Todas</SelectItem>
          {sucursalesOptions.map((opt) => (
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
        <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-200 text-gray-700">
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
        className="w-full sm:w-auto bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium px-5 flex items-center gap-2"
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
