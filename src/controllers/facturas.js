const con = require("../mysql.js")
const  io  = require("../routes/socketio");

//crear factura
async function crearFactura(req, res) {
    const {  mesa, idMetodoPago, idUsuario, recibido, descuento } = req.body;
    console.log(req.body);
    try {
        // Obtener el pedido de la mesa proporcionada
        const idPedido = await con.obtenerElPedidoDeUnaMesa(mesa);

        //Verificar el estado del pedido
        const estadoPedido = await con.traerPedidos("WHERE idPedido = ?", [idPedido]);
        console.log(estadoPedido);

        if (estadoPedido[0].length === 0 || estadoPedido[0].Estado === "Facturado" || estadoPedido[0].Estado === "Cancelado"  ) {
          return res.status(400).json({ message: "El pedido no existe, ya fue facturado o fue cancelado" });
        }

        // Obtener los productos del pedido
        const pedido = await con.getProductosPedido(idPedido);
      
        // Calcular el subtotal del pedido
        const subtotal = pedido.reduce((total, producto) => {
          if (producto.Estado === "Cancelado") return total;
          return total + producto.Precio * producto.Cantidad;
        }, 0);
      
        // Calcular el IVA
        const iva = 0;
        const subtotalIva = subtotal * iva;
      
        // Calcular el total
        const total = subtotal + subtotalIva - descuento;

        // Obtener el id de la caja
        const Caja = await con.obtenerCajaActiva();
        const idCaja = Caja[0].idCaja;
        console.log(Caja);
      
        // Insertar la factura en la base de datos
        const factura = {
          numFactura: null,
          idPedido,
          idCaja,
          subtotal,
          descuento,
          iva,
          total,
          idMetodoPago,
          recibido,
          cambio: recibido - total,
          usuario: idUsuario,
          fecha: new Date(),
          estado: "Pagado",
        };

      

        const resultado = await con.insertarFactura(factura);
         //sumar el total de la factura a la caja si no hubo error
        await con.sumarSaldoCaja(idCaja, total);
        //actualizar la caja si no hubo error
        io.actualizarCaja();
     

      
        // Actualizar el estado de la mesa y del pedido
        await con.actualizarEstadoMesa(mesa, "Disponible");
        await con.actualizarEstadoPedido( "Facturado", idPedido);
      
        res.status(200).json({
          resultado,
          factura: {
            numFactura: resultado.insertId,
            idPedido,
            idCaja,
            subtotal,
            descuento,
            iva,
            total,
            idMetodoPago,
            recibido,
            cambio: recibido - total,
            usuario: idUsuario,
            fecha: new Date(),
            estado: "Pagado",
          },
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    
  }

//obtener Facturas
async function obtenerFacturas(req, res) {
    try {
        const facturas = await con.obtenerFacturas({fechaInicio: "2021-05-01", fechaFin: "2023-04-25"}, 10)
        res.status(200).json(facturas)
    } catch (error) {
        res.status(500).json({
            message: "Error al traer facturas"
        })
    }

  }

//obyener factura por id
async function obtenerFacturaPorId(req, res) {
    try {
        const { id } = req.params;
        const factura = await con.obtenerFacturaPorId(id);
        res.status(200).json(factura);
    } catch (error) {
        res.status(500).json({
            message: "Error al traer factura"
        })
    }
}





module.exports = { crearFactura, obtenerFacturas, obtenerFacturaPorId };