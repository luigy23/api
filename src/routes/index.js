const { Router } = require('Express')
const router = Router()
const con = require('../mysql.js')
const pedidos = require('../controllers/pedidos.js')
const productos = require('../productos.json')
const {io} = require('./socketio')
router.get('/', (req, res) => {
  res.json({ title: 'hola qtal' })
})

router.get('/test', async (req, res) => {
const mesa = await con.actualizarEstadoMesa(req.query.id, req.query.estado)
res.json(mesa)
})

router.get('/productos', (req, res) => {
  res.json(productos)
})

router.post('/productos', (req, res) => {
  //console.log(req.body)
  productos.push(req.body)
})

router.post('/nuevo/pedido', async (req, res) =>{
 
  pedidos.nuevoPedido(req.body).then((respuesta)=>{
    if (respuesta ===1) io.in("meseros").emit("actualizado", true);
    else console.log("hubo un error=>>>>>", respuesta)
  })
  
  
})

router.get('/pedidos', async function (req, res) {
  const lista = await pedidos.traerPedidos(req.query.id,"Pendiente")
  res.json(lista)
})

router.post('/ProductoListo', function(req, res){
  const {idPedido, codProducto} = req.body
  pedidos.productoListo(idPedido,codProducto).then(
    ()=>{io.in("meseros").emit("actualizado", true)}
    )

 
})

router.post('/ProductoCancelado', function(req, res){
  const {idPedido, codProducto} = req.body
  pedidos.productoCancelado(idPedido,codProducto)
  //console.log(req.body)
  io.in("meseros").emit("actualizado", true);
})
router.get('/Estado/Pedido', async function(req, res){
 
 pedidos.actualizarEstadoPedido()


 res.json("hola")
  //console.log(req.body)
 
})

router.get('/sockets', async (req, res) =>{
  const sockets = await io.fetchSockets().then((socket)=>{
    res.json("Sockets:"+ socket.length)
  })
  //console.log("usuarios conectados: ", sockets.length)


})

module.exports = router
