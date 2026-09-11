import { useState } from "react";
import { Control } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResetPasswordFormData } from "../schemas/reset-password.schema";

interface Props {
  control: Control<ResetPasswordFormData>;
}

export const ResetPasswordFields = ({ control }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {/* Campo Nueva Contraseña */}
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-semibold text-slate-700">
              Nueva Contraseña
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-white border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus-visible:ring-[#ff5722] focus-visible:border-[#ff5722] text-xs"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage className="text-[11px] text-red-500 font-medium" />
          </FormItem>
        )}
      />

      {/* Campo Confirmar Contraseña */}
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-semibold text-slate-700">
              Confirmar Contraseña
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-white border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus-visible:ring-[#ff5722] focus-visible:border-[#ff5722] text-xs"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage className="text-[11px] text-red-500 font-medium" />
          </FormItem>
        )}
      />
    </>
  );
};
