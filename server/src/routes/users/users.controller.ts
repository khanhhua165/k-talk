import { IUser } from "./user.interface";
import express, { Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";
import HttpError from "../../exceptions/httpError";
// import TokenData from "../../interfaces/tokenData.interface";
// import DataStoredInToken from "../../interfaces/dataStoredInToken";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT!);
const TTL_IN_MILISECOND = 600000;

export default class UsersController implements Controller {
  public path = "/user";
  public router = express.Router();
  private user = userModel;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.googleAuth);
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
      const user = await this.user.findOneAndUpdate(
        { email },
        { email, name, picture },
        {
          new: true,
          omitUndefined: true,
          upsert: true,
        }
      );
      res.status(200).json({ user });
    } catch (e) {
      return next(new HttpError());
    }
  };

  // private createToken(user: IUser): TokenData {
  //   const expiresIn = 60 * 60;
  //   const secret = process.env.JWT_SECRET;
  //   const dataStoredInToken: DataStoredInToken = {
  //     _id: user._id,
  //     name: user.name,
  //   };
  //   return {
  //     expiresIn,
  //     token: jwt.sign(dataStoredInToken, secret!, { expiresIn }),
  //   };
  // }
}
