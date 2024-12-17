const con = require("../mysql.js");
const io = require("../routes/socketio");

async function crearFactura(req, res) {
  const { mesa, idMetodoPago,  recibido, descuento, propina, total, subtotal } = req.body;
  console.log("--------FACTURA--------");
  console.log(req.body);
  console.log("-----------------------");

  try {
    const idPedido = await obtenerPedidoPorMesa(mesa);

    const pedido = await con.traerPedidos("WHERE idPedido = ?", [idPedido]);
    idUsuario = pedido[0].Usuario;


    await verificarEstadoPedido(idPedido);
    const total = await calcularTotal(idPedido);
    const subtotalIva = total * IVA_TASA;
    const subtotal = total + subtotalIva - descuento + propina;
    const idCaja = await obtenerCajaActiva();

    const factura = {
      numFactura: null,
      idPedido,
      idCaja,
      subtotal,
      descuento,
      iva: IVA_TASA,
      total,
      idMetodoPago,
      recibido,
      cambio: recibido - subtotal,
      usuario: idUsuario,
      fecha: new Date(),
      estado: "Pagado",
      propina,
    };

    const resultado = await insertarFacturaYActualizarCaja(
      factura,
      idCaja,
      subtotal
    );
    await con.actualizarEstadoMesa(mesa, "Disponible");
    await con.actualizarEstadoPedido("Facturado", idPedido);

    res.status(200).json({
      resultado,
      factura: {
        ...factura,
        numFactura: resultado.insertId,
      },
    });
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message });
    }
  }
}

async function obtenerFacturas(req, res) {
  try {
    const facturas = await con.obtenerFacturas(
      { fechaInicio: "2021-05-01", fechaFin: "2023-04-25" },
      10
    );
    res.status(200).json(facturas);
  } catch (error) {
    res.status(500).json({
      message: "Error al traer facturas",
    });
  }
}

async function obtenerFacturaPorId(req, res) {
  try {
    const { id } = req.params;
    const factura = await con.obtenerFacturaPorId(id);
    res.status(200).json(factura);
  } catch (error) {
    res.status(500).json({
      message: "Error al traer factura",
    });
  }
}

//Services

// Constantes
const IVA_TASA = 0; // Esto debería ser ajustado al valor actual de IVA.

async function obtenerPedidoPorMesa(mesa) {
  return await con.obtenerElPedidoDeUnaMesa(mesa);
}

async function verificarEstadoPedido(idPedido) {
  const estadoPedido = await con.traerPedidos("WHERE idPedido = ?", [idPedido]);
  if (
    estadoPedido[0].length === 0 ||
    estadoPedido[0].Estado === "Facturado" ||
    estadoPedido[0].Estado === "Cancelado"
  ) {
    throw new Error("El pedido no existe, ya fue facturado o fue cancelado");
  }
  return estadoPedido;
}

async function calcularTotal(idPedido) {
  const pedido = await con.getProductosPedido(idPedido);
  let subtotal = 0;
  for (const producto of pedido) {
    if (producto.Estado === "Cancelado") continue;
    if (producto.Estado === "Pendiente") {
      throw new Error("El pedido no está listo");
    }
    subtotal += producto.Precio * producto.Cantidad;
  }
  return subtotal;
}

async function obtenerCajaActiva() {
  const Caja = await con.obtenerCajaActiva();
  return Caja[0].idCaja;
}

async function insertarFacturaYActualizarCaja(factura, idCaja, total) {
  const resultado = await con.insertarFactura(factura);
  await con.sumarSaldoCaja(idCaja, total);
  io.actualizarCaja();
  return resultado;
}

module.exports = { crearFactura, obtenerFacturas, obtenerFacturaPorId };
