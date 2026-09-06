import { Mail, Lock, Eye, EyeOff, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm = () => {
  const {
    form,
    onSubmit,
    isSubmitting,
    showPassword,
    toggleShowPassword,
    apiError,
  } = useLoginForm();

  return (
    <div className="flex-1 p-8 sm:p-10 pr-6">
      {/* Logo e Icono */}
      <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff5722] mb-6">
        <LifeBuoy className="h-5 w-5" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        Bienvenido de vuelta
      </h1>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-[280px]">
        Ingresa tus credenciales para acceder al panel de soporte.
      </p>

      {/* Proveedor de Formulario de Shadcn */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium">
              {apiError}
            </div>
          )}

          {/* Campo Correo con Shadcn FormField */}
          <FormField
            control={form.control}
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

          {/* Campo Contraseña con Shadcn FormField */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  Contraseña
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
                      onClick={toggleShowPassword}
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

          <div className="text-right pt-1">
            <a
              href="#"
              className="text-xs font-medium text-[#ff5722] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-xl transition-all shadow-md shadow-orange-500/20 text-xs mt-2"
          >
            {isSubmitting ? "Iniciando sesión..." : "Ingresar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
