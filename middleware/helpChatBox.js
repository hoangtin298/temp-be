module.exports = function (app) {
  app.io.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.emit("getId", socket.id);

    socket.on("sendDataClient", function (data) {
      console.log(data);
      app.io.emit("sendDataServer", { data });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
    //   socket.on("newUser", async (user) => {
    //     const u = await userModel.getById(user.id);
    //     users[user.id] = u[0];
    //     socket.join(user.room);
    //     socket.room = user.room;

    //   });
    //   socket.on("chat-Customer", (data) => {
    //     socket.broadcast.in(socket.room).emit("chat", {
    //       user: users[data.from],
    //       message: data.message,
    //       restaurant: data.restaurant,
    //     });
    //   });
    //   socket.on("chat-Manager", (data) => {
    //     socket.broadcast.in(socket.room).emit("chat", data);
    //   });
  });
};
