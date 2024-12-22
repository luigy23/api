//const util = require('util')
// variables de entorno
const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2");
const { imprimirTicketComanda } = require("./services/ticket");
const { get } = require("./app");
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "", /// en el server es 123456 en local es vacio
  database: process.env.DB_NAME || "restaurante2",
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (err, rows, fields) {
  if (err) throw err;
  console.log("Connected to DB!");
});

//Metodos Login
function login(usuario) {
  const sqlLogin = `SELECT * FROM usuarios WHERE Usuario = ?`;
  const values = [usuario];
  return new Promise((resolve, reject) => {
    connection.query(sqlLogin, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function registrar(usuario) {
  //los campos son INSERT INTO `usuarios` (`Usuario`, `Nombres`, `Apellidos`, `FechaNacimiento`, `idCargo`, `Contraseña`, `Estado`) VALUES ('', '', '', NULL, '', '', '')
  const sqlRegistrar = `INSERT INTO usuarios (Usuario, Nombres, Apellidos, FechaNacimiento, idCargo, Contraseña, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    usuario.Usuario,
    usuario.Nombres,
    usuario.Apellidos,
    usuario.FechaNacimiento,
    usuario.idCargo,
    usuario.Contraseña,
    usuario.Estado,
  ];
  return new Promise((resolve, reject) => {
    connection.query(sqlRegistrar, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

//Metodos Usuarios
function obtenerUsuarios(estado = null) {
  let sqlObtenerUsuarios = `SELECT Usuario, Nombres, Apellidos, FechaNacimiento, cargo.Nombre AS cargo, usuarios.Estado FROM usuarios LEFT JOIN cargo ON usuarios.idCargo = cargo.idCargo   `;
  if (estado !== null) {
    sqlObtenerUsuarios += ` WHERE usuarios.Estado = '${estado}'`;
  }

  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerUsuarios, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function obtenerUsuario(usuario) {
  const sqlObtenerUsuario = `SELECT * FROM usuarios WHERE Usuario = ?`;
  const values = [usuario];
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerUsuario, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function actualizarUsuario(usuario) {
  let sqlActualizarUsuario = `UPDATE usuarios SET`;
  const values = [];

  if (usuario.Nombres) {
    sqlActualizarUsuario += ` Nombres = ?,`;
    values.push(usuario.Nombres);
  }

  if (usuario.Apellidos) {
    sqlActualizarUsuario += ` Apellidos = ?,`;
    values.push(usuario.Apellidos);
  }

  if (usuario.FechaNacimiento) {
    sqlActualizarUsuario += ` FechaNacimiento = ?,`;
    values.push(usuario.FechaNacimiento);
  }

  if (usuario.idCargo) {
    sqlActualizarUsuario += ` idCargo = ?,`;
    values.push(usuario.idCargo);
  }

  if (usuario.Contraseña) {
    sqlActualizarUsuario += ` Contraseña = ?,`;
    values.push(usuario.Contraseña);
  }

  if (usuario.Estado) {
    sqlActualizarUsuario += ` Estado = ?,`;
    values.push(usuario.Estado);
  }

  // Remove the trailing comma if any
  sqlActualizarUsuario = sqlActualizarUsuario.replace(/,$/, "");

  sqlActualizarUsuario += ` WHERE Usuario = ?`;
  values.push(usuario.Usuario);

  return new Promise((resolve, reject) => {
    connection.query(sqlActualizarUsuario, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

function eliminarUsuario(usuario) {
  const sqlEliminarUsuario = `DELETE FROM usuarios WHERE usuarios.Usuario = ?`;
  const values = [usuario];
  return new Promise((resolve, reject) => {
    connection.query(sqlEliminarUsuario, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
//verificar si el usuario tiene el Estado Activo
function verificarEstadoUsuario(usuario) {
  const sqlVerificarEstado = `SELECT Estado FROM usuarios WHERE Usuario = ?`;
  const values = [usuario];
  return new Promise((resolve, reject) => {
    connection.query(sqlVerificarEstado, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}
function cambiarEstadoUsuario(usuario, estado) {
  const sqlCambiarEstado = `UPDATE usuarios SET Estado = ? WHERE Usuario = ?`;
  const values = [estado, usuario];
  return new Promise((resolve, reject) => {
    connection.query(sqlCambiarEstado, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

async function nuevoPedido(pedido) {
  // Validar los parámetros de entrada
  if (
    !pedido ||
    !pedido.Mesa ||
    !pedido.Mesero ||
    !pedido.Total ||
    !pedido.Productos ||
    !Array.isArray(pedido.Productos)
  ) {
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
  return new Promise((resolve, reject) => {
    connection.query(
      sqlCrearPedido,
      values,
      async (err, resultados, campos) => {
        if (err) reject(err);
        else {

          console.log("Pedido creado:", resultados.insertId);
          await agregarProductosAlPedido(resultados.insertId, pedido.Productos);
          resolve(resultados.affectedRows);
      

        }
      }
    );
  });
}

function traerPedidos(filtro, values, limit) {
  const sqlPedidos =
    "SELECT pedido.*, mesa.Descripcion " +
    "FROM `pedido` " +
    "JOIN `mesa` ON pedido.idMesa = mesa.idMesa " +
    filtro.replace(/(\bEstado\b)/g, 'pedido.Estado') +
    " ORDER BY `pedido`.`Fecha` DESC " +
    (limit ? "LIMIT ?" : "");

  // Si "limit" es un número válido, lo agregamos al arreglo "values"
  if (limit) {
    // Convertir a entero
    limit = parseInt(limit);
    values.push(limit);
  }

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
      console.log("Estado de pedido actualizado:", resultados.affectedRows);
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
async function getCambiosPedido(idPedido) {
  const sqlCambios = "SELECT Cambios FROM `pedido` WHERE idPedido=?";
  const values = [idPedido];
  return new Promise((resolve, reject) => {
    connection.query(sqlCambios, values, function (err, resultados, campos) {
      if (err) {
        throw console.error(err);
      } else {
        resolve(resultados);
      }
    });
  });
}
async function udtCambiosPedido(idPedido, cambio) {
  const sqlCambios = "UPDATE pedido SET Cambios = ? WHERE idPedido=?";
  const values = [cambio, idPedido];
  return new Promise((resolve, reject) => {
    connection.query(sqlCambios, values, function (err, resultados, campos) {
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
  const sqlTraerProductos = `SELECT * 
FROM productos 
ORDER BY 
  CASE WHEN Stock = 0 THEN 1 ELSE 0 END, 
  Nombre ASC;`;
  return new Promise((resolve, reject) => {
    connection.query(sqlTraerProductos, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}

function getProductoById(codigo) {
  const sqlTraerProducto = `SELECT * FROM productos WHERE codProducto = ?`;
  return new Promise((resolve, reject) => {
    connection.query(sqlTraerProducto, [codigo], function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados[0]);
      }
    });
  });
}


async function udtProducto(producto) {
  const {
    nombre,
    descripcion,
    categoria,
    precio,
    estado,
    imagen,
    stock,
    codigo,
  } = producto;

  // Verificar que los campos obligatorios no sean nulos
  if (!codigo || !nombre || !categoria || !precio) {
    throw new Error('Faltan campos obligatorios para actualizar el producto');
  }

  // Preparar consulta parametrizada
  const sqludtProducto = `
    UPDATE productos SET 
      Nombre = ?, 
      Descripcion = ?,
      idCategoria = ?,
      Precio = ?,
      Estado = ?,
      Imagen = ?,
      Stock = ?
    WHERE codProducto = ?`;

  const valores = [
    nombre,
    descripcion || null,
    categoria,
    precio,
    estado || 'activo', // Valor por defecto
    imagen || null,
    stock || 10, // Valor por defecto
    codigo,
  ];

  // Ejecutar la consulta
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(sqludtProducto, valores, (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
    return resultados;
  } catch (err) {
    throw new Error(`Error al actualizar el producto: ${err.message}`);
  }
}


async function restarStockProducto(codigoProducto, cantidad) {
  const stockActual = await obteneStockProducto(codigoProducto);
  const nuevoStock = stockActual - cantidad;
  if (nuevoStock < 0) return false;

  const sqlRestarStock = `UPDATE productos SET Stock = ? WHERE codProducto = ?`;
  const values = [nuevoStock, codigoProducto];
  return new Promise((resolve, reject) => {
    connection.query(sqlRestarStock, values, function (err, resultados) {
      if (err) reject(err);
      else {
        console.log("Stock actualizado:" + codigoProducto + " ->", resultados.affectedRows);
        resolve(true); // Asegurarse de resolver la promesa correctamente
      }
    });
  });
}


function obteneStockProducto(codigoProducto) {
  const sqlObtenerStock = `SELECT Stock FROM productos WHERE codProducto = ?`;
  const values = [codigoProducto];
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerStock, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados[0].Stock);
      }
    });
  });
}

function crearProducto(producto) {
  const { nombre, descripcion, precio, estado, imagen, codigo, categoria, stock } =
    producto;
  const sqludtProducto = `INSERT INTO productos 
   (codProducto, Nombre, Descripcion, idCategoria, Precio, Imagen, Estado, Stock) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    codigo,
    nombre,
    descripcion,
    categoria,
    precio,
    imagen,
    estado,
    stock,
  ];

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
  const sqlTraerProductos = `SELECT pro.Nombre, pro.Precio, det.Cantidad, det.Comentario,det.codProducto, det.Estado, det.idRegistro, ped.idPedido FROM pedido ped INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido INNER JOIN productos pro ON det.codProducto=pro.codProducto INNER JOIN usuarios usu ON ped.Usuario=usu.Usuario  
  WHERE ped.idPedido= ? ORDER BY Estado DESC`;

  return new Promise((resolve, reject) => {
    connection.query(
      sqlTraerProductos,
      [idPedido],
      function (err, resultados, campos) {
        if (err) reject(err);
        else {
          resolve(resultados);
        }
      }
    );
  });
}
function udtProductoPedido(estado, idPedido, codProducto, idRegistro) {
  const sqlActualizar =
    "UPDATE `pedido_productos` SET `Estado` = ? WHERE `pedido_productos`.`idPedido` = ? AND `pedido_productos`.`codProducto` = ? AND `pedido_productos`.`idRegistro` = ?";
  const values = [estado, idPedido, codProducto, idRegistro];

  return new Promise((resolve, reject) => {
    connection.query(sqlActualizar, values, function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados.affectedRows);
      }
      //mostramos la consulta sql:
      console.log(this.sql);
    });
  });
}

