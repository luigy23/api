const { query } = require("express");
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "restaurante",
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (err, rows, fields) {
  if (err) throw err;
  console.log("Connected to DB!");
});

//METODOS PEDIDOS
function nuevoPedido(pedido) {
  const fechaActual = new Date(Date.now());
  const sqlCrearPedido = `
  INSERT INTO pedido (idMesa, Usuario, idCliente, idSede, Fecha, Total, Estado)
  VALUES ( ?,?,?,?,?,?,?);
`;
  const values = [
    pedido.Mesa,
    pedido.Mesero,
    null,
    "123",
    fechaActual,
    "1233",
    "Pendiente",
  ];
  /// Consulta
  return new Promise((resolve, reject) => {
    connection.query(
      sqlCrearPedido,
      values,
      function (err, resultados, campos) {
        if (err) resolve(err);
        else {
          crearProductosPedido(pedido.Productos, resultados.insertId);
          resolve(resultados.affectedRows);
        }
      }
    );
  });
}
function traerPedidos(filtro) {
  const sqlPedidos =
    "SELECT * FROM `pedido` " + filtro + " ORDER BY `pedido`.`Fecha` DESC";

  return new Promise((resolve, reject) => {
    connection.query(sqlPedidos, function (err, resultados, campos) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function actualizarEstadoPedido(estado, idPedido) {
  const sqlEstadoPedido = `UPDATE pedido SET Estado = '${estado}' WHERE pedido.idPedido = ${idPedido}`;
  connection.query(sqlEstadoPedido, function (err, resultados, campos) {
    if (err) throw err;
    else {
      console.log("resultado: columna afectadas:", resultados.affectedRows);
    }
  });
}
async function obtenerDatosPedido(idPedido) {
  const sqlEstado = `SELECT 
  ped.idPedido, ped.idMesa, pro.Nombre, det.Cantidad, det.Estado 
  FROM pedido 
  ped INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido INNER JOIN productos pro ON det.codProducto=pro.codProducto 
  INNER JOIN usuarios usu ON ped.Usuario=usu.Usuario 
  WHERE ped.idPedido=${idPedido} AND det.Estado = "Pendiente";`;

  return new Promise((resolve, reject) => {
    connection.query(sqlEstado, function (err, resultados, campos) {
      if (err) {
        throw console.error(err);
      } else {
        resolve(resultados);
      }
    });
  });
}

//METODOS PRODUCTOS

function traerProductos(id) {
  const sqlTraerProductos = `SELECT pro.Nombre, det.Cantidad, det.Comentario,det.codProducto, det.Estado FROM pedido ped INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido INNER JOIN productos pro ON det.codProducto=pro.codProducto INNER JOIN usuarios usu ON ped.Usuario=usu.Usuario 
  WHERE ped.idPedido= ${id} ORDER BY Estado DESC`;

  return new Promise((resolve, reject) => {
    connection.query(sqlTraerProductos, function (err, resultados, campos) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function crearProductosPedido(productos, id) {
  productos.forEach((producto) => {
    const sqlProductos = `
      INSERT INTO pedido_productos (idPedido, codProducto, Cantidad, Precio, Comentario, Total, Estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      id,
      producto.id,
      producto.cantidad,
      producto.precio,
      producto.comentario,
      producto.precio,
      "Pendiente",
    ];

    connection.query(sqlProductos, values, (err, resultados, campos) => {
      if (err) {
        console.log("hubo un error: ", err);
        return false; //Retorna como salió el proceso
      } else {
        console.log(`producto: ${producto.id} ID del pedido: ${id}`);
        return true;
      }
    });
  });
}
function estadoProductoPedido(estado, idPedido, codProducto) {
  const sqlActualizar = `UPDATE pedido_productos SET Estado = '${estado}' WHERE pedido_productos.idPedido = ${idPedido} AND pedido_productos.codProducto = '${codProducto}'`;
  
  return new Promise((resolve, reject) => {  
    connection.query(sqlActualizar, function (err, resultados, campos) {
      if (err) resolve(err);
       else {
        resolve(resultados.affectedRows);
      }
    });
  })

}

//METODOS MESA

function obtenerElPedidoDeUnaMesa(idMesa) {
  const sqlObtenerId = `SELECT idPedido FROM pedido WHERE idMesa= ${idMesa} ORDER BY Fecha DESC LIMIT 1`;
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerId, function (err, resultados, campos) {
      if (err) {
        throw console.error(err);
      } else {
        resolve(resultados[0].idPedido);
      }
    });
  });
}
function actualizarEstadoMesa(idMesa, estado) {
  const sqlEstadoMesa = `UPDATE mesa SET Estado = '${estado}' WHERE mesa.idMesa = ${idMesa}`;
  return new Promise((resolve, reject) => {
    connection.query(sqlEstadoMesa, function (err, resultados, campos) {
      if (err) throw console.error(err);
      else console.log("resultados=>>>", resultados);
      resolve(resultados);
    });
  });
}

module.exports = {
  nuevoPedido,
  traerPedidos,
  traerProductos,
  estadoProductoPedido,
  obtenerDatosPedido,
  actualizarEstadoPedido,
  obtenerElPedidoDeUnaMesa,
  actualizarEstadoMesa,
};
