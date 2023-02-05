//const util = require('util')

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
    pedido.Total,
    "Pendiente",
  ];
  /// Consulta
  return new Promise((resolve, reject) => {
    connection.query(
      sqlCrearPedido,
      values,
      function (err, resultados, campos) {
        if (err) reject(err);
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
async function getEstadoPed_Productos(idPedido, estado) {
  const sqlEstado = `SELECT 
  ped.idPedido,
  ped.idMesa
  FROM pedido 
  ped INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido 
  WHERE ped.idPedido=${idPedido} AND det.Estado = "${estado}";`;

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

function getProductos() {
  const sqlTraerProductos = `SELECT * FROM productos`;
  return new Promise((resolve, reject) => {
    connection.query(sqlTraerProductos, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

function udtProducto(producto) {
 const {nombre, descripcion, precio, estado, imagen, codigo} = producto
  const sqludtProducto = `UPDATE productos SET 
  Nombre = '${nombre}', 
  Descripcion = '${descripcion}',
  Precio = ${precio},
  Estado = '${estado}',
  Imagen = '${imagen}'
  WHERE productos.codProducto = '${codigo}'`;


  return new Promise((resolve, reject) => {
    connection.query(sqludtProducto, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

function crearProducto(producto) {
  const {nombre, descripcion, precio, estado, imagen, codigo} = producto
   const sqludtProducto = `INSERT INTO productos 
   (codProducto, Nombre, Descripcion, idCategoria, Precio, Imagen, Estado) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`;
   const values = [
    codigo, nombre, descripcion, "1", precio, imagen,
    estado
   ]
 
 
   return new Promise((resolve, reject) => {
     connection.query(sqludtProducto, values, function (err, resultados) {
       if (err) reject(err);
       else {
         resolve(resultados);
       }
     });
   });
 }
 

function getProductosPedido(idPedido) {
  const sqlTraerProductos = `SELECT pro.Nombre, det.Cantidad, det.Comentario,det.codProducto, det.Estado FROM pedido ped INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido INNER JOIN productos pro ON det.codProducto=pro.codProducto INNER JOIN usuarios usu ON ped.Usuario=usu.Usuario 
  WHERE ped.idPedido= ${idPedido} ORDER BY Estado DESC`;

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
      } else {
        console.log(`producto: ${producto.id} ID del pedido: ${id}`);
      }
    });
  });
}
function udtProductoPedido(estado, idPedido, codProducto) {
  const sqlActualizar = `UPDATE pedido_productos SET Estado = '${estado}' WHERE pedido_productos.idPedido = ${idPedido} AND pedido_productos.codProducto = '${codProducto}'`;

  return new Promise((resolve, reject) => {
    connection.query(sqlActualizar, function (err, resultados, campos) {
      if (err) throw console.error(err);
      else {
        resolve(resultados.affectedRows);
      }
    });
  });
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
function traerMesas(idMesa) {
  const sqlTraerMesas = idMesa
    ? `SELECT * FROM mesa WHERE idMesa=${idMesa}`
    : "SELECT * FROM mesa";
  return new Promise((resolve, reject) => {
    connection.query(sqlTraerMesas, function (err, resultados, campos) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function getMesaDePedido(idPedido) {
  const sqlObtenerId = `SELECT idMesa FROM pedido WHERE idPedido= ${idPedido} ORDER BY Fecha DESC LIMIT 1`;
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerId, function (err, resultados, campos) {
      if (err) {
        throw console.error(err);
      } else {
        resolve(resultados[0].idMesa);
      }
    });
  });
}
//METODOS TEST
function test() {
  // const sqlQuery = util.promisify(connection.query)
  //sqlQuery("SELECT 1 + 1 AS solution").then((res)=>console.log("Respuesta de Test: ", res))
}

function restablecer() {
  const mesas = "UPDATE mesa SET Estado = 'Disponible';  ";
  const borrarPro = "DELETE from pedido_productos;";
  const borrarPed = " DELETE from pedido;";
  const contador = "ALTER TABLE pedido AUTO_INCREMENT = 1";

  return new Promise((resolve, reject) => { 

    connection.query(mesas, function (err, resultados, campos) {
      if (err) {
        throw console.error(err);
      } else {
        connection.query(borrarPro, function (err, resultados, campos) {
          if (err) throw console.error(err);
          connection.query(borrarPed, function (err, resultados, campos) {
            if (err) throw console.error(err);
            connection.query(contador, function (err, resultados, campos) {
              if (err) throw console.error(err);
              resolve(resultados)
            }
             
              )
          });
        });
      }
    });


   })

}

module.exports = {
  nuevoPedido,
  traerPedidos,
  getProductosPedido,
  udtProductoPedido,
  getEstadoPed_Productos,
  actualizarEstadoPedido,
  obtenerElPedidoDeUnaMesa,
  actualizarEstadoMesa,
  traerMesas,
  getMesaDePedido,
  getProductos,
  udtProducto,
  crearProducto,
  test,
  restablecer,
};
