import { CalendarPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const AccionesRapidasCard = () => {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs">
      <CardContent className="p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <span className="text-[#ff5722]">⚡</span> Acciones Rápidas
        </h3>

        <div className="space-y-2.5">
          <Button
            onClick={() =>
              toast.success("Modal de agendar cita en desarrollo...")
            }
            className="w-full h-11 bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />+ Agendar Cita de
            Mantenimiento
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast.info("Generando PDF de programación diaria...")
            }
            className="w-full h-11 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-semibold rounded-xl text-xs cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4 text-slate-500" />
            Exportar Programación del Día (PDF)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
