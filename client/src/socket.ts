import { SocketMore } from "./interfaces/socket.interface";
import { API_URL } from "./constants/api";
import { io } from "socket.io-client";

const socket: SocketMore = io(API_URL, { autoConnect: false });

//ANCHOR logging socket
socket.onAny((event, ...args) => console.log(event, args));

export default socket;
