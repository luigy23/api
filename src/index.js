
const express = require("express")
const app = require("./app")
const morgan = require("morgan")
const cors = require("cors")



const http = require('http');
const server = http.createServer(app);
const socketIO = require("socket.io")
const io =  socketIO(server, {
    cors: {
      origin: "*"
    }
  });



//settings
app.set("port", process.env.PORT || 3636)
app.set("json spaces", 2)
//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:false}))
//routes

app.use(require("./routes/index.js"))

//iniciar server
server.listen(process.env.PORT || 3636, ()=>{
    console.log("server port : "+ process.env.PORT || 3636)


      

});


//iniciar scoket del server
io.on('connection', (socket) => {
    console.log('a user connected'+ socket.id);
  });