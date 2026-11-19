import { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TicketCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reporteCierre: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const TicketCloseModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TicketCloseModalProps) => {
  const [reporteCierre, setReporteCierre] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporteCierre.trim()) return;

    await onSubmit(reporteCierre);
    setReporteCierre("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold text-sm tracking-wide">
              Cerrar Ticket de Soporte
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Reporte de Cierre / Solución Aplicada *
            </Label>
            <textarea
              className="w-full h-28 p-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 resize-none"
              placeholder="Ej. Se reinstaló el controlador de red y se verificó conectividad exitosamente."
              value={reporteCierre}
              onChange={(e) => setReporteCierre(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold rounded-xl text-xs px-4 cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
              )}
              Confirmar Cierre
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
