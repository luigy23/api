const con = require("../mysql.js")
const  io  = require("../routes/socketio");

//crear factura
async function crearFactura(req, res) {
    const { idCaja, mesa, idMetodoPago, idUsuario, recibido, descuento } = req.body;
  
    try {
        // Obtener el pedido de la mesa proporcionada
        const idPedido = await con.obtenerElPedidoDeUnaMesa(mesa);
        
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
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
  }

module.exports = { crearFactura };