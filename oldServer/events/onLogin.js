import { io } from "../index.js";

export const onLogin = (socket) => {
  socket.on("onLogin", (id) => {
    // io.to(id).emit("newLogin");
    setTimeout(() => {
    //  socket.join(id);
    }, 1000);
  });
};
