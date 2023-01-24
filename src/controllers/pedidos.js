const con = require('../mysql.js')

async function traerPedidos (id, estado) {
  
  let filtro = id
    ? 'WHERE idPedido =' + id
    : estado ? `WHERE Estado = '${estado}'`
    : ' ORDER BY `pedido`.`Fecha` DESC'


  const pedidos = await con.traerPedidos(filtro)

  const pedidosConProductos = await Promise.all(
    pedidos.map(async (pedido) => {
      const id = pedido.idPedido
      const Productos = await con.traerProductos(id)
      return { ...pedido, Productos }
    })
  )
 

  return new Promise((resolve, reject) => {
    resolve(pedidosConProductos)
  })
}

async function nuevoPedido(pedido){
  
  return new Promise((resolve, reject) => { resolve(con.nuevoPedido(pedido))})
}

 function productoListo (idPedido, codProducto) {

 

  return new Promise((resolve, reject) => {
    const resultado=  con.estadoProductoPedido("Listo",idPedido,codProducto)
    resolve(resultado)
  })
}

async function productoCancelado (idPedido, codProducto) {


     const resultado= await con.estadoProductoPedido("Cancelado",idPedido,codProducto)
     if(resultado===1) console.log("Filas afectadas:",resultado)
     else console.log("hubo un error =>>>>>>>", resultado )
     
   
 }

async function actualizarEstadoPedido(){
  const idPedido = await con.obtenerElPedidoDeUnaMesa(1)
  const estado=  await con.obtenerDatosPedido(idPedido)
  if (estado.length===0){
    con.actualizarEstadoPedido("Entregado",idPedido)

  }
}
//
module.exports = { traerPedidos, productoListo, productoCancelado,actualizarEstadoPedido, nuevoPedido }
