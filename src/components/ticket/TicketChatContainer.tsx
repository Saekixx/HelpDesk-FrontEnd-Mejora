import * as React from "react";
import {
  Send,
  Paperclip,
  Download,
  Lock,
  AlertCircle,
  Eye,
  FileCheck,
  UserPlus,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TicketDetailBackend,
  TicketChatMessage,
} from "@/types/ticket/ticket-chat.type";

interface TicketChatContainerProps {
  ticket: TicketDetailBackend;
  mensajes: TicketChatMessage[];
  onSendMessage?: (text: string) => void;
  onAssignQuickSupport?: () => void;
}

export const TicketChatContainer = ({
  ticket,
  mensajes,
  onSendMessage,
  onAssignQuickSupport,
}: TicketChatContainerProps) => {
  const [textInput, setTextInput] = React.useState("");

  const isClosed = ticket.estado.toLowerCase() === "cerrado";
  const isPending = ticket.estado.toLowerCase() === "pendiente";

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isClosed || isPending) return;
    if (onSendMessage) onSendMessage(textInput);
    setTextInput("");
  };

  const nombreSolicitante = `${ticket.trabajador.nombre} ${ticket.trabajador.apellido}`;

  return (
    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden h-[820px] w-full">
      {/* HEADER DEL CHAT */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Canal de Soporte Directo
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {nombreSolicitante}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Registro de comunicación técnica en tiempo real
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[11px] font-bold border-slate-200 text-slate-700 gap-1.5 rounded-xl hover:bg-white cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" /> Descargar Logs
        </Button>
      </div>

      {/* BANNERS INFORMATIVOS DE ESTADO */}
      {isPending && (
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-800 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            El ticket se encuentra en estado PENDIENTE. Asigna un técnico para
            habilitar la mensajería.
          </span>
        </div>
      )}

      {ticket.estado.toLowerCase() === "derivado insitu" && (
        <div className="px-4 py-2.5 bg-purple-50 border-b border-purple-100 flex items-center justify-between text-purple-900 text-xs font-semibold">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600 shrink-0" />
            Ticket derivado a atención In-Situ en la sede del trabajador.
          </span>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100 font-bold text-[10px]">
            {ticket.trabajador.nombre_sucursal}
          </Badge>
        </div>
      )}

      {ticket.estado.toLowerCase() === "en espera repuesto" && (
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-900 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            Atención en pausa: Esperando confirmación de repuesto o componente.
          </span>
        </div>
      )}

      {isClosed && (
        <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-emerald-900 text-xs font-semibold">
          <span className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            Incidencia resuelta y archivada.
          </span>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[10px]">
            CERRADO
          </Badge>
        </div>
      )}

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
        {mensajes.map((msg) => {
          if (msg.emisor === "SISTEMA") {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[11px] font-semibold border border-slate-200/60 shadow-2xs">
                  {msg.timestamp} · {msg.texto}
                </div>
              </div>
            );
          }

          const isTecnico = msg.emisor === "TECNICO";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[80%] ${isTecnico ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isTecnico
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-orange-100 text-[#ff5722] border border-orange-200"
                }`}
              >
                {msg.autorNombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div className="space-y-1">
                <div
                  className={`flex items-center gap-2 ${isTecnico ? "justify-end" : ""}`}
                >
                  <span className="font-extrabold text-slate-900 text-[11px]">
                    {msg.autorNombre}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed space-y-2 ${
                    isTecnico
                      ? "bg-blue-600 text-white rounded-tr-none shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-2xs"
                  }`}
                >
                  {msg.texto && <p>{msg.texto}</p>}

                  {msg.adjunto && (
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                        isTecnico
                          ? "bg-blue-700/50 border-blue-500/50 text-white"
                          : "bg-slate-900 text-white border-slate-800"
                      }`}
                    >
                      <div className="space-y-0.5 truncate">
                        <p className="font-bold text-[11px] truncate">
                          {msg.adjunto.nombre}
                        </p>
                        <p className="text-[10px] text-slate-300 font-medium">
                          {msg.adjunto.peso}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-white hover:bg-white/20 text-[10px] font-bold gap-1 shrink-0"
                      >
                        <Eye className="h-3 w-3" /> Previsualizar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER DE ENTRADA DE CHAT */}
      <div className="p-3 bg-white border-t border-slate-100">
        {isPending ? (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <span>
                Asigna un técnico para iniciar la conversación con el
                trabajador.
              </span>
            </div>
            <Button
              onClick={onAssignQuickSupport}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold h-9 px-4 rounded-xl text-xs shrink-0 gap-1.5 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Asignar Soporte Ahora
            </Button>
          </div>
        ) : isClosed ? (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs font-semibold space-y-0.5">
            <p className="flex items-center justify-center gap-1.5 font-bold text-slate-700">
              <Lock className="h-3.5 w-3.5" /> El ticket se encuentra cerrado.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-400 hover:text-slate-600 rounded-xl shrink-0 cursor-pointer"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Escribe tu respuesta para el trabajador... (Enter para enviar)"
                className="h-11 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-medium"
              />

              <Button
                type="submit"
                disabled={!textInput.trim()}
                className="h-11 px-5 bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold rounded-xl shrink-0 shadow-xs gap-1.5 text-xs cursor-pointer"
              >
                <Send className="h-4 w-4" /> Enviar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
