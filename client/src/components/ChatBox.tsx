import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import useAuth from "../store/useAuth";
import FriendList from "./FriendList";
import ChatWindow from "./ChatWindow";
const useStyle = makeStyles({
  root: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    height: "calc(100% - 64px)",
    maxWidth: "1100px",
  },
  box: {
    height: "100%",
    backgroundColor: "#F9FAFB",
  },
});

const ChatBox = () => {
  const classes = useStyle();
  const user = useAuth((state) => state.user);

  if (!user) return null;

  return (
    <Container maxWidth={false} className={classes.root}>
      <Box
        className={classes.box}
        display="flex"
        border={1}
        borderColor="#E5E7EB"
        borderRadius={5}
        boxShadow={2}
      >
        <FriendList />
        <ChatWindow />
      </Box>
    </Container>
  );
};

export default ChatBox;
