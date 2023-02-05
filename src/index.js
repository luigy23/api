const express =
require('express')
const app = require('./app')
const morgan = require('morgan')
const cors = require('cors')


const {server} =  require("./routes/socketio")
const path = require('path')

// settings
app.set('port', process.env.PORT || 4000)
app.set('json spaces', 2)
// middlewares
//app.use(express.static('uploads'));
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
// routes
app.use(require('./routes/index.js'))

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
})



