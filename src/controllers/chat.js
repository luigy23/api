const { enviarMensajeGemini,  ResetChat, ObtenerChat } = require("../IA/Gemini");


const recibirMensaje = async (req, res) => {
    const { mensaje } = req.body;
    enviarMensajeGemini(mensaje).then((respuesta) => {
        console.log("respuesta: ", respuesta);
        res.json("" + respuesta);
        return respuesta;
    }).catch((error) => {
        console.error("error: ", error);
    });
}

const obtenerMensajes = (req, res) => {
    const messages = ObtenerChat();
    res.json(messages);
}

const limpiarMensajes = (req, res) => {
    ResetChat();
    res.json("mensajes limpiados");
}


module.exports = {
    recibirMensaje,
    obtenerMensajes,
    limpiarMensajes
}
