// src/services/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Función para crear una conexión de socket con el servidor
export const createSocketConnection = (
  userId: string,
  namespace: string,
): Socket => {
  return io(`${SOCKET_URL}/${namespace}`, {
    query: { userId },
    autoConnect: true,
  });
};
