import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Chat from "./components/Chat";
import Login from "./components/Login";
import useAuth from "./store/useAuth";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isInitialized, setIsintialized] = useState(false);
  const setLoggedIn = useAuth(useCallback((state) => state.setLoggedIn, []));
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setLoggedIn(isLoggedIn);
    setIsintialized(true);
  }, [setLoggedIn]);

  if (!isInitialized) return null;
  return (
    <>
      <ToastContainer />
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/chat" exact component={Chat} />
      </Switch>
    </>
  );
}

export default App;
