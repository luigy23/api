const {Router} = require('express')
//importamos execFile para ejecutar comandos en la consola
const {execFile} = require('child_process')
const os = require('os');


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
const path = require('path');
const { printText, imprimirTicketComanda } = require('../services/ticket.js');


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
//usuarios
router.get('/usuarios/:estado', login.obtenerUsuarios)
router.get('/usuarios', login.obtenerUsuarios)
router.get('/usuarios/usuario/:usuario', login.obtenerUsuarios)
router.put('/usuarios', login.actualizarUsuario)
router.delete('/usuarios/:usuario', login.eliminarUsuario)


//categorias
router.get('/categorias', categorias.getCategorias)
router.post('/categorias',verficarToken, categorias.crearCategoria)
router.put('/categorias/:id',verficarToken, categorias.cambiarCategoria)
router.delete('/categorias/:id',verficarToken, categorias.delCategoria)

//pedidos
router.post('/pedidos',verficarToken, pedidos.nuevoPedido)
router.get('/pedidos',verficarToken, pedidos.traerPedidos)
router.put('/pedidos',verficarToken, pedidos.añadirProductoPedido)


//productos
router.put('/productos/listo',verficarToken, pedidos.productoListo)
router.put('/productos/cancelado',verficarToken, pedidos.productoCancelado)
router.put('/Estado/Pedido',verficarToken, pedidos.actualizarEstadoPedido)

//mesas
router.get('/mesas',verficarToken, mesas.obtenerMesa)
router.post('/mesas',verficarToken, mesas.crearMesa)
router.get('/mesas/pedido/:idMesa',verficarToken, mesas.pedidoMesa)
router.put('/mesas/estado',verficarToken, mesas.actualizarEstadoMesa)
router.put('/mesas',verficarToken, mesas.actualizarMesa)

//Facturas
router.post('/facturas/',verficarToken, facturas.crearFactura)
router.get('/facturas/',verficarToken, facturas.obtenerFacturas)
router.get('/facturas/:id',verficarToken, facturas.obtenerFacturaPorId)

//caja
router.post('/caja',verficarToken, caja.iniciarCaja)
router.get('/caja',verficarToken, caja.traerCaja)

//movimientos
router.get('/movimientos',verficarToken, movimientos.getMovimientos)
router.get('/movimientos/todos',verficarToken, movimientos.getTodosMovimientos)
router.post('/movimientos/filtrados',verficarToken, movimientos.getMovimientosFiltrados)

// Métodos de pago
router.post('/metodosPago',verficarToken, metodosPago.crearMetodoPago);
router.get('/metodosPago',verficarToken, metodosPago.obtenerMetodosPago);
router.get('/metodosPago/:id',verficarToken, metodosPago.obtenerMetodoPagoPorId);
router.put('/metodosPago/:id',verficarToken, metodosPago.actualizarMetodoPago);
router.delete('/metodosPago/:id',verficarToken, metodosPago.eliminarMetodoPago);


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
  imprimirTicketComanda(1, "Usuario", [{nombre:"Producto", cantidad:1, precio:1}], 1)
  
  })

 router.get('/imprimir', async (req, res) => {
  //el archivo está la raiz del proyecto
  const archivo = path.join(__dirname, '../../','imprimir.ps1')
  //ejecutamos el archivo
  execFile('powershell.exe', [archivo], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando PS script: ${error}`);
      return;
    }
    
    console.log(`Salida script PS: ${stdout}`);
  });



 
res.json(archivo)
  
  })

module.exports = router
