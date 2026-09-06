import { LoginForm } from "@/features/auth/components/LoginForm";
import { SideBanner } from "@/features/auth/components/SideBanner";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-sans antialiased">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 flex overflow-hidden">
        <LoginForm />
        <SideBanner />
      </div>
    </div>
  );
}
