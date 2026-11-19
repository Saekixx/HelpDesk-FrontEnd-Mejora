import { useState } from "react";
import { X, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TicketReopenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (motivoReapertura: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const TicketReopenModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TicketReopenModalProps) => {
  const [motivoReapertura, setMotivoReapertura] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivoReapertura.trim()) return;

    await onSubmit(motivoReapertura);
    setMotivoReapertura("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center">
              <RotateCcw className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold text-sm tracking-wide">
              Reabrir Incidencia
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
              Motivo de la Reapertura *
            </Label>
            <textarea
              className="w-full h-28 p-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 resize-none"
              placeholder="Ej. El error volvió a aparecer al reiniciar el equipo."
              value={motivoReapertura}
              onChange={(e) => setMotivoReapertura(e.target.value)}
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
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs px-4 cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
              )}
              Confirmar Reapertura
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
