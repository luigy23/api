const con = require("../mysql.js");
const  io  = require("../routes/socketio");

async function traerPedidos(req, res) {
  
  const idPedido = parseInt(req.query.id);
  
  const estado = req.query.estado || false;
  let filtro = idPedido
    ? "WHERE idPedido = ?"
    : estado
    ? "WHERE Estado = ?"
    : "";
  const values = idPedido ? [idPedido] : estado ? [estado] : [];
  const pedidos = await con.traerPedidos(filtro, values);

  const pedidosConProductos = await Promise.all(
    pedidos.map(async (pedido) => {
      const id = pedido.idPedido;
      const Productos = await con.getProductosPedido(id);
      return { ...pedido, Productos };
    })
  );
  res.json(pedidosConProductos);
}

async function verificarEstadoMesa(idMesa) {
  const [Mesa] = await con.traerMesas(idMesa);
  return Mesa.Estado === 'Ocupado'
}

async function nuevoPedido(req, res) {
  const idMesa = req.body.Mesa;
  const pedido = req.body;
  try {
    if (!idMesa) res.status(500).send("No se seleccionó mesa");
    
    const estadoMesa = await verificarEstadoMesa(idMesa);
    if (estadoMesa) res.status(500).send("La Mesa está ocupada");
    else {
     
      await con.nuevoPedido(pedido);
      io.actualizarPedidos()
      await con.actualizarEstadoMesa(idMesa, "Ocupado");
      io.actualizarMesas()
      res.json("Pedido Enviado");
    }
  } catch (error) {

  }
}

async function actualizarPedido(req, res) {
  const pedido = req.body;
  //const response = await con.actualizarPedido(pedido);
  res.json(actualizar);
}


async function productoListo(req, res) {
  const { idPedido, codProducto } = req.body;
  const response = await con.udtProductoPedido("Listo", idPedido, codProducto);
  console.log("Producto listo:", response);
  await actualizarEstadoPedido(idPedido);
  io.actualizarPedidos()
  res.json(response);
}

async function productoCancelado(req, res) {
  try {
    const { idPedido, codProducto } = req.body;
    const response = await con.udtProductoPedido(
      "Cancelado",
      idPedido,
      codProducto
    );
    console.log("Producto Cancelado:", response);
    await actualizarEstadoPedido(idPedido);
    io.actualizarPedidos()
    res.json("Producto Cancelado:" + response);
  } catch (error) {
    res.json("Hubo un error:" + response);
  }
}

async function actualizarEstadoPedido(idPedido) {
  //const idPedido = await con.obtenerElPedidoDeUnaMesa(1);
  console.log("IDPEDIDO:",idPedido)
  const idMesa = await con.getMesaDePedido(idPedido)
  console.log("IDPMESA:",idMesa)

  const pendientes = await con.getEstadoPed_Productos(idPedido, "Pendiente");

  if (pendientes.length === 0) {
    
    const entregados = await con.getEstadoPed_Productos(idPedido, "Listo");

    if (entregados.length > 0) {
      con.actualizarEstadoPedido("Entregado", idPedido);
      await con.actualizarEstadoMesa(idMesa, "Sin Pagar");
      io.actualizarMesas()
        } else {
      con.actualizarEstadoPedido("Cancelado", idPedido);
      await con.actualizarEstadoMesa(idMesa, "Disponible");
      
    }
    io.actualizarMesas()

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