async function agregarProductosAlPedido(id, productos, idRegistro = 0) {

  // Validar los parámetros de entrada
  if (!id || !productos || !Array.isArray(productos)) {
    throw new Error("Parámetros de entrada incorrectos");
  }

  try {
    // Verificar y restar el stock de todos los productos de forma concurrente
    await Promise.all(productos.map(async producto => {
      const restarStock = await restarStockProducto(producto.id, producto.cantidad);
      if (!restarStock) {
        throw new Error(`No hay suficiente stock para el producto ${producto.id}`);
      }
    }));

    // Si el stock es suficiente, proceder a agregar los productos al pedido
    for (const producto of productos) {
      const sqlProductos = `
        INSERT INTO pedido_productos (idPedido, codProducto, Cantidad, Precio, Comentario, Estado, idRegistro)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        id,
        producto.id,
        producto.cantidad,
        producto.precio,
        producto.comentario,
        "Pendiente",
        idRegistro,
      ];

      // Esperar a que la consulta se complete antes de continuar con el siguiente producto
      await new Promise((resolve, reject) => {
        connection.query(sqlProductos, values, (err, resultados) => {
          if (err) reject(err);
          else {
            console.log("Producto agregado:" + producto.id + " ", resultados.affectedRows);
            resolve(resultados);
          }
        });
      });
    }
  } catch (error) {
    console.error("Error al procesar los productos:", error);
    // Manejar el error adecuadamente
    // Dependiendo de tu caso de uso, podrías querer revertir las operaciones de stock si es necesario
  }
}


//METODOS FACTURAS
function insertarFactura(factura) {
  const {
    idPedido,
    idCaja,
    subtotal,
    descuento,
    iva,
    total,
    idMetodoPago,
    recibido,
    cambio,
    usuario,
    fecha,
    estado,
    propina,
    comentario,
  } = factura;

  const sqlInsertarFactura = `INSERT INTO factura
      (idPedido, idCaja, Subtotal, Descuento, IVA, Total, idMetodoPago, Recibido, Cambio, Usuario, Fecha, Estado, Propina, Comentario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    idPedido,
    idCaja,
    subtotal,
    descuento,
    iva,
    total,
    idMetodoPago,
    recibido,
    cambio,
    usuario,
    fecha,
    estado,
    propina,
    comentario,
  ];

  return new Promise((resolve, reject) => {
    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback();
        return reject(error);
      }

      connection.query(sqlInsertarFactura, values, function (error, resultado) {
        if (error) {
          connection.rollback();
          return reject(error);
        }

        const numFactura = resultado.insertId;

        const movimiento = {
          numFactura: numFactura,
          monto: total,
          descripcion: idMetodoPago,
          tipo: "Ingreso",
          idCaja: idCaja,
          fechaHora: null,
          idPedido: idPedido,
        };

        insertarMovimiento(movimiento)
          .then(() => {
            connection.commit();
            resolve({ numFactura });
          })
          .catch((error) => {
            connection.rollback();
            reject(error);
          });
      });
    });
  });
}
function obtenerFacturas(fechas, limit) {
  const sqlObtenerFacturas = `
  SELECT factura.*, mesa.Descripcion as Mesa, factura.Usuario as Usuario
  FROM factura
  LEFT JOIN pedido ON factura.idPedido = pedido.idPedido 
  LEFT JOIN mesa ON pedido.idMesa = mesa.idMesa
  WHERE factura.Fecha BETWEEN ? AND ?
  ORDER BY factura.Fecha DESC
  ${limit ? "LIMIT ?" : ""};`;

  const values = [fechas.fechaInicio, fechas.fechaFin];

  if (limit) {
    values.push(limit);
  }

  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerFacturas, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    });
  });
}
function obtenerFacturaPorId(idFactura) {
  const sqlObtenerFacturas = `
  SELECT factura.*, mesa.Descripcion as Mesa, factura.Usuario as Usuario
  FROM factura
  LEFT JOIN pedido ON factura.idPedido = pedido.idPedido
  LEFT JOIN mesa ON pedido.idMesa = mesa.idMesa
  WHERE factura.NumFactura = ?;`;

  const values = [idFactura];

  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerFacturas, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    });
  });
}

