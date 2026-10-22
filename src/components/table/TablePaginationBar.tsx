import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiMetaResponse } from "@/types/table";
import { cn } from "@/lib/utils";

// Definimos las propiedades que recibirá el componente TablePaginationBar
interface TablePaginationBarProps {
  meta: ApiMetaResponse;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}

// Componente TablePaginationBar para mostrar la barra de paginación de tablas
export const TablePaginationBar = ({
  meta,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TablePaginationBarProps) => {
  const { total, page, lastPage } = meta;

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      if (page > 2 && page < lastPage - 1) pages.push(page - 1);
      if (page !== 1 && page !== lastPage) pages.push(page);
      if (page < lastPage - 1 && page > 1) pages.push(page + 1);
      if (page < lastPage - 2) pages.push("...");
      pages.push(lastPage);
    }
    return Array.from(new Set(pages));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 text-xs text-slate-500 font-medium px-2">
      {/* Texto de Conteo */}
      <div>
        Mostrando{" "}
        <span className="font-extrabold text-slate-900">
          {startItem} a {endItem}
        </span>{" "}
        de{" "}
        <span className="font-extrabold text-slate-900">
          {total.toLocaleString()}
        </span>{" "}
        registros
      </div>

      <div className="flex items-center gap-6">
        {/* Selector de Filas por página de Shadcn */}
        <div className="flex items-center gap-2">
          <span>Filas por página:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => onPageSizeChange(Number(val))}
          >
            <SelectTrigger className="w-[70px] bg-white border-slate-200 rounded-lg text-xs h-8 font-bold text-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6" className="text-xs">
                6
              </SelectItem>
              <SelectItem value="10" className="text-xs">
                10
              </SelectItem>
              <SelectItem value="20" className="text-xs">
                20
              </SelectItem>
              <SelectItem value="50" className="text-xs">
                50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navegación por páginas con Buttons de Shadcn */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 w-8 text-slate-400 hover:text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <Button
                key={idx}
                variant={p === page ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(p)}
                className={cn(
                  "h-8 w-8 text-xs font-bold rounded-lg cursor-pointer",
                  p === page
                    ? "bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {p}
              </Button>
            ) : (
              <span key={idx} className="px-1 text-slate-400 font-bold">
                ...
              </span>
            ),
          )}

          <Button
            variant="ghost"
            size="icon"
            disabled={page >= lastPage}
            onClick={() => onPageChange(page + 1)}
            className="h-8 w-8 text-slate-400 hover:text-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
