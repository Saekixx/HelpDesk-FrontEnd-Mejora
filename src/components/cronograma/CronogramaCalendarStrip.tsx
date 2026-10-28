import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CronogramaCalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CronogramaCalendarStrip = ({
  selectedDate,
  onSelectDate,
}: CronogramaCalendarStripProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });

  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + index);
    return date;
  });

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setCurrentWeekStart(new Date(today.setDate(diff)));
    onSelectDate(new Date());
  };

  const formatDateLabel = (date: Date) => {
    return date
      .toLocaleDateString("es-ES", { month: "short", year: "numeric" })
      .toUpperCase();
  };

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="h-9 px-3 text-xs font-bold text-slate-700 rounded-xl cursor-pointer"
            >
              Hoy
            </Button>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevWeek}
                className="h-7 w-7 rounded-lg text-slate-600 hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-bold text-slate-800 px-2">
                {formatDateLabel(currentWeekStart)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextWeek}
                className="h-7 w-7 rounded-lg text-slate-600 hover:bg-white cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {["Mes", "Semana", "Día", "Agenda"].map((view) => (
              <button
                key={view}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  view === "Semana"
                    ? "bg-[#ff5722] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2 border-t border-slate-100">
          {weekDays.map((date) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const dayName = date
              .toLocaleDateString("es-ES", { weekday: "short" })
              .toUpperCase();
            const dayNumber = date.getDate();

            return (
              <button
                key={date.toISOString()}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-orange-50 border-orange-200 text-[#ff5722] shadow-xs"
                    : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  {dayName}
                </span>
                <span
                  className={`text-base font-extrabold mt-0.5 ${isSelected ? "text-[#ff5722]" : "text-slate-800"}`}
                >
                  {dayNumber}
                </span>
                {isToday && (
                  <span className="w-1 h-1 rounded-full bg-[#ff5722] mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
