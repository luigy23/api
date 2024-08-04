const con = require("../mysql.js");
const  io  = require("../routes/socketio");
const { imprimirCuentaMesero } = require("../services/ticket.js");


async function ImprimirCuenta(req,res) {

console.log(req.body)  

console.log("Imprimiendo cuenta")


const idMesa = req.body.idMesa
const idPedido =await  con.obtenerElPedidoDeUnaMesa(idMesa)

const productos = await con.getProductosPedido(idPedido)

//actualizamos los productos pendientes a listos

productos.forEach(async (producto) => {
    if(producto.Estado !== "Pendiente") return;

    await con.udtProductoPedido("Listo", idPedido, producto.codProducto, producto.idRegistro);
})

await con.actualizarEstadoPedido("Entregado",idPedido)
//function actualizarEstadoMesa(idMesa, estado) {

await con.actualizarEstadoMesa(idMesa, "Sin Pagar")

io.actualizarProductos()
io.actualizarPedidos()
io.actualizarMesas()
const pedido = req.body
//añadimos el idPedido al objeto pedido
pedido.idPedido = idPedido
//imprimimos la cuenta

imprimirCuentaMesero(pedido)

res.status(200).json({
    message: "Imprimiendo cuenta"
})
    
}

module.exports = {
    ImprimirCuenta
}