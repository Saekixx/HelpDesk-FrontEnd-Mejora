import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Componente TableBadges para mostrar badges de estado y avatares de usuario

// Badge de Estado usando Badge de Shadcn
export const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "bg-emerald-50 text-emerald-600 border-emerald-100 font-bold hover:bg-emerald-50"
          : "bg-red-50 text-red-600 border-red-100 font-bold hover:bg-red-50"
      }
    >
      <span
        className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {isActive ? "Activo" : "Inactivo"}
    </Badge>
  );
};

// Avatar de Usuario usando Avatar de Shadcn
export const UserAvatar = ({
  name,
  surname,
}: {
  name: string;
  surname?: string;
}) => {
  const initials =
    `${name.charAt(0)}${surname ? surname.charAt(0) : ""}`.toUpperCase();

  return (
    <Avatar className="h-9 w-9 bg-slate-900 text-white font-bold text-xs">
      <AvatarFallback className="bg-slate-900 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
