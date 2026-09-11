import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordService } from "../services/auth.service";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await resetPasswordService({ token, newPassword });
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
    isSuccess,
    errorMessage,
  };
};
