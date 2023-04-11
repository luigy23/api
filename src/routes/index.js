const {Router} = require('express')

const router = Router()
const con = require('../mysql.js')
const pedidos = require('../controllers/pedidos.js')
const mesas = require("../controllers/mesas")
const productos = require('../controllers/productos')
const categorias = require('../controllers/categorias')
const facturas = require('../controllers/facturas')
const caja = require('../controllers/caja')

const multer  = require('multer')
const upload = multer({ dest: 'public/imagenes' })

const {io} = require('./socketio')
const path = require('path')


router.get('/productos',productos.getProductos)
router.put('/productos', upload.single('imagen'),productos.udtProducto)
router.post('/productos', upload.single('imagen'), productos.crearProducto)
router.delete('/productos/:id', productos.delProducto)


router.get('/', (req, res) => {
  //devuelve un json con las rutas disponibles:
  res.json({
    "categorias": "/categorias",
    "pedidos": "/pedidos",
    "productos": "/productos",
    "mesas": "/mesas",
    "reset": "/reset",
    "test": "/test",
    "sockets": "/sockets"
})})


//categorias
router.get('/categorias', categorias.getCategorias)
router.post('/categorias', categorias.crearCategoria)
router.put('/categorias/:id', categorias.cambiarCategoria)
router.delete('/categorias/:id', categorias.delCategoria)

//pedidos
router.post('/pedidos', pedidos.nuevoPedido)
router.get('/pedidos', pedidos.traerPedidos)
router.put('/pedidos', pedidos.añadirProductoPedido)


//productos
router.put('/productos/listo', pedidos.productoListo)
router.put('/productos/cancelado', pedidos.productoCancelado)
router.put('/Estado/Pedido', pedidos.actualizarEstadoPedido)

//mesas
router.get('/mesas', mesas.obtenerMesa)
router.post('/mesas', mesas.crearMesa)
router.get('/mesas/pedido/:idMesa', mesas.pedidoMesa)

//Facturas
router.post('/facturas/', facturas.crearFactura)

//caja
router.post('/caja', caja.iniciarCaja)

//otros
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
router.get('/test', async (req, res) => {
  res.json("test")
  
  })

module.exports = router
