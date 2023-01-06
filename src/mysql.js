const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'restaurante'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err
  console.log('Connected to DB!')
})

function nuevoPedido (pedido) {
  const fechaActual = new Date(Date.now())
  const sqlCrearPedido = `
  INSERT INTO pedido (idMesa, Usuario, idCliente, idSede, Fecha, Total, Estado)
  VALUES ( ?,?,?,?,?,?,?);
`
  const values = [
    pedido.Mesa,
    pedido.Mesero,
    null,
    '123',
    fechaActual,
    '1233',
    'Pendiente'
  ]
  /// Consulta
  connection.query(sqlCrearPedido, values, function (err, resultados, campos) {
    if (err) throw err
    else {
      console.log(`guardado a las : ${fechaActual} 
        IDdelPEdido= ${resultados.insertId}`)
      crearProductosPedido(pedido.Productos, resultados.insertId)
    }
  })
}

function traerPedidos (filtro) {
  const sqlPedidos = 'SELECT * FROM `pedido` ' + filtro

  return new Promise((resolve, reject) => {
    connection.query(sqlPedidos, function (err, resultados, campos) {
      if (err) reject(err)
      else {
        resolve(resultados)
      }
    })
  })
}
function traerProductos (id) {
  const sqlTraerProductos = `SELECT pro.Nombre, det.Cantidad, det.Comentario, det.Estado FROM pedido ped INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido INNER JOIN productos pro ON det.codProducto=pro.codProducto INNER JOIN usuarios usu ON ped.Usuario=usu.Usuario 
  WHERE ped.idPedido= ${id}`

  return new Promise((resolve, reject) => {
    connection.query(sqlTraerProductos, function (err, resultados, campos) {
      if (err) reject(err)
      else {
        resolve(resultados)
      }
    })
  })
}

function crearProductosPedido (productos, id) {
  productos.forEach((producto) => {
    const sqlProductos = `
      INSERT INTO pedido_productos (idPedido, codProducto, Cantidad, Precio, Comentario, Total, Estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)`
    const values = [
      id,
      producto.id,
      producto.cantidad,
      producto.precio,
      producto.comentario,
      producto.precio,
      'Pendiente'
    ]

    connection.query(sqlProductos, values, (err, resultados, campos) => {
      if (err) {
        console.log('hubo un error: ', err)
      } else {
        console.log(`producto: ${producto.id} ID del pedido: ${id}`)
      }
    })
  })
}

module.exports = { nuevoPedido, traerPedidos, traerProductos }
