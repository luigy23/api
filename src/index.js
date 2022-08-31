
const express = require("express")
const app = require("./app")
const morgan = require("morgan")
const cors = require('cors')
const cron = require("node-cron")

cron.schedule("30 23 * * *",()=>{
    console.log("tarea a las 9:8")
    fotobyte()
})

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



/*

//whatsapp
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});
 

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});



client.on('message', msg => {
    if (msg.body == '!hola' || msg.body == '!hey' ||msg.body == '!hola') {
        fotobyte2()
        msg.reply('Bienvenido, para hacer tu pedido ir click en : http://192.168.1.3:3000');
    }
    if(msg.from=="5732092966004@c.us"){
        msg.reply(msg.body)

    }

    const contacto = msg.getContact();
    console.log(contacto)
    console.log( msg.from  + ": "+ msg.body)
});

//573209296004

const fotobyte= (Melisa="573209296004@c.us") =>{
    client.sendMessage(Melisa,"-Melisa manda un tetaByte   🤖")
    client.sendMessage(Melisa,"-xfa   🤖")
    client.sendMessage(Melisa,"-Dice mi creador que eres mu sexy  🤖")
    client.sendMessage(Melisa,"-Fin del comunicado Bye World  🤖")

    
}
const fotobyte2= (Luigy="573193896000@c.us") =>{
    client.sendMessage(Luigy,"Mensaje automatico   🤖")


    
}

client.initialize();
 
 */