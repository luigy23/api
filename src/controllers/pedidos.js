const con = require('../mysql.js')

async function traerPedidos (id) {
  const filtro = id
    ? 'WHERE idPedido =' + id
    : ' ORDER BY `pedido`.`Fecha` DESC'

  const pedidos = await con.traerPedidos(filtro)

  const pedidosConProductos = await Promise.all(
    pedidos.map(async (pedido) => {
      const id = pedido.idPedido
      const Productos = await con.traerProductos(id)
      return { ...pedido, Productos }
    })
  )
  console.log(pedidosConProductos)

  return new Promise((resolve, reject) => {
    resolve(pedidosConProductos)
  })
}

module.exports = { traerPedidos }
