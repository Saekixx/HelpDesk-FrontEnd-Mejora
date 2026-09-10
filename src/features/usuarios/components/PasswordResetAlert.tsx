import { AlertTriangle, KeyRound } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PasswordResetAlertProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const PasswordResetAlert = ({
  checked,
  onCheckedChange,
}: PasswordResetAlertProps) => {
  return (
    <div className="space-y-3 pt-2">
      {/* Alerta Informativa */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-amber-900 shadow-sm">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-semibold text-xs text-amber-950">
            Advertencia de Seguridad
          </h5>
          <p className="text-xs leading-relaxed text-amber-800">
            Restablecer la contraseña generará una nueva credencial y enviará un
            correo de recuperación al usuario.
          </p>
        </div>
      </div>

      {/* Control Interactivo de Restablecimiento */}
      <div
        onClick={() => onCheckedChange(!checked)}
        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
          checked
            ? "border-[#FF5722] bg-orange-50/60 ring-1 ring-[#FF5722]"
            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${checked ? "bg-[#FF5722] text-white" : "bg-gray-200 text-gray-600"}`}
          >
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <Label
              htmlFor="resetPassword"
              className="text-xs font-semibold text-gray-900 cursor-pointer block"
            >
              Restablecer contraseña
            </Label>
            <span className="text-[11px] text-gray-500 block">
              Generar un enlace/token de recuperación inmediatamente
            </span>
          </div>
        </div>

        <Checkbox
          id="resetPassword"
          checked={checked}
          onCheckedChange={(val) => onCheckedChange(val === true)}
          className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#FF5722] data-[state=checked]:border-[#FF5722]"
        />
      </div>
    </div>
  );
};
