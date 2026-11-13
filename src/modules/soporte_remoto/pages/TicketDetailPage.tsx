import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useTicketDetail } from "@/hooks/ticket/useTickets";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { TicketSidebar } from "@/components/ticket/TicketSidebar";
import { TicketChatContainer } from "@/components/ticket/TicketChatContainer";
import { useChat } from "@/hooks/chat/useChat";
import { useAuth } from "@/context/useAuth";

const getBadgeStyleByEstado = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "pendiente":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "en progreso":
    case "asignado":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "derivado insitu":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "en espera repuesto":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "reabierto":
      return "bg-red-100 text-red-800 border-red-200";
    case "cerrado":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // Asegúrate de tener un hook de autenticación para obtener el usuario actual
  const navigate = useNavigate();
  const { ticket, isLoadingDetail } = useTicketDetail(id);
  const { mensajes, sendMessage } = useChat({
    ticket, // Le pasamos el ticket completo
    userId: user?.id || "",
  });

  if (isLoadingDetail) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff5722]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-sm font-bold text-slate-600">
          No se encontró el ticket solicitado.
        </p>
        <button
          onClick={() => navigate("/admin/tickets")}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    // Reducimos el padding superior p-4 en vez de p-6 y oscurecemos levemente el fondo bg-slate-100/80
    <div className="p-4 sm:p-5 bg-slate-100/80 min-h-[calc(100vh-50px)] space-y-3.5 font-sans text-xs">
      {/* HEADER PRINCIPAL COMPACTO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 px-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              MÓDULOS DE GESTIÓN {">"} TICKETS
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-extrabold text-[#ff5722] text-xs">
              PIN: {ticket.pin}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              Atención de Incidencia #{ticket.id_ticket}
            </h1>
            <Badge
              className={`font-extrabold text-[10px] px-2 py-0.5 border ${getBadgeStyleByEstado(ticket.estado)}`}
            >
              {ticket.estado.toUpperCase()}
            </Badge>
            <Badge
              className={`font-extrabold text-[10px] ${
                ticket.es_software
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {ticket.es_software ? "SOFTWARE" : "HARDWARE"}
            </Badge>
          </div>
        </div>
      </div>

      {/* CONTENEDOR DE DOS COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <TicketSidebar
          ticket={ticket}
          onBack={() => navigate("/soporte-tecnico/tickets")}
          onCloseTicket={() => toast.success("Ticket cerrado exitosamente")}
          onResumeAttenting={() => toast.success("Atención reanudada")}
          onReopenTicket={() => toast.info("Reabriendo ticket...")}
        />

        <TicketChatContainer
          ticket={ticket}
          mensajes={mensajes}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
