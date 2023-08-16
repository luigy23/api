const con = require("../mysql.js")


//inicar caja
async function iniciarCaja(req, res) {



    //verificamos que hayan enviado informacion en el body
    if (req.body == "") {
        res.status(500).json({
            message: "Ingrese saldo inicial"
        })
        return
    }

    const {saldoInicial} = req.body;
    //filtro de saldo, que sea un numero valido
    if (saldoInicial == "" || isNaN(saldoInicial)) {
        res.status(500).json({
            message: "Ingrese saldo inicial valido"
        })
        return
    }







    console.log(saldoInicial)
    try {
        con.inicializarCaja("Activa",saldoInicial)
        res.status(200).json({
            message: "Caja iniciada"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar caja",
            error: error
        })
    }
}

//taer caja
async function traerCaja(req, res) {
    try {
        const caja = await con.obtenerCajaActiva()
        res.status(200).json(caja)
    } catch (error) {
        res.status(500).json({
            message: "Error al traer caja"
        })
    }
}




module.exports = { iniciarCaja, traerCaja };