//Cuenta - Impresion de ticket




//METODOS CAJA
function inicializarCaja(estado, saldoInicial) {
  const fecha = new Date();

  const sqlInsertarCaja = `INSERT INTO caja (Estado, SaldoInicial, Saldo, Fecha) VALUES (?, ?, ?, ?)`;

  const values = [estado, saldoInicial, saldoInicial, fecha];

  return new Promise((resolve, reject) => {
    connection.query(sqlInsertarCaja, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    });
  });
}
function obtenerCajaActiva() {
  const sqlObtenerCaja = `select * from caja where Estado = 'Activa' order by idCaja desc limit 1;`;

  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerCaja, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    });
  });
}
function sumarSaldoCaja(idCaja, saldo) {
  const sqlSumarSaldo = "UPDATE caja SET Saldo = Saldo + ? WHERE idCaja = ?";
  const values = [saldo, idCaja];
  return new Promise((resolve, reject) => {
    connection.query(sqlSumarSaldo, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    });
  });
}

//METODOS MOVIMIENTOS
function insertarMovimiento(datosMovimiento) {
  const sqlInsertarMovimiento =
    "INSERT INTO movimientos (NumFactura, Monto, Descripcion, Tipo, idCaja, FechaHora, idPedido) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP(),?)"; // aquí se utiliza CURRENT_TIMESTAMP() para la fecha y hora
  const values = [
    datosMovimiento.numFactura,
    datosMovimiento.monto,
    datosMovimiento.descripcion,
    datosMovimiento.tipo,
    datosMovimiento.idCaja,
    datosMovimiento.idPedido,
  ];
  return new Promise((resolve, reject) => {
    connection.query(
      sqlInsertarMovimiento,
      values,
      function (error, resultado) {
        if (error) reject(error);
        else resolve(resultado.insertId);
      }
    );
  });
}
function getMovimientos(idCaja) {
  const sqlObtenerMovimientos = `
SELECT movimientos.*, 
       mesa.Descripcion AS Mesa, 
       pedido.Usuario AS Usuario, 
       factura.Subtotal AS Subtotal, 
       factura.Propina AS Propina, 
       metodospago.Nombre AS MetodoPago
FROM movimientos
LEFT JOIN factura ON movimientos.NumFactura = factura.NumFactura
LEFT JOIN pedido ON factura.idPedido = pedido.idPedido
LEFT JOIN mesa ON pedido.idMesa = mesa.idMesa
LEFT JOIN metodospago ON factura.idMetodoPago = metodospago.idMetodoPago
WHERE movimientos.idCaja = ?
ORDER BY movimientos.FechaHora DESC;

`;
  const values = [idCaja];
  return new Promise((resolve, reject) => {
    connection.query(
      sqlObtenerMovimientos,
      values,
      function (error, resultado) {
        if (error) reject(error);
        else resolve(resultado);
      }
    );
  });
}
function getTodosMovimientos() {
  const sqlObtenerMovimientos = `
SELECT movimientos.*, 
       mesa.Descripcion AS Mesa, 
       factura.Usuario AS Usuario, 
       factura.Subtotal AS Subtotal, 
       factura.Propina AS Propina, 
       metodospago.Nombre AS MetodoPago
FROM movimientos
LEFT JOIN factura ON movimientos.NumFactura = factura.NumFactura
LEFT JOIN pedido ON factura.idPedido = pedido.idPedido
LEFT JOIN mesa ON pedido.idMesa = mesa.idMesa
LEFT JOIN metodospago ON factura.idMetodoPago = metodospago.idMetodoPago
ORDER BY movimientos.FechaHora DESC;

`;
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerMovimientos, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    });
  });
}
function getMovimientosFiltrados(fechaInicio, fechaFin, tipoMovimiento) {
  const sqlObtenerMovimientos = `
SELECT movimientos.*, 
       mesa.Descripcion AS Mesa, 
       factura.Usuario AS Usuario, 
       factura.Subtotal AS Subtotal, 
       factura.Propina AS Propina, 
       metodospago.Nombre AS MetodoPago
FROM movimientos
LEFT JOIN factura ON movimientos.NumFactura = factura.NumFactura
LEFT JOIN pedido ON factura.idPedido = pedido.idPedido
LEFT JOIN mesa ON pedido.idMesa = mesa.idMesa
LEFT JOIN metodospago ON factura.idMetodoPago = metodospago.idMetodoPago
WHERE DATE(movimientos.FechaHora) BETWEEN ? AND ?
  AND movimientos.Tipo = ?
ORDER BY movimientos.FechaHora DESC;
`;
  const values = [fechaInicio, fechaFin, tipoMovimiento];
  return new Promise((resolve, reject) => {
    connection.query(
      sqlObtenerMovimientos,
      values,
      function (error, resultado) {
        if (error) reject(error);
        else resolve(resultado);
      }
    );
  });
}
//Reportes de ventas

