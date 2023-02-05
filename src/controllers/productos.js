const con = require("../mysql.js");
const  io  = require("../routes/socketio");
const fs = require("fs")


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


async function crearProducto (req, res) {
    const producto =JSON.parse(req.body.producto)
  
    if (req.file){
      const imagenPath = req.file.path
      const nombre = producto.codigo
      const nuevoNombre = 'public/imagenes/'+nombre+'.jpg'
      const productoConImagen = {...producto, imagen:`/productos/imagenes/${nombre}`}
      await fs.rename(imagenPath,nuevoNombre,(err) => err && console.error(err))
      await con.crearProducto(productoConImagen)
      res.json(productoConImagen)
      
    }else{
      res.json("Envia una imagen")
      const  response  =await con.crearProducto(producto)
      
      console.log("producto creado", response)
    }
    io.actualizarProductos()
  }



module.exports = {
    getProductos,
    udtProducto,
    crearProducto
}