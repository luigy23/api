const con = require("../mysql.js");
const { io } = require("../routes/socketio");
const pedidos = require("./pedidos");

async function obtenerMesa(req, res) {
  const idMesa = req.query.idMesa;

  if (idMesa) {

    const [Mesa] = await con.traerMesas(idMesa);
    if (Mesa.Estado == "Ocupado") {
      const pedidoMesa = await con.obtenerElPedidoDeUnaMesa(idMesa);
      const filtro = "WHERE idPedido =" + pedidoMesa;
      const pedido = await con.traerPedidos(filtro);
      res.json(pedido);
    } 
    else res.json(Mesa);
  } 
  else {
    const Mesas = await con.traerMesas();
    res.json(Mesas);
  }

}



module.exports = { obtenerMesa };
