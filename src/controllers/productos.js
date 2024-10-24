const con = require("../mysql.js");
const io = require("../routes/socketio");
const fs = require('fs').promises;
const path = require('path');

// Configuración centralizada
const CONFIG = {
  DIRECTORIO_IMAGENES: 'public/imagenes/',
  IMAGEN_DEFAULT: 'public/default.jpg',
  EXTENSIONES_PERMITIDAS: {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
  }
};

// Funciones auxiliares
const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message || 'Error interno del servidor' });
};

const validarProducto = (producto) => {
  const camposRequeridos = ['codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'stock'];
  const camposFaltantes = camposRequeridos.filter(campo => !producto[campo]);
  
  if (camposFaltantes.length > 0) {
    throw new Error(`Faltan los siguientes campos: ${camposFaltantes.join(', ')}`);
  }
  
  return {
    ...producto,
    estado: producto.estado || 'Disponible',
    precio: Number(producto.precio),
    stock: Number(producto.stock)
  };
};

// Funciones principales manteniendo los mismos nombres
async function getProductos(req, res) {
  try {
    const productos = await con.getProductos();
    res.json(productos);
  } catch (error) {
    handleError(res, error);
  }
}

async function udtProducto(req, res) {
  try {
    let producto = typeof req.body.producto === 'string' 
      ? JSON.parse(req.body.producto)
      : req.body.producto;

    if (req.file) {
      const imagenPath = req.file.path;
      const extension = CONFIG.EXTENSIONES_PERMITIDAS[req.file.mimetype] || '.jpg';
      const nuevoNombre = path.join(CONFIG.DIRECTORIO_IMAGENES, `${producto.codigo}${extension}`);
      
      // Asegurar que el directorio existe
      await fs.mkdir(CONFIG.DIRECTORIO_IMAGENES, { recursive: true });

      try {
        await fs.rename(imagenPath, nuevoNombre);
      } catch (err) {
        await fs.copyFile(imagenPath, nuevoNombre);
        await fs.unlink(imagenPath);
      }

      producto = {
        ...producto,
        imagen: `/productos/imagenes/${producto.codigo}${extension}`
      };

      await con.udtProducto(producto);
      res.json(producto);
    } else {
      const response = await con.udtProducto(producto);
      res.json(response);
    }

    io.actualizarProductos();
  } catch (error) {
    handleError(res, error);
  }
}

async function crearProducto(req, res) {
  try {
    let producto = typeof req.body.producto === 'string' 
      ? JSON.parse(req.body.producto)
      : req.body.producto;

    // Validar y preparar el producto
    producto = validarProducto(producto);

    // Manejar la imagen
    if (req.file) {
      const extension = CONFIG.EXTENSIONES_PERMITIDAS[req.file.mimetype] || '.jpg';
      const nuevoNombre = path.join(CONFIG.DIRECTORIO_IMAGENES, `${producto.codigo}${extension}`);
      
      await fs.mkdir(CONFIG.DIRECTORIO_IMAGENES, { recursive: true });

      try {
        await fs.rename(req.file.path, nuevoNombre);
      } catch (err) {
        await fs.copyFile(req.file.path, nuevoNombre);
        await fs.unlink(req.file.path);
      }

      producto.imagen = `/productos/imagenes/${producto.codigo}${extension}`;
    } else {
      // Copiar imagen por defecto si no se proporciona una
      const extension = '.jpg';
      const nuevoNombre = path.join(CONFIG.DIRECTORIO_IMAGENES, `${producto.codigo}${extension}`);
      await fs.copyFile(CONFIG.IMAGEN_DEFAULT, nuevoNombre);
      producto.imagen = `/productos/imagenes/${producto.codigo}${extension}`;
    }

    // Insertar en la base de datos
    await con.crearProducto(producto);
    res.json(producto);
    io.actualizarProductos();
  } catch (error) {
    handleError(res, error);
  }
}

async function delProducto(req, res) {
  try {
    const { id } = req.params;
    
    // Intentar obtener el producto antes de eliminarlo para conseguir la ruta de la imagen
    const producto = await con.getProductoById(id);
    
    if (producto && producto.imagen) {
      // Intentar eliminar la imagen si existe
      const rutaImagen = path.join('public', producto.imagen);
      await fs.unlink(rutaImagen).catch(err => console.error('Error al eliminar imagen:', err));
    }

    const response = await con.delProducto(id);
    res.json(response);
    io.actualizarProductos();
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  getProductos,
  udtProducto,
  crearProducto,
  delProducto
};