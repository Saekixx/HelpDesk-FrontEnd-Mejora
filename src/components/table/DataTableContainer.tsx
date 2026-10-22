import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ColumnDef } from "@/types/table";
import { Inbox } from "lucide-react";

// Definimos las propiedades que recibirá el componente DataTableContainer
interface DataTableContainerProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

// Componente DataTableContainer para mostrar tablas con datos, carga y mensaje vacío
export function DataTableContainer<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No se encontraron registros.",
  className,
}: DataTableContainerProps<T>) {
  return (
    <Card
      className={cn(
        "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between",
        className,
      )}
    >
      <Table>
        <TableHeader className="bg-slate-50/80 border-b border-slate-200/80">
          <TableRow className="hover:bg-transparent border-none">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "text-[11px] font-extrabold text-slate-500 uppercase tracking-wider h-11 px-4",
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx} className="animate-pulse border-slate-100">
                {columns.map((col) => (
                  <TableCell key={col.key} className="py-4 px-4">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length > 0 ? (
            data.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                className="hover:bg-slate-50/60 transition-colors border-slate-100"
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "text-xs py-3.5 px-4 text-slate-700",
                      col.className,
                    )}
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-36 text-center text-slate-400"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Inbox className="h-8 w-8 text-slate-300" />
                  <p className="text-xs font-semibold">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
