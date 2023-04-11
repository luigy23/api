const con = require("../mysql.js")
const  io  = require("../routes/socketio");

//inicar caja
async function iniciarCaja(req, res) {
    const {saldoInicial} = req.body;
    console.log(saldoInicial)
    try {
        con.inicializarCaja("Activa",saldoInicial)
        res.status(200).json({
            message: "Caja iniciada"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar caja"
        })
    }
}
module.exports = { iniciarCaja };