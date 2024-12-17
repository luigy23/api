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
  // Permitimos todos los origenes y las cookies de todos los origenes y con cookies
  {origin: '*', credentials: true}
    


))





//app.use(cors())
app.use(express.urlencoded({ extended: false }))
// routes
app.use(require('./routes/index'))
app.use(errores)
app.get('/productos/imagenes/:id', (req, res) => {
  const id = req.params.id;
  const allowedExtensions = ['.jpg', '.png', '.webp'];
  let imagenNombre;

  // Verifica si el id tiene una de las extensiones permitidas
  for (const ext of allowedExtensions) {
    if (id.endsWith(ext)) {
      imagenNombre = id;
      break;
    }
  }

  // Si no tiene una extensión permitida, agrega .jpg por defecto
  if (!imagenNombre) {
    imagenNombre = `${id}.jpg`;
  }

  const ruta = path.join(__dirname, "../public/imagenes/", imagenNombre);
  
  // Enviar archivo o manejar error si el archivo no existe
  res.sendFile(ruta, (err) => {
    if (err) {
      console.log(err); // Imprime el error para depuración
      res.status(404).send('No se encontró la imagen solicitada');
    }
  });
});




app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// iniciar server


server.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  console.log('server port : ' + (process.env.PORT || 4000))
  console.log('DB: ' + (process.env.DB_NAME || "restaurante2"))
})



