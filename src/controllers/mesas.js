const con = require("../mysql.js");
const { io } = require("../routes/socketio");
const pedidos = require("./pedidos");

async function obtenerMesa(req, res) {
  const idMesa = req.query.idMesa;

  if (idMesa) {

    const [Mesa] = await con.traerMesas(idMesa);
    if (Mesa.Estado == "Ocupado") {
      const pedidoMesa = await con.obtenerElPedidoDeUnaMesa(idMesa);
      const filtro = "WHERE idPedido = ?";
      const pedido = await con.traerPedidos(filtro,[pedidoMesa]);
      res.json(pedido);
    } 
    else res.json(Mesa);
  } 
  else {
    const Mesas = await con.traerMesas();
    res.json(Mesas);
  }

}
async function crearMesa(req, res) {
  const { descripcion, idMesa } = req.body;
  const mesa = await con.crearMesa(descripcion, idMesa);
  res.json(mesa);
}

async function pedidoMesa(req, res) {
  const idMesa = req.params.idMesa;
  const pedidoMesa = await con.obtenerElPedidoDeUnaMesa(idMesa);
  const productos = await con.getProductosPedido(pedidoMesa);
  res.json(productos);
}



module.exports = { obtenerMesa, crearMesa, pedidoMesa };
