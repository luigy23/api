const { Router } = require('express')
const router = Router()
const con = require('../mysql.js')
const pedidos = require('../controllers/pedidos.js')
const mesas = require("../controllers/mesas")
const productos = require('../productos.json')
const {io} = require('./socketio')
router.get('/', (req, res) => {
  res.json({ title: 'hola qtal' })
})

router.get('/test', async (req, res) => {
//const mesa = await con.actualizarEstadoMesa(req.query.id, req.query.estado)
//res.json(mesa)

const respuesta = await con.test()
res.json("hola")

})

router.get('/productos', (req, res) => {
  res.json(productos)
})

router.post('/productos', (req, res) => {
  //console.log(req.body)
  productos.push(req.body)
})

router.post('/nuevo/pedido', pedidos.nuevoPedido)

router.get('/pedidos', pedidos.traerPedidos)


router.put('/ProductoListo', pedidos.productoListo)
router.put('/ProductoCancelado', pedidos.productoCancelado)
router.put('/Estado/Pedido', pedidos.actualizarEstadoPedido)

router.get('/mesas', mesas.obtenerMesa)


router.get('/sockets', async (req, res) =>{
  const sockets = await io.fetchSockets().then((socket)=>{
    res.json("Sockets:"+ socket.length)
  })
  //console.log("usuarios conectados: ", sockets.length)


})

module.exports = router
