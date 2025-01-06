const con = require("../mysql.js");
const io = require("../routes/socketio");
const { imprimirTicketComanda } = require("../services/ticket.js");

async function traerPedidos(req, res) {

  const idPedido = parseInt(req.query.id);

  const estado = req.query.estado || false;
  const limit = req.query.limit || false;
  let filtro = idPedido
    ? "WHERE idPedido = ?"
    : estado
      ? "WHERE Estado = ?"
      : ""
  const values = idPedido ? [idPedido] : estado ? [estado] : [];
  const pedidos = await con.traerPedidos(filtro, values, limit);

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
  return Mesa.Estado === 'Ocupado' || Mesa.Estado === 'Sin Pagar';
}

async function nuevoPedido(req, res) {
  try {
    const { Mesa: idMesa, Productos, Imprimir } = req.body;

    if (!idMesa) {
      return res.status(400).json({ error: 'No se seleccionó mesa' });
    }

    if (!Productos?.length) {
      return res.status(400).json({ error: 'No hay productos en el pedido' });
    }

    const estadoMesa = await verificarEstadoMesa(idMesa);
    if (estadoMesa) {
      return res.status(400).json({ error: 'La mesa está ocupada' });
    }

    if (Imprimir === 1) {
      const impresion = await imprimirTicketComanda(req.body);
      if (impresion.error) {
        console.error("Error al imprimir el pedido:", impresion.error);
        return res.status(500).json({ error: 'Error al imprimir el pedido' });
      }
    }

    await con.nuevoPedido(req.body);
    await con.actualizarEstadoMesa(idMesa, "Ocupado");
    
    // Agrupar actualizaciones de socket
    io.actualizarProductos();
    io.actualizarPedidos();
    io.actualizarMesas();

    return res.json({ mensaje: 'Pedido enviado exitosamente' });
  } catch (error) {
    console.error('Error en nuevoPedido:', error);
    return res.status(500).json({ error: 'Error al crear el pedido' });
  }
}

async function añadirProductoPedido(req, res) {
  try {
    const { idMesa, productos, Imprimir } = req.body;
    
    if (!idMesa || !productos?.length) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const idPedido = await con.obtenerElPedidoDeUnaMesa(idMesa);
    const [mesaInfo] = await con.traerMesas(idMesa);
    const [pedidoInfo] = await con.traerPedidos("WHERE idPedido = ?", [idPedido]);
    const [{ Cambios }] = await con.getCambiosPedido(idPedido);
    const nuevoCambio = Cambios + 1;

    if (Imprimir === 1) {
      const impresionDatos = {
        MesaDescripcion: mesaInfo.Descripcion,
        Mesero: pedidoInfo.Usuario,
        Productos: productos,
      };

      const impresion = await imprimirTicketComanda(impresionDatos);
      if (impresion.error) {
        console.error("Error al imprimir el pedido:", impresion.error);
        return res.status(500).json({ error: 'Error al imprimir el pedido' });
      }
    }

    await Promise.all([
      con.agregarProductosAlPedido(idPedido, productos, nuevoCambio),
      con.udtCambiosPedido(idPedido, nuevoCambio),
      con.actualizarEstadoPedido("Pendiente", idPedido),
      con.actualizarEstadoMesa(idMesa, "Ocupado")
    ]);

    // Agrupar actualizaciones de socket
    io.actualizarProductos();
    io.actualizarPedidos();
    io.actualizarMesas();

    return res.json({ cambio: nuevoCambio });
  } catch (error) {
    console.error('Error en añadirProductoPedido:', error);
    return res.status(500).json({ error: 'Error al añadir productos al pedido' });
  }
}
async function productoListo(req, res) {

  console.log("PEDIDO LISTO req.body:", req.body);

  const { idPedido, codProducto, idRegistro, Nombre } = req.body;
  const response = await con.udtProductoPedido("Listo", idPedido, codProducto, idRegistro); //actualizamos el estado de un producto en un pedido
  await actualizarEstadoPedido(idPedido);


  const filtro = "WHERE idPedido = ?"
  const values = [idPedido]
  const pedido = await con.traerPedidos(filtro, values); //obtenemos el pedido para despues extraer el usuario
  console.log("Pedido:", pedido[0])


  io.enviarNotificacion({ codProducto: Nombre, mesa: pedido[0].Descripcion, estado: "Listo" }, pedido[0].Usuario)

  io.actualizarPedidos()

  res.json(response);
}

async function productoCancelado(req, res) {
  const { idPedido, codProducto, idRegistro, Nombre } = req.body;
  console.log("req.body:", req.body);
  const response = await con.udtProductoPedido("Cancelado", idPedido, codProducto, idRegistro);





  const filtro = "WHERE idPedido = ?"
  const values = [idPedido]
  const pedido = await con.traerPedidos(filtro, values); //obtenemos el pedido para despues extraer el usuario


  io.enviarNotificacion({ codProducto: Nombre, mesa: pedido[0].Descripcion, estado: "Cancelado" }, pedido[0].Usuario)

  await actualizarEstadoPedido(idPedido);
  io.actualizarProductos()
  io.actualizarPedidos()
  res.json(response);
}

async function actualizarEstadoPedido(idPedido) {
  //const idPedido = await con.obtenerElPedidoDeUnaMesa(1);
  console.log("IDPEDIDO:", idPedido)
  const idMesa = await con.getMesaDePedido(idPedido)
  console.log("IDPMESA:", idMesa)

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
async function obtenerMeseroDePedido(req, res) {
  const idPedido = req.params.id;
  console.log("IDPEDIDO:", idPedido)
  const pedido = await con.traerPedidos("WHERE idPedido = ?", [idPedido]);
  const mesero = pedido[0].Usuario;

  res.json(mesero);
}



module.exports = {
  traerPedidos,
  productoListo,
  productoCancelado,
  actualizarEstadoPedido,
  nuevoPedido,
  añadirProductoPedido,
  obtenerMeseroDePedido
};
