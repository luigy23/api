const con = require("../mysql.js");
const  io  = require("../routes/socketio");
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
  const { Descripcion } = req.body;
  const mesa = await con.crearMesa(Descripcion);
  io.actualizarMesas();
  res.json(mesa);
}

async function pedidoMesa(req, res) {
  const idMesa = req.params.idMesa;
  const Mesa = await con.traerMesas(idMesa);
  if (Mesa && Mesa[0] && Mesa[0].Estado != "Disponible") {
  const pedidoMesa = await con.obtenerElPedidoDeUnaMesa(idMesa);
  const productos = await con.getProductosPedido(pedidoMesa);
  res.json(productos);}
  else res.json([]);
}

async function actualizarEstadoMesa(idMesa, estado) {
  await con.actualizarEstadoMesa(idMesa, estado);
  io.actualizarMesas();
}

async function actualizarMesa(req, res) {
  const { idMesa, Estado, Descripcion } = req.body;

  //validamos que no estén vacíos los campos
  if (!idMesa || !Estado || !Descripcion) {
    res.status(400).send("Faltan datos");
    return;
  }

  await con.actualizarEstadoMesa(idMesa, Estado);
  await con.cambiarDescripcionMesa(idMesa, Descripcion);

  io.actualizarMesas();
  res.json("Mesa actualizada");
}



module.exports = { obtenerMesa, crearMesa, pedidoMesa, actualizarEstadoMesa, actualizarMesa };
