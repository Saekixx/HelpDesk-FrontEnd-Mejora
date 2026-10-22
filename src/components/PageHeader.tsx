import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  category?: string;
  title: React.ReactNode; // Permite tanto texto string como elementos JSX (badges, contadores, etc.)
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  category,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 mb-2",
        className,
      )}
    >
      {/* Sección izquierda: Categoría, Título y Descripción */}
      <div className="space-y-1">
        {category && (
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5722]" />
            <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
              {category}
            </span>
          </div>
        )}

        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {description}
          </p>
        )}
      </div>

      {/* Sección derecha: Botones de Acción */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
