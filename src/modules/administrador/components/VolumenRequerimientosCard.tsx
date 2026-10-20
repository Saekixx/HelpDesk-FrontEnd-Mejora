import { cn } from "@/lib/utils";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { RequerimientoDia } from "../types/VolumenRequqerimientos";
import { Card } from "@/components/ui/card";

interface VolumenRequerimientosCardProps {
  title?: string;
  description?: string;
  ratioPorcentaje: number;
  totalRegistrados: number;
  totalResueltos: number;
  data: RequerimientoDia[];
  className?: string;
}

// Configuración de colores y etiquetas para el ChartContainer de Shadcn
const chartConfig = {
  creados: {
    label: "Creados",
    color: "#ff5722", // Naranja corporativo
  },
  resueltos: {
    label: "Resueltos",
    color: "#10b981", // Esmeralda / Verde
  },
} satisfies ChartConfig;

export const VolumenRequerimientosCard = ({
  title = "Volumen de Requerimientos",
  description = "Evolución de tickets Creados vs. Resueltos (Últimos 7 días)",
  ratioPorcentaje,
  totalRegistrados,
  totalResueltos,
  data,
  className,
}: VolumenRequerimientosCardProps) => {
  return (
    <Card
      className={cn(
        "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between",
        className,
      )}
    >
      <div>
        {/* Cabecera del componente */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {description}
              </p>
            </div>
          </div>

          {/* Leyenda y Badge de Ratio */}
          <div className="flex items-center gap-4 self-start sm:self-auto flex-wrap">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-orange-500 inline-block" />{" "}
                Creados
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-600 inline-block" />{" "}
                Resueltos
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="text-[10px] font-bold text-emerald-700 block uppercase leading-none">
                  Ratio
                </span>
                <span className="text-xs font-extrabold text-emerald-600">
                  {ratioPorcentaje}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico oficial con ChartContainer de Shadcn / Recharts */}
        <div className="my-6 w-full">
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 25, left: 25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCreados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff5722" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ff5722" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorResueltos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="dia"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                stroke="#64748b"
                fontSize={12}
                interval={0}
              />
              <ChartTooltip
                cursor={{
                  stroke: "#cbd5e1",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                type="monotone"
                dataKey="creados"
                stroke="#ff5722"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCreados)"
                dot={{
                  r: 4,
                  fill: "#ff5722",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#ff5722",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="resueltos"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorResueltos)"
                dot={{
                  r: 4,
                  fill: "#10b981",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#10b981",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Tarjetas inferiores divididas en 2 columnas simétricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tickets Registrados
          </p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            {totalRegistrados}
          </p>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tickets Resueltos
          </p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">
            {totalResueltos}
          </p>
        </div>
      </div>
    </Card>
  );
};
