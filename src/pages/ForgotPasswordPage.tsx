// src/pages/ForgotPasswordPage.tsx
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
