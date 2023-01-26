const con = require("../mysql.js");
const {io} = require("../routes/socketio")


async function traerPedidos(req, res) {
  const idPedido = req.query.id
  const estado = req.query.estado || false
  //const lista = await pedidos.traerPedidos(idPedido,estado)

  let filtro = idPedido
    ? "WHERE idPedido =" + idPedido
    : estado
    ? `WHERE Estado = '${estado}'`
    : " ";


  const pedidos = await con.traerPedidos(filtro);

  const pedidosConProductos = await Promise.all(
    pedidos.map(async (pedido) => {
      const id = pedido.idPedido;
      const Productos = await con.traerProductos(id);
      return { ...pedido, Productos };
    })
  );
  res.json(pedidosConProductos)

}

async function nuevoPedido(req, res) {
 const pedido = req.body
 const response = await con.nuevoPedido(pedido)
 io.in("meseros").emit("actualizado", true);
 res.json("todo bien")

}

async function productoListo(req, res) {
  const { idPedido, codProducto } = req.body;
  const response = await con.estadoProductoPedido( "Listo", idPedido,codProducto);
  console.log("Producto listo:", response);
  await actualizarEstadoPedido(idPedido)
  io.in("meseros").emit("actualizado", true);
  res.json(response)
}

async function productoCancelado(req, res) {

try {
  const { idPedido, codProducto } = req.body;
  const response = await con.estadoProductoPedido( "Cancelado", idPedido,codProducto);
  console.log("Producto Cancelado:", response);
  await actualizarEstadoPedido(idPedido)
  io.in("meseros").emit("actualizado", true);
  res.json("Producto Cancelado:"+ response)
} catch (error) {
  res.json("Hubo un error:"+ response)
}


}

async function actualizarEstadoPedido(idPedido) {
  //const idPedido = await con.obtenerElPedidoDeUnaMesa(1);
  const estado = await con.obtenerDatosPedido(idPedido);
  if (estado.length === 0) {
    con.actualizarEstadoPedido("Entregado", idPedido);
  }
}
//
module.exports = {
  traerPedidos,
  productoListo,
  productoCancelado,
  actualizarEstadoPedido,
  nuevoPedido,
};
