const app = require("../app");
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(
    "se conectó un usuario: " + socket.id.substring(socket.id.length - 3)
  );

  socket.join("meseros");

socket.on('disconnect', () => {
  console.log('user disconnected');})
  // socket.on('traerPedidos',())
});

module.exports = { io, server };
