const con = require("../mysql.js")
const  io  = require("../routes/socketio.js");

//get movimientos
async function getMovimientos(req, res) {
    try {

        //traer id caja actual (verificar si hay una caja activa)
        const caja = await con.obtenerCajaActiva()
        if (caja.length == 0) {
            res.status(500).json({
                message: "No hay caja activa"
            })
            return
        }
        const idCaja = caja[0].idCaja
        //traer movimientos de la caja actual
        const movimientos = await con.getMovimientos(idCaja)
        res.status(200).json(movimientos)



    } catch (error) {
        res.status(500).json({
            message: "Error al traer movimientos"
        })
    }
}

module.exports = { getMovimientos };