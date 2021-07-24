import App from "./app";
import UsersController from "./routes/users/users.controller";

const app = new App([new UsersController()], +process.env.PORT! || 5000);

app.listen();
