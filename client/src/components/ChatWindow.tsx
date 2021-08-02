import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import SendIcon from "@material-ui/icons/Send";
import grey from "@material-ui/core/colors/grey";
import React, { useEffect } from "react";
import { useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import shallow from "zustand/shallow";
import socket from "../socket";
import useAuth from "../store/useAuth";
import useChat from "../store/useChat";
import MessageChat from "./MessageChat";

const useStyle = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  titleName: {
    marginLeft: "1rem",
  },
  form: {
    width: "100%",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    boxSizing: "border-box",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  chatArea: {
    marginTop: "1rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    overflowY: "scroll",
  },
  video: {
    height: "300px",
    width: "100%",
  },
});

interface Input {
  message: string;
}

const ChatWindow = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const classes = useStyle();
  const user = useAuth((state) => state.user);
  const { currentChat, messages, setMessages } = useChat(
    (state) => ({
      currentChat: state.currentChat,
      messages: state.messages,
      setMessages: state.updateMessages,
    }),
    shallow
  );
  useEffect(() => {
    if (scrollRef.current !== null) {
      scrollRef.current!.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentChat]);

  const { handleSubmit, setValue, control } = useForm<Input>({
    defaultValues: { message: "" },
  });

  const onSubmit: SubmitHandler<Input> = ({ message }) => {
    const trimmedMes = message.trimStart();
    if (trimmedMes !== "") {
      setMessages(trimmedMes, user!._id, currentChat!);
      setValue("message", "");
      socket.emit("private message", user!._id, currentChat!, trimmedMes);
    } else {
      setValue("message", "");
    }
  };

  if (!user) return null;
  const { friends } = user;
  const friendUser = friends.find((friend) => friend._id === currentChat);

  const messagesInChat =
    currentChat && messages?.[currentChat]
      ? messages[currentChat].map((message, i) => {
          let showAvatar: boolean;
          if (message.sender === user._id) {
            showAvatar =
              !messages[currentChat]?.[i + 1] ||
              messages[currentChat][i + 1].sender !== user._id;
          } else {
            showAvatar =
              !messages[currentChat]?.[i + 1] ||
              messages[currentChat][i + 1].sender === user._id;
          }
          return (
            <MessageChat
              key={i}
              align={user._id === message.sender ? "flex-end" : "flex-start"}
              currentUser={user}
              friendUser={friendUser!}
              message={message}
              showAvatar={showAvatar}
            />
          );
        })
      : [];

  const currentFriend = friends.find((friend) => friend._id === currentChat);
  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      <Box
        boxSizing="border-box"
        display="flex"
        alignItems="center"
        pl="2rem"
        pr="0.5rem"
        paddingY="0.5rem"
        flexShrink={0}
        borderBottom={1}
        borderColor={grey[400]}
        height="70px"
        width="100%"
      >
        {currentChat && (
          <>
            <Avatar src={currentFriend!.picture} alt="currentFriend!.name" />
            <Typography variant="h6" className={classes.titleName}>
              {currentFriend!.name}
            </Typography>
          </>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow="1"
        className={classes.chatArea}
      >
        {currentChat ? (
          <>
            {messagesInChat}
            <div ref={scrollRef}></div>
          </>
        ) : (
          <Typography variant="h4">
            Choose your friend to start chatting!
          </Typography>
        )}
      </Box>
      <Box>
        {currentChat && (
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Controller
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Chat"
                  multiline
                  maxRows={4}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit(onSubmit)();
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<SendIcon />}
                          size="small"
                          onClick={handleSubmit(onSubmit)}
                          disableElevation
                        >
                          Send
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              name="message"
              control={control}
            />
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;
