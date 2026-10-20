import { Control } from "react-hook-form";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ForgotPasswordFormData } from "../schemas/forgot-password.schema";

interface Props {
  control: Control<ForgotPasswordFormData>;
}

export const ForgotPasswordFields = ({ control }: Props) => {
  return (
    <FormField
      control={control}
      name="correo"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="text-xs font-semibold text-slate-700">
            Correo
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="tucorreo@empresa.com"
                className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus-visible:ring-[#ff5722] focus-visible:border-[#ff5722] text-xs"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage className="text-[11px] text-red-500 font-medium" />
        </FormItem>
      )}
    />
  );
};
