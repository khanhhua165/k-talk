import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { motion } from "framer-motion";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { blue } from "@material-ui/core/colors";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants/api";
import { LoginResponse } from "../interfaces/login.interface";
import useAuth from "../store/useAuth";
import { Redirect } from "react-router-dom";
import Background from "./Background";

const useStyles = makeStyles((theme) => ({
  center: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
  },
  login: {
    borderRadius: "0.5rem",
    backgroundColor: blue[50],
    padding: "2rem 3rem",
  },
  title: {
    marginBottom: "2rem",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: "1rem",
  },
  error: {
    marginTop: "0.5rem",
  },
}));

const svgVariants = {
  hidden: {
    scale: 1.5,
    x: 0,
    y: 0,
  },
  visible: {
    scale: 1,
    // x: "-45vw",
    y: "-30vh",
    transition: {
      delay: 4,
      duration: 1,
      type: "tween",
    },
  },
};

const pathVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    fill: "#f0fa",
    pathLength: 1,
    transition: {
      default: { duration: 3, ease: "easeInOut" },
      fill: { duration: 3, ease: [1, 0, 0.8, 1] },
    },
  },
};

const loginCardVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 5,
      duration: 0.5,
    },
  },
};

const Login = () => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const {
    setUser,
    isLoggedIn,
    setLoggedIn,
    hasGoogleLogged,
    setHasGoogleLogged,
  } = useAuth();

  const handleSuccess = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (!(res as GoogleLoginResponse).profileObj) {
      setError("There's something wrong. Please try again!");
    } else {
      setError("");
      try {
        const response = (
          await axios.post<{ user: LoginResponse }>(`${API_URL}/user/login`, {
            token: (res as GoogleLoginResponse).tokenId,
          })
        ).data;
        localStorage.setItem("isLoggedIn", "true");
        setLoggedIn(true);
        setUser(response.user);
        setHasGoogleLogged(true);
      } catch (e: unknown) {
        localStorage.removeItem("isLoggedIn");
        setLoggedIn(false);
        setError("There's something wrong. Please try again!");
      }
    }
  };

  const handleFailure = () => {
    localStorage.removeItem("isLoggedIn");
    setLoggedIn(false);
    setError("There's something wrong. Please try again!");
  };
  if (hasGoogleLogged) {
    return <Redirect to="/chat" />;
  }
  return (
    <>
      <Background />
      <div className={classes.center}>
        <motion.svg
          width="397"
          height="107"
          viewBox="0 0 397 107"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          variants={svgVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.path
            d="M65.912 9.268H64.8907L64.1616 9.98305L19.884 53.4037V11.768V9.268H17.384H5H2.5V11.768V101.336V103.836H5H17.384H19.884V101.336V57.688L65.7366 103.112L66.4673 103.836H67.496H83.48H89.6097L85.2284 99.5491L40.2556 55.5449L83.2115 13.5558L85.5869 11.2339V11.768V20.264V22.764H88.0869H118.563V101.336V103.836H121.063H133.591H136.091V101.336V22.764H166.567H169.067V20.264V11.768V9.268H166.567H88.0869H87.598H85.5869H81.464H65.912ZM233.013 28.996H230.513V30.0518C228.899 29.3136 227.062 28.996 225.093 28.996H190.965C186.787 28.996 183.195 30.042 180.665 32.5722C178.135 35.1024 177.089 38.6946 177.089 42.872V89.96C177.089 94.1374 178.135 97.7296 180.665 100.26C183.195 102.79 186.787 103.836 190.965 103.836H225.093C227.062 103.836 228.899 103.518 230.513 102.78V103.836H233.013H245.397H247.897V101.336V31.496V28.996H245.397H233.013ZM285.134 103.836H287.634V101.336V5V2.5H285.134H272.75H270.25V5V101.336V103.836H272.75H285.134ZM310.013 101.336V103.836H312.513H324.897H327.397V101.336V67.7768L327.51 67.882L365.238 103.162L365.958 103.836H366.945H383.361H389.766L385.055 99.4971L348.768 66.075L385.036 33.3522L389.864 28.996H383.361H366.945H365.973L365.256 29.6525L327.528 64.2125L327.397 64.3329V5V2.5H324.897H312.513H310.013V5V101.336ZM228.117 90.34H196.437C195.618 90.34 195.04 90.2847 194.659 90.2085C194.648 90.2064 194.638 90.2042 194.628 90.2021C194.627 90.1981 194.626 90.194 194.625 90.1899C194.539 89.8171 194.473 89.2307 194.473 88.376V44.456C194.473 43.6565 194.538 43.113 194.62 42.7714C194.629 42.7316 194.639 42.6967 194.647 42.6665C194.678 42.6578 194.712 42.6485 194.752 42.639C195.094 42.557 195.637 42.492 196.437 42.492H228.117C229.56 42.492 230.007 42.8253 230.093 42.9118C230.159 42.9781 230.513 43.4465 230.513 45.032V87.8C230.513 89.3855 230.159 89.8539 230.093 89.9202C230.007 90.0067 229.56 90.34 228.117 90.34Z"
            stroke="#FDFDFD"
            variants={pathVariants}
            stroke-width="5"
          />
        </motion.svg>
      </div>
      <motion.div
        className={classes.center}
        variants={loginCardVariants}
        initial="hidden"
        animate="visible"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          className={classes.login}
          boxShadow={2}
        >
          <Typography
            color="primary"
            variant="h3"
            align="center"
            className={classes.title}
          >
            Let's Communicate!
          </Typography>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_ID!}
            buttonText="Log in with Google"
            cookiePolicy={"single_host_origin"}
            onFailure={handleFailure}
            onSuccess={handleSuccess}
            isSignedIn={isLoggedIn}
            render={(props) => (
              <Button
                color="primary"
                fullWidth
                onClick={props.onClick}
                disabled={props.disabled}
                variant="contained"
              >
                <span>
                  <img
                    src="https://img.icons8.com/clouds/100/000000/google-logo.png"
                    alt="google icon"
                    className={classes.image}
                  />
                </span>
                Log in with Google
              </Button>
            )}
          />
          {error && (
            <Typography
              variant="subtitle1"
              color="error"
              className={classes.error}
            >
              {error}
            </Typography>
          )}
        </Box>
      </motion.div>
    </>
  );
};

export default Login;
