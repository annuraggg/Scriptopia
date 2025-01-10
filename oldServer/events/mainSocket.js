import { onLogin } from "./onLogin.js";
import { io } from "../index.js";

const mainSocket = () => {
  io.on("connection", (socket) => {
    socket.on("onLogin", (id) => {
      io.to(id).emit("logout");
      socket.join(id);
    });

    socket.on("onRefreshedPage", (id) => {
      socket.join(id)
    })
  });

  io.on("disconnect", (socket) => {
    socket.leaveAll()
  });
};

export default mainSocket;
