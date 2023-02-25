//const util = require('util')

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Luigy23.",
  database: "restaurante2",
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (err, rows, fields) {
  if (err) throw err;
  console.log("Connected to DB!");
});

//METODOS PEDIDOS
// function nuevoPedido(pedido) {
//   const fechaActual = new Date(Date.now());
//   const sqlCrearPedido = `
//   INSERT INTO pedido (idMesa, Usuario, idCliente, idSede, Fecha, Total, Estado)
//   VALUES ( ?,?,?,?,?,?,?);
// `;
//   const values = [
//     pedido.Mesa,
//     pedido.Mesero,
//     null,
//     "123",
//     fechaActual,
//     pedido.Total,
//     "Pendiente",
//   ];
//   /// Consulta
//   return new Promise((resolve, reject) => {
//     connection.query(
//       sqlCrearPedido,
//       values,
//       function (err, resultados, campos) {
//         if (err) reject(err);
//         else {
//           agregarProductosAlPedido( resultados.insertId,pedido.Productos);
//           resolve(resultados.affectedRows);
//         }
//       }
//     );
//   });
//}

async function nuevoPedido(pedido) {
  // Validar los parámetros de entrada
  if (!pedido || !pedido.Mesa || !pedido.Mesero || !pedido.Total || !pedido.Productos || !Array.isArray(pedido.Productos)) {
    throw new Error("Parámetros de entrada incorrectos");
  }

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

  // Usar una función asíncrona
  return new Promise( (resolve, reject) => {
     connection.query(
      sqlCrearPedido,
      values,
      async (err, resultados, campos) => {
        if (err) reject(err);
        else {
          await agregarProductosAlPedido( resultados.insertId,pedido.Productos);
          resolve(resultados.affectedRows);
        }
      }
    );
  });
}

function traerPedidos(filtro, values) {
  const sqlPedidos =
    "SELECT * FROM `pedido` " + filtro + " ORDER BY `pedido`.`Fecha` DESC";

  return new Promise((resolve, reject) => {
    connection.query(sqlPedidos, values, function (err, resultados, campos) {
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
 const {nombre, descripcion, categoria , precio, estado, imagen, codigo} = producto
  const sqludtProducto = `UPDATE productos SET 
  Nombre = '${nombre}', 
  Descripcion = '${descripcion}',
  idCategoria = ${categoria},
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
  const {nombre, descripcion, precio, estado, imagen, codigo, categoria} = producto
   const sqludtProducto = `INSERT INTO productos 
   (codProducto, Nombre, Descripcion, idCategoria, Precio, Imagen, Estado) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`;
   const values = [
    codigo, nombre, descripcion, categoria , precio, imagen,
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

 function delProducto(idProducto) {
  const sqldelProducto = `DELETE FROM productos WHERE codProducto = '${idProducto}'`;


  return new Promise((resolve, reject) => {
    connection.query(sqldelProducto, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}




function getProductosPedido(idPedido) {
  const sqlTraerProductos = `SELECT pro.Nombre, pro.Precio, det.Cantidad, det.Comentario,det.codProducto, det.Estado FROM pedido ped INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido INNER JOIN productos pro ON det.codProducto=pro.codProducto INNER JOIN usuarios usu ON ped.Usuario=usu.Usuario 
  WHERE ped.idPedido= ? ORDER BY Estado DESC`;

  return new Promise((resolve, reject) => {
    connection.query(sqlTraerProductos,[idPedido], function (err, resultados, campos) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

async function agregarProductosAlPedido(id, productos) {
  // Validar los parámetros de entrada
  if (!id || !productos || !Array.isArray(productos)) {
    throw new Error("Parámetros de entrada incorrectos");
  }

  productos.forEach(async producto => {
    // Usar una expresión de plantilla para mejorar la legibilidad del código
    const sqlProductos = `
      INSERT INTO pedido_productos (idPedido, codProducto, Cantidad, Precio, Comentario,  Estado)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      id,
      producto.id,
      producto.cantidad,
      producto.precio,
      producto.comentario,
      
      "Pendiente",
    ];

    // Usar una función asíncrona 
     connection.query(sqlProductos, values, (err, resultados, campos) => {
      if (err) {
        console.log("hubo un error: ", err);
      } else {
        console.log(`producto: ${producto.id} ID del pedido: ${id}`);
      }
    });
  });
}

//Metodos Categoria
function traerCategoria() {
  const sqlTraerCategoria = `SELECT * FROM categoria`;
  return new Promise((resolve, reject) => {
    connection.query(sqlTraerCategoria, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function cambiarCategoria(idCategoria, nombre) {
  const sqlcambiarCategoria = `UPDATE categoria SET Nombre = '${nombre}' WHERE categoria.idCategoria = ${idCategoria}`;
  return new Promise((resolve, reject) => {
    connection.query(sqlcambiarCategoria, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function crearCategoria(nombre,descripcion) {
  const sqlcrearCategoria = `INSERT INTO categoria (Nombre,Descripcion) VALUES ('${nombre}','${descripcion}')`;
  return new Promise((resolve, reject) => {
    connection.query(sqlcrearCategoria, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function delCategoria(idCategoria) {
  const sqldelCategoria = `DELETE FROM categoria WHERE idCategoria = ${idCategoria}`;
  return new Promise((resolve, reject) => {
    connection.query(sqldelCategoria, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
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
function crearMesa(descripcion, idMesa) {
  const sqlCrearMesa = `INSERT INTO mesa (Descripcion, idMesa) VALUES ('${descripcion}', ${idMesa})`;
  return new Promise((resolve, reject) => {
    connection.query(sqlCrearMesa, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

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
  crearMesa,
  obtenerElPedidoDeUnaMesa,
  actualizarEstadoMesa,
  traerMesas,
  getMesaDePedido,

  getProductos,
  udtProducto,
  crearProducto,

  test,
  restablecer,
  delProducto,
  crearCategoria,
  traerCategoria,
  cambiarCategoria,
  delCategoria,
};
