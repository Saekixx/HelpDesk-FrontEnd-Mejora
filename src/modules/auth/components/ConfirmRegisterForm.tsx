// src/features/auth/components/ConfirmRegisterForm.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  confirmRegisterSchema,
  ConfirmRegisterFormValues,
} from "../schemas/confirm-register.schema";
import { confirmRegisterService } from "../services/auth.service";
import { ConfirmRegisterFields } from "./ConfirmRegisterFields";

interface ConfirmRegisterFormProps {
  token: string;
  onSuccess: () => void;
}

export const ConfirmRegisterForm = ({
  token,
  onSuccess,
}: ConfirmRegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConfirmRegisterFormValues>({
    resolver: zodResolver(confirmRegisterSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ConfirmRegisterFormValues) => {
    setIsLoading(true);

    try {
      await confirmRegisterService({
        token,
        password: values.password,
      });

      toast.success("¡Cuenta activada!", {
        description: "Tu contraseña ha sido registrada correctamente.",
      });

      onSuccess();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al activar la cuenta.";
      toast.error("Error al activar cuenta", { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ConfirmRegisterFields form={form} />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold h-11 rounded-xl transition-all mt-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creando cuenta...
            </span>
          ) : (
            "Activar y Guardar Contraseña"
          )}
        </Button>
      </form>
    </Form>
  );
};
