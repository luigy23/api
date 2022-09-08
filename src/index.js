
const express = require("express")
const app = require("./app")
const morgan = require("morgan")
const cors = require('cors')
const cron = require("node-cron")



//settings
app.set("port", process.env.PORT || 4000)
app.set("json spaces", 2)

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:false}))
//routes

app.use(require("./routes/index.js"))

//iniciar server
app.listen(app.get("port"), ()=>{console.log("server port : "+ 4000)});


