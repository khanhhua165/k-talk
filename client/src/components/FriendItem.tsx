import { createStyles, makeStyles, withStyles } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const StyledBadge = withStyles((theme) =>
  createStyles({
    badge: {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  })
)(Badge);

const useStyle = makeStyles({
  avatar: {
    width: "3.5rem",
    height: "3.5rem",
  },
  root: {
    "&:hover": {
      backgroundColor: "#E5E7EB",
      cursor: "pointer",
    },
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "200ms",
  },
  selectBg: {
    backgroundColor: "#E5E7EB",
  },
});

interface Props {
  name: string;
  _id: string;
  picture?: string;
  isOnline: boolean;
  isCurrentChat: boolean;
  setCurrentChat: (chat: string) => void;
}

const FriendItem: React.FC<Props> = ({
  isOnline,
  name,
  picture,
  isCurrentChat,
  setCurrentChat,
  _id,
}) => {
  const classes = useStyle();
  return (
    <Box
      display="flex"
      alignItems="center"
      mb="1rem"
      pt="0.5rem"
      pb="0.5rem"
      pl="0.5rem"
      pr="0.5rem"
      borderRadius={3}
      className={`${isCurrentChat && classes.selectBg} ${classes.root}`}
      onClick={() => setCurrentChat(_id)}
    >
      {isOnline ? (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
        >
          <Avatar alt={name} src={picture!} className={classes.avatar} />
        </StyledBadge>
      ) : (
        <Avatar alt={name} src={picture!} className={classes.avatar} />
      )}

      <Box display="flex" flexDirection="column" ml="1rem">
        <Typography>{name}</Typography>
        <Typography variant="caption">
          {isOnline ? "Active now" : "Offline"}
        </Typography>
      </Box>
    </Box>
  );
};

export default FriendItem;
