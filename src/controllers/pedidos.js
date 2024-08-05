const con = require("../mysql.js");
const  io  = require("../routes/socketio");
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
    const idMesa = req.body.Mesa;
    const pedido = req.body;


    if (!idMesa) {
      return res.status(400).json({ error: 'No se seleccionó mesa' });
    }

    // Validar datos del pedido
    if (!pedido || !pedido.Productos ) {
      console.log(pedido);
      return res.status(400).json({ error: 'Faltan datos del pedido' });
    }

    const estadoMesa = await verificarEstadoMesa(idMesa);
    if (estadoMesa) {
      return res.status(400).json({ error: 'La Mesa está ocupada' });
    }

    try {
      await con.nuevoPedido(pedido);
      io.actualizarProductos();
      io.actualizarPedidos();
      await con.actualizarEstadoMesa(idMesa, "Ocupado");
      io.actualizarMesas();
      await imprimirTicketComanda(pedido);
      res.json({ mensaje: 'Pedido Enviado' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el pedido' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
}
async function añadirProductoPedido(req, res) {
  const { idMesa, productos } = req.body;
  const idPedido = await con.obtenerElPedidoDeUnaMesa(idMesa);
  let cambio = await con.getCambiosPedido(idPedido);
  cambio = cambio[0].Cambios+1;
  console.log("Cambio:", cambio);

   try {
   await con.agregarProductosAlPedido(idPedido,productos,cambio)
    io.actualizarPedidos()
    con.udtCambiosPedido(idPedido,cambio)
    con.actualizarEstadoPedido("Pendiente",idPedido)
    io.actualizarProductos()
    io.actualizarPedidos()
    await con.actualizarEstadoMesa(idMesa, "Ocupado");
    io.actualizarMesas()
    console.log("Productos añadidos:", productos);

    const pedido = await con.traerPedidos("WHERE idPedido = ?", [idPedido]);
  
    const MesaDescripcion = await con.traerMesas(idMesa) 
    console.log("MesaDescripcion:", MesaDescripcion);
       
   
    
    const impresion = {
         MesaDescripcion: MesaDescripcion[0].Descripcion,
         Mesero: pedido[0].Usuario,
         Productos: productos,
       };

      imprimirTicketComanda(impresion);
    

  } catch (error) {
    res.status(500).send("Error en el cambio");  }

  return res.json(cambio)
}

async function productoListo(req, res) {

  const { idPedido, codProducto,idRegistro } = req.body;
  console.log("IDREGISTRO:",idRegistro, "IDPEDIDO:",idPedido, "CODPRODUCTO:",codProducto)
  const response = await con.udtProductoPedido("Listo", idPedido, codProducto, idRegistro); //actualizamos el estado de un producto en un pedido
  console.log("Producto listo:", response);
  await actualizarEstadoPedido(idPedido);


  const filtro= "WHERE idPedido = ?"
  const values = [idPedido]
  const pedido = await con.traerPedidos(filtro, values); //obtenemos el pedido para despues extraer el usuario

  
  io.enviarNotificacion({codProducto:codProducto, mesa:pedido[0].idMesa, estado:"Listo"}, pedido[0].Usuario)

  io.actualizarPedidos()

  res.json(response);
}

async function productoCancelado(req, res) {
  const { idPedido, codProducto,idRegistro } = req.body;
  console.log("IDREGISTRO:",idRegistro, "IDPEDIDO:",idPedido, "CODPRODUCTO:",codProducto)
  const response = await con.udtProductoPedido("Cancelado", idPedido, codProducto, idRegistro);
  console.log("Producto cancelado:", response);





  const filtro= "WHERE idPedido = ?"
  const values = [idPedido]
  const pedido = await con.traerPedidos(filtro, values); //obtenemos el pedido para despues extraer el usuario

  
  io.enviarNotificacion({codProducto:codProducto, mesa:pedido[0].idMesa, estado:"Cancelado"}, pedido[0].Usuario)

  await actualizarEstadoPedido(idPedido);
  io.actualizarProductos()
  io.actualizarPedidos()
  res.json(response);
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
  añadirProductoPedido,
};
