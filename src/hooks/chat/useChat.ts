// src/hooks/ticket/useChat.ts
import { useEffect, useState, useCallback } from "react";
import { createSocketConnection } from "@/lib/socket";
import {
  TicketChatMessage,
  TicketDetailBackend,
} from "@/types/ticket/ticket-chat.type";

interface UseChatProps {
  ticket: TicketDetailBackend | null;
  userId: string | number;
}

export const useChat = ({ ticket, userId }: UseChatProps) => {
  const [mensajes, setMensajes] = useState<TicketChatMessage[]>([]);
  const [socket, setSocket] = useState<any>(null);

  // Si el ticket es null, evitamos que crashee al leer propiedades
  const roomId = ticket ? String(ticket.id_ticket) : null;

  useEffect(() => {
    // Si no hay roomId o userId, no hacemos nada todavía
    if (!roomId || !userId || !ticket) return;

    const socketInstance = createSocketConnection(String(userId), "chat");
    setSocket(socketInstance);

    // Nos unimos a la sala del ticket
    socketInstance.on("connect", () => {
      console.log("Conectado al chat del ticket:", roomId);
      socketInstance.emit("join_room", { roomId });
    });

    // Escuchamos los mensajes históricos y los nuevos mensajes
    socketInstance.on("chat_history", (history: any[]) => {
      const formattedHistory: TicketChatMessage[] = history.map((msg) => {
        const senderIdNum = Number(msg.senderId);
        let emisor: "SOLICITANTE" | "TECNICO" | "SISTEMA" = "TECNICO";
        let autorNombre = "Soporte Técnico";

        if (senderIdNum === ticket.trabajador.id_trabajador) {
          emisor = "SOLICITANTE";
          autorNombre = `${ticket.trabajador.nombre} ${ticket.trabajador.apellido}`;
        } else if (
          ticket.soporte &&
          senderIdNum === ticket.soporte.id_soporte
        ) {
          emisor = "TECNICO";
          autorNombre = `${ticket.soporte.nombre} ${ticket.soporte.apellido}`;
        }

        return {
          id: msg.id,
          emisor,
          autorNombre,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          texto: msg.content,
        };
      });

      setMensajes(formattedHistory.reverse());
    });

    // Escuchamos los nuevos mensajes entrantes
    socketInstance.on("receive_message", (msg: any) => {
      const senderIdNum = Number(msg.senderId);
      let emisor: "SOLICITANTE" | "TECNICO" | "SISTEMA" = "TECNICO";
      let autorNombre = "Soporte Técnico";

      if (senderIdNum === ticket.trabajador.id_trabajador) {
        emisor = "SOLICITANTE";
        autorNombre = `${ticket.trabajador.nombre} ${ticket.trabajador.apellido}`;
      } else if (ticket.soporte && senderIdNum === ticket.soporte.id_soporte) {
        emisor = "TECNICO";
        autorNombre = `${ticket.soporte.nombre} ${ticket.soporte.apellido}`;
      }

      const newMsg: TicketChatMessage = {
        id: msg.id,
        emisor,
        autorNombre,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        texto: msg.content,
      };

      setMensajes((prev) => [...prev, newMsg]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId, userId, ticket]);

  // Función para enviar mensajes
  const sendMessage = useCallback(
    (text: string) => {
      if (!socket || !text.trim() || !roomId) return;

      socket.emit("send_message", {
        roomId: String(roomId),
        senderId: String(userId),
        content: text,
      });
    },
    [socket, roomId, userId],
  );

  return { mensajes, sendMessage };
};
