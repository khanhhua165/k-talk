import { API_URL } from "./constants/api";
import { io } from "socket.io-client";

const socket = io(API_URL, { autoConnect: false });

export default socket;
