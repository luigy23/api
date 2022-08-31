const express = require("express")

const exhbars = require("express-handlebars")

const app = express();
module.exports= app;







///Whatsapp:
/*
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
    if (msg.body == 'ping') {
        msg.reply('pong');
    }

    const contacto = msg.getContact();
    console.log(contacto)
    console.log( "nuevo mensaje"  + ": "+ msg.body)
});

client.initialize();
 */
 