// src/features/auth/components/ConfirmRegisterFields.tsx

import { UseFormReturn } from "react-hook-form";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ConfirmRegisterFormValues } from "../schemas/confirm-register.schema";

interface ConfirmRegisterFieldsProps {
  form: UseFormReturn<ConfirmRegisterFormValues>;
}

export const ConfirmRegisterFields = ({ form }: ConfirmRegisterFieldsProps) => {
  return (
    <>
      {/* Nueva Contraseña */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold text-gray-700">
              Nueva Contraseña
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-11 rounded-xl border-gray-200 text-sm focus-visible:ring-[#FF5722]"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )}
      />

      {/* Confirmar Contraseña */}
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold text-gray-700">
              Confirmar Contraseña
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-11 rounded-xl border-gray-200 text-sm focus-visible:ring-[#FF5722]"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )}
      />
    </>
  );
};
