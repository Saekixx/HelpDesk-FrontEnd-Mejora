import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type CalendarViewMode = "Semana" | "Mes" | "Día" | "Agenda";

interface CronogramaCalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  viewMode?: CalendarViewMode;
  onViewModeChange?: (mode: CalendarViewMode) => void;
}

const getMondayOfWeek = (date: Date) => {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(copy.getFullYear(), copy.getMonth(), diff);
};

const getMonthGridDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  return Array.from({ length: totalCells }).map((_, idx) => {
    const dayNumber = idx - startOffset + 1;
    return new Date(year, month, dayNumber);
  });
};

export const CronogramaCalendarStrip = ({
  selectedDate,
  onSelectDate,
  viewMode: controlledViewMode,
  onViewModeChange,
}: CronogramaCalendarStripProps) => {
  const [internalView, setInternalView] = useState<CalendarViewMode>("Semana");
  const viewMode = controlledViewMode ?? internalView;

  const setViewMode = (mode: CalendarViewMode) => {
    if (!controlledViewMode) {
      setInternalView(mode);
    }
    onViewModeChange?.(mode);
  };

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getMondayOfWeek(selectedDate),
  );
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  useEffect(() => {
    setCurrentWeekStart(getMondayOfWeek(selectedDate));
    setCurrentMonthDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
  }, [selectedDate]);

  const weekDays = Array.from({ length: 7 }).map(
    (_, index) =>
      new Date(
        currentWeekStart.getFullYear(),
        currentWeekStart.getMonth(),
        currentWeekStart.getDate() + index,
      ),
  );

  const monthDays = getMonthGridDays(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
  );

  const handlePrev = () => {
    if (viewMode === "Mes") {
      setCurrentMonthDate(
        new Date(
          currentMonthDate.getFullYear(),
          currentMonthDate.getMonth() - 1,
          1,
        ),
      );
      return;
    }

    if (viewMode === "Día") {
      const prevDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() - 1,
      );
      onSelectDate(prevDay);
      return;
    }

    const prevWeek = new Date(
      currentWeekStart.getFullYear(),
      currentWeekStart.getMonth(),
      currentWeekStart.getDate() - 7,
    );
    setCurrentWeekStart(prevWeek);
    onSelectDate(prevWeek);
  };

  const handleNext = () => {
    if (viewMode === "Mes") {
      setCurrentMonthDate(
        new Date(
          currentMonthDate.getFullYear(),
          currentMonthDate.getMonth() + 1,
          1,
        ),
      );
      return;
    }

    if (viewMode === "Día") {
      const nextDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + 1,
      );
      onSelectDate(nextDay);
      return;
    }

    const nextWeek = new Date(
      currentWeekStart.getFullYear(),
      currentWeekStart.getMonth(),
      currentWeekStart.getDate() + 7,
    );
    setCurrentWeekStart(nextWeek);
    onSelectDate(nextWeek);
  };

  const handleToday = () => {
    const today = new Date();
    const cleanToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    setCurrentWeekStart(getMondayOfWeek(cleanToday));
    setCurrentMonthDate(
      new Date(cleanToday.getFullYear(), cleanToday.getMonth(), 1),
    );
    onSelectDate(cleanToday);
  };

  const headerLabel =
    viewMode === "Mes"
      ? currentMonthDate
          .toLocaleDateString("es-ES", { month: "long", year: "numeric" })
          .toUpperCase()
      : viewMode === "Día"
        ? selectedDate.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : currentWeekStart
            .toLocaleDateString("es-ES", { month: "short", year: "numeric" })
            .toUpperCase();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const todayClean = new Date();

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="h-9 px-3 text-xs font-bold text-slate-700 rounded-xl cursor-pointer"
            >
              Hoy
            </Button>

            {viewMode !== "Agenda" && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="h-7 w-7 rounded-lg text-slate-600 hover:bg-white cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-bold text-slate-800 px-2">
                  {headerLabel}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="h-7 w-7 rounded-lg text-slate-600 hover:bg-white cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(["Mes", "Semana", "Día", "Agenda"] as CalendarViewMode[]).map(
              (view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setViewMode(view)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === view
                      ? "bg-[#ff5722] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {view}
                </button>
              ),
            )}
          </div>
        </div>

        {viewMode === "Semana" && (
          <div className="grid grid-cols-7 gap-2 pt-2 border-t border-slate-100">
            {weekDays.map((date) => {
              const selected = isSameDay(date, selectedDate);
              const today = isSameDay(date, todayClean);
              const dayName = date
                .toLocaleDateString("es-ES", { weekday: "short" })
                .toUpperCase();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer border ${
                    selected
                      ? "bg-orange-50 border-orange-200 text-[#ff5722] shadow-xs"
                      : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    {dayName}
                  </span>
                  <span
                    className={`text-base font-extrabold mt-0.5 ${
                      selected ? "text-[#ff5722]" : "text-slate-800"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {today && (
                    <span className="w-1 h-1 rounded-full bg-[#ff5722] mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === "Mes" && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-7 gap-1 text-center">
              {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((d) => (
                <span
                  key={d}
                  className="text-[10px] font-bold text-slate-400 py-1"
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {monthDays.map((date) => {
                const inCurrentMonth =
                  date.getMonth() === currentMonthDate.getMonth();
                const selected = isSameDay(date, selectedDate);
                const today = isSameDay(date, todayClean);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => onSelectDate(date)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border relative ${
                      selected
                        ? "bg-orange-50 border-orange-200 text-[#ff5722]"
                        : inCurrentMonth
                          ? "bg-white border-slate-100 hover:bg-slate-50 text-slate-800"
                          : "bg-slate-50/60 border-transparent text-slate-300"
                    }`}
                  >
                    {date.getDate()}
                    {today && (
                      <span className="w-1 h-1 rounded-full bg-[#ff5722] absolute bottom-1 left-1/2 -translate-x-1/2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "Día" && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 py-1 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-2 capitalize">
              <CalendarDays className="h-4 w-4 text-[#ff5722]" />
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Usa las flechas para cambiar de día
            </span>
          </div>
        )}

        {viewMode === "Agenda" && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 py-1 text-xs text-slate-500 font-medium">
            <span>
              Mostrando citas según los filtros activos sin restringir a un solo
              día.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
