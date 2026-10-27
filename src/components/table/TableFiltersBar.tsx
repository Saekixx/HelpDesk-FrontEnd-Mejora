import { useState, useEffect } from "react";
import { Search, Filter, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterDropdownConfig, FilterOption } from "@/types/table";

interface TableFiltersBarProps {
  searchPlaceholder?: string;
  dropdowns?: FilterDropdownConfig[];
  initialValues?: Record<string, any>;
  onApplyFilters: (filters: Record<string, any>) => void;
  onFilterChange?: (
    key: string,
    value: any,
    allFilters: Record<string, any>,
  ) => void; // <--- NUEVO: Prop para cascada en tiempo real
  onResetFilters?: () => void;
  multiRow?: boolean;
}

export const TableFiltersBar = ({
  searchPlaceholder = "Buscar...",
  dropdowns = [],
  initialValues = {},
  onApplyFilters,
  onFilterChange,
  onResetFilters,
  multiRow = false,
}: TableFiltersBarProps) => {
  const [filterValues, setFilterValues] =
    useState<Record<string, any>>(initialValues);

  useEffect(() => {
    setFilterValues(initialValues);
  }, [initialValues]);

  const handleInputChange = (key: string, value: any) => {
    const updated = { ...filterValues, [key]: value };
    setFilterValues(updated);

    // Si la prop está activa, notificamos el cambio al instante (ideal para cascada)
    if (onFilterChange) {
      onFilterChange(key, value, updated);
    }
  };

  const handleApply = () => {
    onApplyFilters(filterValues);
  };

  const handleReset = () => {
    setFilterValues({});
    if (onResetFilters) onResetFilters();
  };

  const getOptValue = (opt: FilterOption, dropdown: FilterDropdownConfig) => {
    if (dropdown.valueKey) return opt[dropdown.valueKey];
    if (opt.value !== undefined) return opt.value;
    if (opt.id !== undefined) return opt.id;
    return "";
  };

  const getOptLabel = (opt: FilterOption, dropdown: FilterDropdownConfig) => {
    if (dropdown.labelKey) return opt[dropdown.labelKey];
    if (opt.label !== undefined) return opt.label;
    if (opt.nombre !== undefined) return opt.nombre;
    return String(getOptValue(opt, dropdown));
  };

  const getFilterPrefix = (dropdown: FilterDropdownConfig) => {
    if (dropdown.label) return dropdown.label;
    if (dropdown.placeholder.includes(":")) {
      return dropdown.placeholder.split(":")[0].trim();
    }
    return dropdown.placeholder
      .replace(/^(Todos los|Todas las|Todos|Todas)\s+/i, "")
      .trim();
  };

  const renderSelectValue = (dropdown: FilterDropdownConfig) => {
    const currentValue = filterValues[dropdown.key];
    const prefix = getFilterPrefix(dropdown);

    if (
      currentValue === undefined ||
      currentValue === "all" ||
      currentValue === ""
    ) {
      return (
        <span className="truncate">
          <strong className="font-extrabold text-slate-900">{prefix}:</strong>{" "}
          <span className="text-slate-900 font-bold">Todos</span>
        </span>
      );
    }

    const selectedOpt = dropdown.options.find(
      (opt) => String(getOptValue(opt, dropdown)) === String(currentValue),
    );

    const selectedLabel = selectedOpt
      ? getOptLabel(selectedOpt, dropdown)
      : "Todos";

    return (
      <span className="truncate">
        <strong className="font-extrabold text-slate-900">{prefix}:</strong>{" "}
        <span className="text-slate-900 font-bold">{selectedLabel}</span>
      </span>
    );
  };

  return (
    <Card className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 mb-4">
      {/* Primera Fila: Buscador y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={filterValues.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="pl-10 bg-slate-50/50 border-slate-200 focus-visible:ring-[#ff5722] rounded-xl text-xs h-10"
          />
        </div>

        {/* Selects Desplegables en Fila Simple */}
        {!multiRow && dropdowns.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {dropdowns.map((dropdown) => (
              <Select
                key={dropdown.key}
                value={String(filterValues[dropdown.key] ?? "all")}
                onValueChange={(val) => handleInputChange(dropdown.key, val)}
              >
                <SelectTrigger className="w-auto min-w-[150px] bg-slate-50/50 border-slate-200 rounded-xl text-xs h-10 px-3">
                  <SelectValue>{renderSelectValue(dropdown)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                    className="text-xs font-semibold text-slate-700"
                  >
                    {getFilterPrefix(dropdown)}: Todos
                  </SelectItem>
                  {dropdown.options.map((opt, idx) => {
                    const optVal = getOptValue(opt, dropdown);
                    const optLabel = getOptLabel(opt, dropdown);
                    return (
                      <SelectItem
                        key={String(optVal) + idx}
                        value={String(optVal)}
                        className="text-xs font-medium"
                      >
                        {optLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleApply}
            className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-sm cursor-pointer"
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filtrar
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            title="Limpiar Filtros"
            className="h-10 w-10 border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Segunda Fila (para MultiRow) */}
      {multiRow && dropdowns.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
          {dropdowns.map((dropdown) => (
            <Select
              key={dropdown.key}
              value={String(filterValues[dropdown.key] ?? "all")}
              onValueChange={(val) => handleInputChange(dropdown.key, val)}
            >
              <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 rounded-xl text-xs h-10 px-3">
                <SelectValue>{renderSelectValue(dropdown)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="all"
                  className="text-xs font-semibold text-slate-700"
                >
                  {getFilterPrefix(dropdown)}: Todos
                </SelectItem>
                {dropdown.options.map((opt, idx) => {
                  const optVal = getOptValue(opt, dropdown);
                  const optLabel = getOptLabel(opt, dropdown);
                  return (
                    <SelectItem
                      key={String(optVal) + idx}
                      value={String(optVal)}
                      className="text-xs font-medium"
                    >
                      {optLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </Card>
  );
};
