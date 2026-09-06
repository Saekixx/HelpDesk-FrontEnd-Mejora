import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Building } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NAVIGATION_MENU } from "@/config/navigation";
import { useAuth } from "@/context/useAuth";

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const navigate = useNavigate();

  const isExpanded = state === "expanded";

  const filteredNav = NAVIGATION_MENU.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  const initials =
    `${user?.nombre?.[0] || ""}${user?.apellido?.[0] || ""}`.toUpperCase() ||
    "DS";

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#0b1329] border-r border-slate-800/60 text-slate-300 z-30 sticky top-0 h-screen"
    >
      {/* Brand Header */}
      <SidebarHeader className="h-16 flex flex-row items-center gap-3 px-4 border-b border-slate-800/40 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-[#ff5722] flex items-center justify-center text-white font-bold text-base shadow-lg shadow-orange-500/20 shrink-0">
          <Building className="h-5 w-5" />
        </div>
        {isExpanded && (
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-sm font-bold text-white tracking-tight leading-none truncate">
              Helpdesk
            </h1>
            <span className="text-[10px] text-slate-400 font-medium mt-1">
              v1.0
            </span>
          </div>
        )}
      </SidebarHeader>

      {/* Nav Menu */}
      <SidebarContent className="py-3 px-2">
        <SidebarMenu className="space-y-1">
          {filteredNav.map((item) => (
            <SidebarMenuItem key={item.path}>
              <NavLink to={item.path} className="w-full">
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors w-full ${
                      isActive
                        ? "bg-slate-800/90 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#ff5722] rounded-r-full" />
                    )}
                    <item.icon
                      className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                    />
                    {isExpanded && (
                      <span className="truncate text-xs">{item.title}</span>
                    )}
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="p-3 border-t border-slate-800/50 space-y-1.5 shrink-0">
        <button
          onClick={() => navigate("/perfil")}
          className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-slate-800/50 transition-colors group"
        >
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-bold text-white shrink-0 group-hover:border-[#ff5722]">
            {initials}
          </div>
          {isExpanded && (
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate group-hover:text-[#ff5722] transition-colors">
                {user?.nombre || "Daniel"} {user?.apellido || "Singer"}
              </p>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase truncate">
                {user?.role || "ADMINISTRADOR"}
              </p>
            </div>
          )}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isExpanded && <span>Cerrar sesión</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};
