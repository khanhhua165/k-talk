import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  layout: {
    height: "100vh",
    width: "100vw",
    top: 0,
    position: "fixed",
    backgroundColor: "#0040C1",
    overflow: "hidden",
    zIndex: 2,
  },
  cube: {
    position: "absolute",
    top: "80vh",
    left: "40vw",
    width: 10,
    height: 10,
    border: "solid 1px #003298",
    transformOrigin: "top left",
    transform: "scale(0) rotate(0deg) translate(-50%, -50%)",
    zIndex: 3,
    animation: "cube 12s ease-in forwards infinite",
    "&:nth-child(2n)": {
      borderColor: "#0051f4",
    },
    "&:nth-child(2)": {
      animationDelay: "1s",
      left: "25vw",
      top: "40vh",
    },
    "&:nth-child(3)": {
      animationDelay: "2s",
      left: "75vw",
      top: "50vh",
    },
    "&:nth-child(4)": {
      animationDelay: "3s",
      left: "90vw",
      top: "10vh",
    },
    "&:nth-child(5)": {
      animationDelay: "4s",
      left: "10vw",
      top: "85vh",
    },
    "&:nth-child(6)": {
      animationDelay: "5s",
      left: "50vw",
      top: "10vh",
    },
  },
});

const Background: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.layout}>
      <div className={classes.cube}></div>
      <div className={classes.cube}></div>
      <div className={classes.cube}></div>
      <div className={classes.cube}></div>
      <div className={classes.cube}></div>
      <div className={classes.cube}></div>
    </div>
  );
};

export default Background;
