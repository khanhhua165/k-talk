import userModel from "../routes/users/user.model";
import { Server, Socket } from "socket.io";

export const socketHandlers = (io: Server, socket: Socket) => {
  const userId: string = socket.handshake.auth.userId!;
  const getOnlineNotifications = ({ friendIds }: { friendIds: string[] }) => {
    io.to(friendIds).emit("friend online", userId);
  };

  const addFriend = async (email: string) => {
    try {
      const friend = await userModel.findOne({ email });
      if (!friend) {
        io.to(userId).emit("add friend:err", "No user found with this email");
      } else {
        const user = await userModel.findById(userId);
        if (
          user?.friends &&
          user.friends.findIndex((friendId) => friendId === friend._id) === -1
        ) {
          return io
            .to(userId)
            .emit("add friend:err", "User has already been added!");
        }
        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { $push: { friends: friend._id } },
          { new: true }
        );
        await userModel.findByIdAndUpdate(friend._id, {
          $push: { friends: updatedUser!._id },
        });
        io.to(userId).emit("add friend:success", {
          _id: friend._id,
          name: friend.name,
          isOnline: friend.isOnline,
          picture: friend.picture,
        });
        socket.broadcast.emit(
          "add friend:request",
          {
            _id: updatedUser!._id,
            picture: updatedUser!.picture,
            name: updatedUser!.name,
            email: updatedUser!.email,
            isOnline: true,
          },
          friend._id
        );
      }
    } catch (e: unknown) {
      io.to(userId).emit(
        "add friend:err",
        "There was an unexpected error, Please try again"
      );
    }
  };

  const handlePrivateMessage = (
    sender: string,
    to: string,
    message: string
  ) => {
    io.to(to).emit("private message", sender, message);
  };

  const handleDisconnect = async () => {
    await userModel.findByIdAndUpdate(
      userId,
      { isOnline: false },
      { new: true }
    );
    io.emit("user disconnection", userId);
  };

  return {
    getOnlineNotifications,
    addFriend,
    handlePrivateMessage,
    handleDisconnect,
  };
};
