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

//get todos los movimientos
async function getTodosMovimientos(req, res) {
    try {
        const movimientos = await con.getTodosMovimientos()
        res.status(200).json(movimientos)
    } catch (error) {
        res.status(500).json({
            message: "Error al traer movimientos"
        })
    }
}

// vamos a agregar los filtros de fecha y tipo de movimiento
async function getMovimientosFiltrados(req, res) {
    //obtener los filtros
    const { fechaInicio, fechaFin } = req.body

    const tipoMovimiento = "Ingreso"

        // validar que los filtros no esten vacios
        if (fechaInicio == "" || fechaFin == "" || tipoMovimiento == "") {
            res.status(500).json({
                message: "Faltan datos"
            })
            return
        }

    //mostramos en consoloa el body
    console.log(req.body)

    //convertimos las fechas de string a date y le sumamos un dia a la fecha fin
    const fechaInicioDate = new Date(fechaInicio)
    const fechaFinDate = new Date(fechaFin)


      // Ajustar a la zona horaria local y convertir a formato YYYY-MM-DD
      
        const fechaI = fechaInicioDate.toLocaleDateString('en-CA')
         const fechaF = fechaFinDate.toLocaleDateString('en-CA')
      


    
    



    // hacer la consulta
    try {
        const movimientos = await con.getMovimientosFiltrados(fechaI, fechaF, tipoMovimiento)
        res.status(200).json(movimientos)
    }
    catch (error) {
        res.status(500).json({
            message: "Error al traer movimientos"
        })
    }
}




module.exports = { getMovimientos, getTodosMovimientos, getMovimientosFiltrados };