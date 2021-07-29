import { Socket } from "socket.io";

export interface SocketMore extends Socket {
  userId?: string;
}
