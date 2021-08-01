import express, { Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";
import HttpError from "../../exceptions/httpError";
// import TokenData from "../../interfaces/tokenData.interface";
// import DataStoredInToken from "../../interfaces/dataStoredInToken";
import { OAuth2Client } from "google-auth-library";
import { IUser } from "./user.interface";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT!);

export default class UsersController implements Controller {
  public path = "/user";
  public router = express.Router();
  private user = userModel;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.googleAuth);
    this.router.get(`${this.path}/:id/friends`, this.getFriendList);
  }

  private googleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT!,
      });
      const { name, email, picture } = ticket.getPayload()!;
      const user = await this.user
        .findOneAndUpdate(
          { email },
          { email, name, picture, isOnline: true },
          {
            new: true,
            omitUndefined: true,
            upsert: true,
          }
        )
        .populate("friends", "name email picture isOnline friends");
      res.status(200).json({ user });
    } catch (e) {
      return next(new HttpError());
    }
  };

  private getFriendList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.params.id;
    try {
      const user = await this.user
        .findById(userId, "friends")
        .populate("friends");
      const friendList = user!.friends as unknown as IUser[];
      res.status(200).json(friendList);
    } catch (e: unknown) {
      return next(new HttpError());
    }
  };
}
