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

function actualizarPedidos(){
  io.in("meseros").emit("actualizado", true);
}
function actualizarMesas(){
  io.in("meseros").emit("mesas", true);
}
function actualizarProductos(){
  io.in("meseros").emit("productos",true)
}

//actualizar caja:
function actualizarCaja(){
  io.in("meseros").emit("actualizarCaja",true)
}

//actulizar movimientos:
function actualizarMovimientos(){
  io.in("meseros").emit("actualizarMovimientos",true)
}





module.exports = { io, server, actualizarPedidos, actualizarMesas,actualizarProductos, 
  actualizarCaja,
  actualizarMovimientos
};
