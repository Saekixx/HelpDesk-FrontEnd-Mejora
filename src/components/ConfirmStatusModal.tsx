import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

interface ConfirmStatusModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  itemName?: string;
  itemSubInfo?: string;
  itemBadge?: string;
  isActive: boolean; // Estado actual (true si está activo y se va a desactivar, false viceversa)
  isLoading?: boolean;
  onConfirm: () => void;
}

export const ConfirmStatusModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  itemName,
  itemSubInfo,
  itemBadge,
  isActive,
  isLoading = false,
  onConfirm,
}: ConfirmStatusModalProps) => {
  const actionText = isActive ? "Desactivar" : "Activar";
  const defaultTitle =
    title ||
    `¿Estás seguro de que deseas ${actionText.toLowerCase()} a ${itemName || "este registro"}?`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
        {/* Icono superior */}
        <div className="flex justify-center">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isActive
                ? "bg-rose-50 text-rose-600 border border-rose-100"
                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            }`}
          >
            <Power className="h-6 w-6" />
          </div>
        </div>

        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-base font-extrabold text-slate-900 tracking-tight">
            {defaultTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Tarjeta de detalle del elemento (si se provee) */}
        {itemName && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="space-y-0.5 truncate">
              <p className="text-xs font-bold text-slate-900 truncate">
                {itemName}
              </p>
              {itemSubInfo && (
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {itemSubInfo}
                </p>
              )}
            </div>
            {itemBadge && (
              <span className="shrink-0 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-slate-200/70 text-slate-700">
                {itemBadge}
              </span>
            )}
          </div>
        )}

        {/* Footer con Botones */}
        <DialogFooter className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 h-10 text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full sm:flex-1 h-10 text-xs font-bold text-white shadow-sm cursor-pointer rounded-xl ${
              isActive
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading
              ? "Procesando..."
              : isActive
                ? "Sí, Desactivar"
                : "Sí, Activar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
