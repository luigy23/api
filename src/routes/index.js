const {Router} = require('express')

const router = Router()
const con = require('../mysql.js')
const pedidos = require('../controllers/pedidos.js')
const mesas = require("../controllers/mesas")
const productos = require('../controllers/productos')
const categorias = require('../controllers/categorias')
const facturas = require('../controllers/facturas')
const caja = require('../controllers/caja')
const movimientos = require('../controllers/movimientos')
const metodosPago = require('../controllers/metodosPago')
const login = require('../controllers/login')
const verficarToken = require('../Middleware/verificarToken')
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


//login
router.post('/login', login.login)
router.post('/registrar', login.registrar)
router.get('/login/verificar', login.verificarLogueo)


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
router.post('/facturas/',verficarToken, facturas.crearFactura)
router.get('/facturas/', facturas.obtenerFacturas)
router.get('/facturas/:id', facturas.obtenerFacturaPorId)

//caja
router.post('/caja',verficarToken, caja.iniciarCaja)
router.get('/caja', caja.traerCaja)

//movimientos
router.get('/movimientos', movimientos.getMovimientos)
router.get('/movimientos/todos', movimientos.getTodosMovimientos)
router.post('/movimientos/filtrados', movimientos.getMovimientosFiltrados)

// Métodos de pago
router.post('/metodosPago', metodosPago.crearMetodoPago);
router.get('/metodosPago', metodosPago.obtenerMetodosPago);
router.get('/metodosPago/:id', metodosPago.obtenerMetodoPagoPorId);
router.put('/metodosPago/:id', metodosPago.actualizarMetodoPago);
router.delete('/metodosPago/:id', metodosPago.eliminarMetodoPago);


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
