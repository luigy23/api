const { Router, json } = require('express')
const fs = require("fs")
const router = Router()
const con = require('../mysql.js')
const pedidos = require('../controllers/pedidos.js')
const mesas = require("../controllers/mesas")
const productos = require('../controllers/productos')

const multer  = require('multer')
const upload = multer({ dest: 'public/imagenes' })

const {io} = require('./socketio')
const path = require('path')


router.get('/productos',productos.getProductos)
router.put('/productos', upload.single('imagen'),productos.udtProducto)
router.post('/productos', upload.single('imagen'), productos.crearProducto)



router.get('/', (req, res) => {
  res.json({ title: 'servidor actualizado #1' })
})

router.get('/test', async (req, res) => {


//const respuesta = await con.test()
const ruta = path.join(__dirname,"../")
res.json(ruta)

})



router.post('/nuevo/pedido', pedidos.nuevoPedido)

router.get('/pedidos', pedidos.traerPedidos)


router.put('/ProductoListo', pedidos.productoListo)
router.put('/ProductoCancelado', pedidos.productoCancelado)
router.put('/Estado/Pedido', pedidos.actualizarEstadoPedido)

router.get('/mesas', mesas.obtenerMesa)

router.get('/reset', async (req, res) => {


  con.restablecer()
  res.json("Restablecido")
  
  })
router.get('/sockets', async (req, res) =>{
  const sockets = await io.fetchSockets().then((socket)=>{
    res.json("Sockets:"+ socket.length)
  })
  //console.log("usuarios conectados: ", sockets.length)


})

module.exports = router
