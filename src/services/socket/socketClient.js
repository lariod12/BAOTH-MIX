import { io } from "socket.io-client";

const DEFAULT_SOCKET_URL = "http://localhost:3000";

export function createSocketClient() {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

  return io(socketUrl, {
    autoConnect: false,
    transports: ["websocket"]
  });
}