function obtenerVentas(fechas) {
  console.log("Obtener ventas", fechas);
  console.log(fechas);
  const sqlObtenerVentas = `  SELECT COUNT(*) AS CantidadPedidos, SUM(CASE WHEN Estado = 'Pagado' THEN Subtotal ELSE 0 END) AS TotalFacturado FROM factura   WHERE DATE(Fecha) BETWEEN ? AND ?;`;
  const values = [fechas.fechaInicio, fechas.fechaFin ];
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerVentas, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    }
    );
  });
}

function obtenerVentasMeseros(fechas) {
  const sqlObtenerVentasMeseros = `SELECT p.Usuario AS Mesero, COUNT(DISTINCT p.idPedido) AS CantidadPedidos, SUM(p.Total) AS TotalVentas, SUM(f.Propina) AS TotalPropinas, SUM(p.Total) + SUM(f.Propina) AS TotalVentasConPropinas FROM pedido p LEFT JOIN factura f ON p.idPedido = f.idPedido WHERE p.Estado = 'Facturado' AND f.Estado = 'Pagado' 
  and f.Fecha BETWEEN ? AND ?
  GROUP BY p.Usuario ORDER BY TotalVentasConPropinas DESC; `;
  const values = [fechas.fechaInicio, fechas.fechaFin+" 23:59"];
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerVentasMeseros, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
    });
  }
  );
}

