import { makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { OneUser } from "../interfaces/login.interface";
import { Message } from "../store/useChat";

interface Props {
  align: "flex-start" | "flex-end";
  currentUser: OneUser;
  friendUser: OneUser;
  message: Message;
  showAvatar: boolean;
}

const useStyle = makeStyles({
  root: {
    maxWidth: "65%",
  },
  bgFriend: {
    backgroundColor: "#E5E7EB",
  },
  bgMe: {
    backgroundColor: "#DB2777",
    color: "white",
  },
  avatar: {
    height: "30px",
    width: "30px",
  },
  opac: {
    opacity: 0,
  },
  text: {
    lineHeight: "0.75rem",
  },
  break: {
    wordBreak: "break-all",
  },
});

const MessageChat: React.FC<Props> = ({
  align,
  currentUser,
  friendUser,
  message,
  showAvatar,
}) => {
  const classes = useStyle();
  return (
    <Box
      display="flex"
      alignItems="center"
      alignSelf={align}
      boxSizing="border-box"
      paddingX="0.5 rem"
      paddingY="0.5rem"
      borderRadius={4}
      className={classes.root}
    >
      <Box
        order={currentUser._id === message.sender ? 1 : 2}
        borderRadius={4}
        paddingX="0.5rem"
        paddingY="0.5rem"
        boxShadow={2}
        mr={currentUser._id === message.sender ? "0.5rem" : "0rem"}
        className={`${
          currentUser._id === message.sender ? classes.bgMe : classes.bgFriend
        }`}
      >
        <Typography variant="body2" className={classes.break}>
          {message.message}
        </Typography>
      </Box>
      <Box
        order={currentUser._id === message.sender ? 2 : 1}
        mr={currentUser._id === message.sender ? "0rem" : "0.5rem"}
      >
        {showAvatar ? (
          <Avatar
            src={
              currentUser._id === message.sender
                ? currentUser.picture
                : friendUser.picture
            }
            alt={
              currentUser._id === message.sender
                ? currentUser.name
                : friendUser.name
            }
            className={classes.avatar}
          />
        ) : (
          <Avatar
            className={`${classes.opac} ${classes.avatar}`}
            src={
              currentUser._id === message.sender
                ? currentUser.picture
                : friendUser.picture
            }
            alt={
              currentUser._id === message.sender
                ? currentUser.name
                : friendUser.name
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default MessageChat;
