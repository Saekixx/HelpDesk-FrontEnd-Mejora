import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

// Definimos las propiedades que recibirá el componente StatCard
interface StatCardProps {
  title: string;
  value: React.ReactNode | string | number;
  secondaryValue?: React.ReactNode | string | number;
  icon: React.ReactNode;
  iconContainerClassName?: string;
  trend?: React.ReactNode;
  trendClassName?: string;
  footerText?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  secondaryValue,
  icon,
  iconContainerClassName = "bg-slate-100 text-slate-600",
  trend,
  trendClassName,
  footerText,
  badge,
  className,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow",
        className,
      )}
    >
      {/* Cabecera: Título e Ícono */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
            iconContainerClassName,
          )}
        >
          {icon}
        </div>
      </div>

      {/* Cuerpo principal: Valor numérico y elementos al lado */}
      <div className="mt-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
            {value}
          </span>
          {secondaryValue && (
            <span className="text-base font-semibold text-slate-400">
              {secondaryValue}
            </span>
          )}
          {trend && (
            <span className={cn("text-xs font-semibold", trendClassName)}>
              {trend}
            </span>
          )}
        </div>

        {/* Sección inferior: Footer text o Badge */}
        {(footerText || badge) && (
          <div className="mt-2 flex items-center justify-between gap-2 text-xs">
            {footerText && (
              <span className="text-slate-500 font-medium">{footerText}</span>
            )}
            {badge && <div>{badge}</div>}
          </div>
        )}
      </div>
    </Card>
  );
};