function obtenerVentasTipoPago(fechas, tipoPago) {
  const sqlObtenerVentasTipoPago = `SELECT COUNT(*) AS Cantidad, SUM(Total) AS Total FROM factura WHERE Estado = 'Pagado' AND idMetodoPago = ? AND Fecha BETWEEN ? AND ?;`;
  const values = [tipoPago, fechas.fechaInicio, fechas.fechaFin];
  return new Promise((resolve, reject) => {
    connection.query(sqlObtenerVentasTipoPago, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado);
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
function crearCategoria(nombre, descripcion) {
  const sqlcrearCategoria = `INSERT INTO categoria (Nombre,Descripcion, Estado) VALUES ('${nombre}','${descripcion}', 'Activo')`;
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



// metodos de pago:
function crearMetodoPago(nombre, descripcion, estado) {
  const sql =
    "INSERT INTO metodospago (Nombre, Descripcion, Estado) VALUES (?, ?, ?)";
  const values = [nombre, descripcion, estado];
  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado.insertId);
    });
  });
}
function obtenerMetodoPagoPorId(idMetodoPago) {
  const sql = "SELECT * FROM metodospago WHERE idMetodoPago = ?;";
  const values = [idMetodoPago];
  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (error, resultados) {
      if (error) reject(error);
      else resolve(resultados[0]);
    });
  });
}
function actualizarMetodoPago(idMetodoPago, nombre, descripcion, estado) {
  const sql =
    "UPDATE metodospago SET Nombre = ?, Descripcion = ?, Estado = ? WHERE idMetodoPago = ?;";
  const values = [nombre, descripcion, estado, idMetodoPago];
  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado.affectedRows > 0);
    });
  });
}
function eliminarMetodoPago(idMetodoPago) {
  const sql = "DELETE FROM metodospago WHERE idMetodoPago = ?;";
  const values = [idMetodoPago];
  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (error, resultado) {
      if (error) reject(error);
      else resolve(resultado.affectedRows > 0);
    });
  });
}
function obtenerMetodosPago() {
  const sql = "SELECT * FROM metodospago;";
  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, resultados) {
      if (error) reject(error);
      else resolve(resultados);
    });
  });
}

