import { Socket } from "socket.io-client";

export interface SocketMore extends Socket {
  userId?: string;
}
