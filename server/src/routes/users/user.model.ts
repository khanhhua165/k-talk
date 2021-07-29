import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  isOnline: { type: Boolean, required: true },
  friends: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
});

export default model<IUser>("User", UserSchema);
