import { Bell, LogOut, MoreVertical, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ROLE_BASE_PATH } from "@/types/roles";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Obtenemos el prefijo de ruta correspondiente al rol del usuario actual
  const userRolePrefix = user?.role
    ? ROLE_BASE_PATH[user.role as keyof typeof ROLE_BASE_PATH] || ""
    : "";

  const initials =
    `${user?.nombre?.[0] || ""}${user?.apellido?.[0] || ""}`.toUpperCase() ||
    "DS";

  return (
    <header className="h-16 bg-white/80 border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-slate-700 hover:bg-slate-100" />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#ff5722]" />
        </button>

        <div className="h-5 w-[1px] bg-slate-200" />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 transition-colors text-left outline-none cursor-pointer border-none bg-transparent">
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.nombre || "Daniel"} {user?.apellido || "Singer"}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase text-right">
                {user?.role || "ADMINISTRADOR"}
              </p>
            </div>

            <MoreVertical className="h-3.5 w-3.5 text-slate-400" />

            <div className="h-8 w-8 rounded-full bg-slate-200/80 border border-slate-300/60 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
              {initials}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-800">
                  {user?.nombre || "Daniel"} {user?.apellido || "Singer"}
                </p>
                <p className="text-xs leading-none text-slate-400">
                  {user?.correo || "correo@ejemplo.com"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => navigate(`${userRolePrefix}/perfil`)}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4 text-slate-500" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
