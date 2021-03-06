import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";
import morgan from "morgan";
import { Server, Socket } from "socket.io";
import { socketHandlers } from "./socket.io/socketHandlers";

class App {
  public app: express.Application;
  public server: http.Server;
  public io: Server;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = port;
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
      },
    });

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.socketIo();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private socketIo() {
    const io = this.io;
    const onConnection = async (socket: Socket) => {
      const userId: string = socket.handshake.auth.userId!;
      socket.join(userId);
      const {
        getOnlineNotifications,
        addFriend,
        handlePrivateMessage,
        handleDisconnect,
      } = socketHandlers(io, socket);
      socket.on("notify connected", getOnlineNotifications);
      socket.on("add friend", addFriend);
      socket.on("private message", handlePrivateMessage);
      socket.on("disconnect", handleDisconnect);
    };

    io.on("connection", onConnection);
  }

  private connectToDatabase() {
    const mongodbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.73vlw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

    mongoose
      .connect(mongodbUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .catch((e) => console.log(e));
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`listening on port ${this.port}`);
    });
  }
}

export default App;
