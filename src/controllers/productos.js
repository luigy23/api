const con = require("../mysql.js");
const  io  = require("../routes/socketio");
const fs = require('fs').promises;
const path = require('path');


async function getProductos(req, res){

    const Productos = await con.getProductos()
    res.json(Productos)
}

async  function udtProducto (req, res) {
    const producto =JSON.parse(req.body.producto)
  
    if (req.file){
      const imagenPath = req.file.path
      const nombre = producto.codigo
      const nuevoNombre = 'public/imagenes/'+nombre+'.jpg'
      const productoConImagen = {...producto, imagen:`/productos/imagenes/${nombre}`}
      await fs.rename(imagenPath,nuevoNombre,(err) => err && console.error(err))
      await con.udtProducto(productoConImagen)
      res.json(productoConImagen)
      
    }else{
      res.json("Envia una imagen")
      const  response  =await con.udtProducto(producto)
      console.log("producto actualizado", response)
    }
    io.actualizarProductos()
}




// Función principal para crear el producto
async function crearProducto(req, res) {
  try {
    const producto = JSON.parse(req.body.producto);
    console.log("producto", producto);

    const { valido, producto: productoPreparado } = prepararProducto(producto);

    if (!valido) {
      return res.status(400).json({ error: "Faltan campos por completar" });
    }



    const productoConImagen = await manejarImagenProducto(req, productoPreparado);
    const productoCreado = await insertarProductoEnDB(productoConImagen);

    res.json(productoCreado);
    io.actualizarProductos(); // Asegúrate de que esta función se maneje correctamente
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


async function delProducto (req, res) {
  const {id} = req.params

  const responseDel = await con.delProducto(id)
  console.log("producto eliminado", responseDel)
  res.json(responseDel)
  io.actualizarProductos()
}



//funciones de servicio
// Valida los campos requeridos del producto
// Prepara el producto, estableciendo valores predeterminados si son necesarios
function prepararProducto(producto) {
  // Establece el estado a 'Disponible' si no se ha proporcionado uno
  if (!producto.estado) {
    producto.estado = 'Disponible';
  }
  
  // Verifica que los campos requeridos estén presentes
  const { codigo, nombre, descripcion, categoria, precio, stock } = producto;
  if (!codigo || !nombre || !descripcion || !categoria || !precio || !stock) {
    return { valido: false };
  }

  return { valido: true, producto };
}


// Maneja el archivo de imagen del producto y actualiza la información del producto
async function manejarImagenProducto(req, producto) {
  let imagenPath = req.file ? req.file.path : null;
  const directorioDestino = 'public/imagenes/';
  const extension = req.file ? path.extname(req.file.originalname) : '.jpg'; // Establece '.jpg' como extensión predeterminada
  const nuevoNombre = path.join(directorioDestino, `${producto.codigo}${extension}`);

  // Asegurarse de que el directorio existe
  await fs.mkdir(directorioDestino, { recursive: true });

  if (imagenPath) {
    // Mover el archivo al nuevo destino
    try {
        await fs.rename(imagenPath, nuevoNombre);
    } catch (err) {
        // Si falla el rename por razones como estar en diferentes discos, intenta copiar y luego borrar
        await fs.copyFile(imagenPath, nuevoNombre);
        await fs.unlink(imagenPath);
    }
  } else {
    // Si no se proporciona una imagen, usar una imagen por defecto
    const imagenPorDefecto = 'public/default.jpg'; // Ruta a la imagen por defecto
    await fs.copyFile(imagenPorDefecto, nuevoNombre);
  }
  
  return { ...producto, imagen: `/productos/imagenes/${producto.codigo}${extension}` };
}

// Inserta el producto en la base de datos
async function insertarProductoEnDB(producto) {
  const response = await con.crearProducto(producto);
  console.log("producto creado", response);
  return producto;
}




module.exports = {
    getProductos,
    udtProducto,
    crearProducto,
    delProducto,
    
    
}