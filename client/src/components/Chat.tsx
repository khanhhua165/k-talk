import { makeStyles } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import useAuth from "../store/useAuth";
import shallow from "zustand/shallow";
import Navbar from "./Navbar";
import { useCallback, useEffect, useState } from "react";
import socket from "../socket";
import ChatBox from "./ChatBox";
import { OneUser } from "../interfaces/login.interface";
import { toast } from "react-toastify";
import useChat from "../store/useChat";

const useStyle = makeStyles({
  root: {
    height: "100vh",
  },
});

const Chat = () => {
  const classes = useStyle();
  const {
    hasGoogleLogged,
    removeUser,
    user,
    updateUserFriendList,
    updateFriendStatus,
  } = useAuth(
    (state) => ({
      hasGoogleLogged: state.hasGoogleLogged,
      removeUser: state.removeUser,
      user: state.user,
      updateUserFriendList: state.updateUserFriendList,
      updateFriendStatus: state.updateFriendStatus,
    }),
    shallow
  );
  const { updateMessages, resetChat } = useChat((state) => ({
    updateMessages: state.updateMessages,
    resetChat: state.resetChat,
  }));
  const [hasSocketConnected, setHasSocketConnected] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    removeUser();
    resetChat();
    socket.disconnect();
  }, [removeUser, resetChat]);

  useEffect(() => {
    if (hasGoogleLogged) {
      socket.auth = { userId: user!._id };
      socket.connect();
      setHasSocketConnected(true);
      socket.emit("notify connected", {
        friendIds: user!.friends.map((friend) => friend._id),
      });
      socket.on("add friend:success", (friend: OneUser) => {
        console.log("moi di choi tet ve");
        updateUserFriendList(friend);
      });
      socket.on("add friend:request", (friend: OneUser, userId: string) => {
        if (userId === user!._id) {
          updateUserFriendList(friend);
          toast.success(`${friend.name} just added you!!`);
        }
      });
      socket.on("add friend:err", (message: string) => {
        toast.error(message);
      });
      socket.on("private message", (sender: string, message: string) => {
        updateMessages(message, sender, sender);
      });

      socket.on("friend online", (userId: string) => {
        updateFriendStatus(userId, true);
      });
      socket.on("user disconnection", (userId: string) => {
        console.log("co ai out ne");
        updateFriendStatus(userId, false);
      });
    }
    return () => {
      socket.off("add friend:success");
      socket.off("add friend:request");
      socket.off("add friend:err");
      socket.off("private message");
      socket.off("friend online");
      socket.off("user disconnection");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGoogleLogged]);

  if (!hasGoogleLogged) {
    return <Redirect to="/" />;
  }

  if (!hasSocketConnected) return null;
  return (
    <div className={classes.root}>
      <Navbar cb={handleLogout} />
      <ChatBox />
    </div>
  );
};

export default Chat;
