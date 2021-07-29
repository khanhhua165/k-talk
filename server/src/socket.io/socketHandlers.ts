import { IUser } from "./../routes/users/user.interface";
import { SocketMore } from "./../interfaces/socket.interface";
import userModel from "../routes/users/user.model";
import { Server } from "socket.io";

export const socketHandlers = (io: Server, socket: SocketMore) => {
  const getOnlineNotifications = ({ friendIds }: { friendIds: string[] }) => {
    socket.broadcast.to(friendIds).emit("friend online", socket.userId!);
  };

  const addFriend = async (email: string) => {
    const userId = socket.userId!;
    try {
      const friend = await userModel.findOne({ email });
      if (!friend) {
        socket
          .to(userId)
          .emit("add friend:err", "No user found with this email");
      } else {
        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { $push: { friends: friend._id } },
          { new: true }
        );
        await userModel.findByIdAndUpdate(friend._id, {
          $push: { friends: updatedUser!._id },
        });
        socket.to(userId).emit("add friend:success");
        socket.broadcast
          .to(friend._id)
          .emit("add friend:new", updatedUser!.email);
      }
    } catch (e) {
      socket
        .to(userId)
        .emit(
          "add friend:err",
          "There was an unexpected error, Please try again"
        );
    }
  };

  const getFriendList = async () => {
    try {
      const user = await userModel
        .findById(socket.userId!, "friends")
        .populate("friends");
      const friendList = user!.friends as unknown as IUser[];
      socket.emit("get friends:success", friendList);
    } catch (e: unknown) {
      socket.emit(
        "get friends:err",
        "There was an expected problem, please try again."
      );
    }
  };

  return { getOnlineNotifications, addFriend, getFriendList };
};
