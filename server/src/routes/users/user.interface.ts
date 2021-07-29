import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  picture?: string;
  isOnline: boolean;
  friends?: string[];
}
