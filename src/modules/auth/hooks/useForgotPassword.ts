import { useState } from "react";
import { ForgotPasswordFormData } from "../schemas/forgot-password.schema";
import { forgotPasswordService } from "../services/auth.service";

export const useForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestReset = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await forgotPasswordService(data);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestReset,
    isLoading,
    isSuccess,
    errorMessage,
  };
};
