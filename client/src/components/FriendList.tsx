import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import socket from "../socket";
import useAuth from "../store/useAuth";
import { toast } from "react-toastify";
import FriendItem from "./FriendItem";
import useChat from "../store/useChat";
import shallow from "zustand/shallow";
import grey from "@material-ui/core/colors/grey";
const useStyle = makeStyles({
  root: {
    width: "300px",
    height: "100%",
  },
  list: {
    overflowY: "scroll",
  },
  avatar: {
    width: "3.5rem",
    height: "3.5rem",
  },
  input: {
    width: "250px",
  },
});

interface InputAddFriend {
  email: string;
}

const FriendList = () => {
  const user = useAuth((state) => state.user);

  const { currentChat, setCurrentChat } = useChat(
    (state) => ({
      currentChat: state.currentChat,
      setCurrentChat: state.setCurrentChat,
    }),
    shallow
  );

  const [showAddFriend, setShowAddFriend] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    control,
  } = useForm<InputAddFriend>({ defaultValues: { email: "" } });

  const classes = useStyle();

  const onSubmit: SubmitHandler<InputAddFriend> = ({ email }) => {
    if (!isSubmitting) {
      if (user!.friends.find((friend) => friend.email === email)) {
        toast.error("Your friend has already exists in the friendlist");
      } else if (user!.email === email) {
        toast.error("You can't add yourself!");
      } else {
        socket.emit("add friend", email);
      }
      setValue("email", "");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      className={classes.root}
      borderRight={1}
      borderColor={grey[400]}
      flexShrink={0}
    >
      <Box
        boxSizing="border-box"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pl="0.5rem"
        pr="0.5rem"
        pt="0.5rem"
        pb="0.5rem"
        borderBottom={1}
        borderColor={grey[400]}
        height="70px"
        flexShrink={0}
      >
        <Typography variant="h6" noWrap={true}>
          {user!.name}
        </Typography>
        {showAddFriend ? (
          <Button color="secondary" onClick={() => setShowAddFriend(false)}>
            Close Add Friend
          </Button>
        ) : (
          <Button color="primary" onClick={() => setShowAddFriend(true)}>
            Add Friend
          </Button>
        )}
      </Box>
      {showAddFriend && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="start"
          mt="0.5rem"
          pb="0.5rem"
          height="60px"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              rules={{
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.email ? true : false}
                  {...(!!errors.email ? { helperText: "Invalid email." } : {})}
                  label="Add Friend(gmail)"
                  className={classes.input}
                />
              )}
              name="email"
              control={control}
            />
          </form>
        </Box>
      )}

      <Box
        display="flex"
        flexDirection="column"
        px="0.5rem"
        height="100%"
        py="0.5rem"
        className={classes.list}
      >
        {user!.friends.map((friend) => (
          <FriendItem
            isCurrentChat={friend._id === currentChat}
            key={friend._id}
            isOnline={friend.isOnline}
            name={friend.name}
            picture={friend.picture}
            setCurrentChat={setCurrentChat}
            _id={friend._id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FriendList;
