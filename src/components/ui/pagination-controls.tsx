import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  lastPage: number;
  total: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  page,
  lastPage,
  total,
  limit = 5,
  onPageChange,
}: PaginationControlsProps) => {
  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Mostrando {startRecord}-{endRecord} de {total} resultados
      </p>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            className={`h-8 w-8 ${
              p === page ? "bg-orange-600 hover:bg-orange-700 text-white" : ""
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
