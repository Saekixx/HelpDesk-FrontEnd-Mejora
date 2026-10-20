import * as React from "react";
import { cn } from "@/lib/utils";

// Definimos las propiedades que recibirá el componente PageHeader
interface PageHeaderProps {
  category?: string; 
  title: string; 
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
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80",
        className,
      )}
    >
      {/* Sección izquierda: Categoría, Título y Descripción */}
      <div className="space-y-1">
        {category && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500/80" />
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {category}
            </span>
          </div>
        )}
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 font-medium">{description}</p>
        )}
      </div>

      {/* Sección derecha: Botones de acción */}
      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