//MESAS
function crearMesa(descripcion) {
  // Utiliza un marcador de posición "?" para los valores que serán insertados
  const sqlCrearMesa = `INSERT INTO mesa (Descripcion, Estado) VALUES (?, "Disponible")`;

  return new Promise((resolve, reject) => {
    // Pasas el SQL y los valores como un array en lugar de concatenarlos directamente
    connection.query(sqlCrearMesa, [descripcion], function (err, resultados) {
      if (err) reject(err);
      else {
        resolve(resultados);
      }
    });
  });
}


function obtenerElPedidoDeUnaMesa(idMesa) {
  const sqlObtenerId =
    "SELECT idPedido FROM pedido WHERE idMesa = ? ORDER BY Fecha DESC LIMIT 1";
  return new Promise((resolve, reject) => {
    connection.query(
      sqlObtenerId,
      [idMesa],
      function (err, resultados, campos) {
        if (err) {
          reject(err);
        } else {
          if (resultados.length > 0) {
            resolve(resultados[0].idPedido);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}
function actualizarEstadoMesa(idMesa, estado) {
  const sqlEstadoMesa = `UPDATE mesa SET Estado = '${estado}' WHERE mesa.idMesa = ${idMesa}`;
  return new Promise((resolve, reject) => {
    connection.query(sqlEstadoMesa, function (err, resultados, campos) {
      if (err) throw console.error(err);
      else console.log("Mesa actualizada:", resultados.affectedRows);
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

function cambiarDescripcionMesa(idMesa, descripcion) {
  const sqlCambiarDescripcion = `UPDATE mesa SET Descripcion = '${descripcion}' WHERE mesa.idMesa = ${idMesa}`;
  return new Promise((resolve, reject) => {
    connection.query(sqlCambiarDescripcion, function (err, resultados, campos) {
      if (err) {
        throw console.error(err);
      } else {
        resolve(resultados);
      }
    });
  });
}

//Reportes

function obtenerReporteVentas(fechas) {
}


//METODOS TEST
function test() {
  // const sqlQuery = util.promisify(connection.query)
  //sqlQuery("SELECT 1 + 1 AS solution").then((res)=>console.log("Respuesta de Test: ", res))
}

async function restablecer() {
  const borrarFacturas = "DELETE from factura;";
  const mesas = "UPDATE mesa SET Estado = 'Disponible';  ";
  const borrarPro = "DELETE from pedido_productos;";
  const borrarPed = " DELETE from pedido;";
  const contador = "ALTER TABLE pedido AUTO_INCREMENT = 1";
  const contadorFactura = "ALTER TABLE factura AUTO_INCREMENT = 1";
  const borrarMovimientos = "DELETE from movimientos;";

  const borrarCaja = "DELETE from caja;";

  try {
    connection.beginTransaction();
    connection.query(borrarFacturas);
    connection.query(mesas);
    connection.query(borrarPro);
    connection.query(borrarPed);
    connection.query(contador);
    connection.query(contadorFactura);

    connection.query(borrarCaja);
    connection.query(borrarMovimientos);
    connection.commit();
    console.log("Se ha restablecido la base de datos");
  } catch (error) {
    console.log("Error al restablecer la base de datos");
  }
}

module.exports = {
  login,
  registrar,
  obtenerUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  verificarEstadoUsuario,
  cambiarEstadoUsuario,

  nuevoPedido,
  traerPedidos,
  getCambiosPedido,
  udtCambiosPedido,

  getProductosPedido,
  getProductoById,
  udtProductoPedido,
  getEstadoPed_Productos,
  actualizarEstadoPedido,
  crearMesa,
  obtenerElPedidoDeUnaMesa,
  actualizarEstadoMesa,
  traerMesas,
  getMesaDePedido,
  cambiarDescripcionMesa,

  getProductos,
  udtProducto,
  crearProducto,
  agregarProductosAlPedido,
  restarStockProducto,
  obteneStockProducto,

  insertarFactura,
  obtenerFacturas,
  obtenerFacturaPorId,

  test,
  restablecer,
  delProducto,
  crearCategoria,
  traerCategoria,
  cambiarCategoria,
  delCategoria,

  inicializarCaja,
  obtenerCajaActiva,
  sumarSaldoCaja,

  insertarMovimiento,
  getMovimientos,
  getTodosMovimientos,
  getMovimientosFiltrados,
  obtenerVentas,
  obtenerVentasMeseros,

  crearMetodoPago,
  obtenerMetodoPagoPorId,
  actualizarMetodoPago,
  eliminarMetodoPago,
  obtenerMetodosPago,
};
