const express =
require('express')
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app')
const morgan = require('morgan')
const cors = require('cors')
const errores = require('./manejadorErrores')

const {server} =  require("./routes/socketio")
const path = require('path')

// settings
app.set('port', process.env.PORT || 4000)
app.set('json spaces', 2)
// middlewares

//cookies
 const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(morgan('dev'))
app.use(express.json())
app.use(cors(
  // Permitimos todos los origenes y las cookies de todos los origenes
  {origin: 'https://menur.netlify.app/', credentials: true}
    


))






app.use(express.urlencoded({ extended: false }))
// routes
app.use(require('./routes/index'))
app.use(errores)
app.get('/productos/imagenes/:id', (req, res) => {

  const id = req.params.id
  const ruta = path.join(__dirname,"../public/imagenes/",id+".jpg")
  res.sendFile(ruta);
  
});



app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// iniciar server


server.listen(process.env.PORT || 4000, () => {
  console.log('server port : ' + (process.env.PORT || 4000))
  console.log('DB: ' + (process.env.DB_NAME || "restaurante2"))
})



