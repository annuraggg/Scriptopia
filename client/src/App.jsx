/* IMPORTS */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./assets/normalize.css";
import "./assets/fa/css/all.css";
import "./config.css";

import Admin from "./Admin.jsx";
import Student from "./Student.jsx";
import Guest from "./Guest";
import Faculty from "./Faculty";

import Auth from "./pages/Auth/Auth.jsx";
import Fzf from "./pages/404/Fzf.jsx";
import Fzt from "./pages/503/Fzt.jsx";

import { useEffect, useState } from "react";
import socket, { io } from "./events/socketConnection";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import Forgot from "./pages/Forgot/Forgot";
import Feedback from "./pages/Feedback/Feedback";

function App() {
  const [maintainanceMode, setMaintainanceMode] = useState(false);

  useEffect(() => {
    socket();
    const jwt = Cookies.get("token");
    if (jwt) {
      const id = jwtDecode(jwt).mid;
      io.emit("onRefreshedPage", id);
    }

    if (localStorage.getItem("chakra-ui-color-mode") === "dark") {
      import("./config-dark.css");
    } else {
      import("./config.css");
    }
  }, []);

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_ADDRESS, {
      method: "GET",
    }).then((res) => {
      if (res.status === 503) {
        setMaintainanceMode(true);
      }
    });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {maintainanceMode ? (
            <>
              // * When Maintainance Mode is Enabled
              <Route path="*" element={<Fzt />} />
              <Route path="/auth" element={<Auth />} />
              {Admin()}
            </>
          ) : (
            <>
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<Fzf />} />
              {Admin()}
              {Student()}
              {Faculty()}
              {Guest()}
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
