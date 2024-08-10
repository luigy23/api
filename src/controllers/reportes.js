const con = require("../mysql.js")
const  io  = require("../routes/socketio.js");


async function obtenerVentas(req, res) {

    const fechas = req.body 
    try {
        const totalPedidos = await con.obtenerVentas(fechas);

            console.log(totalPedidos)

        res.status(200).json(totalPedidos[0])
    } catch (error) {
        res.status(500).json({
            message: "Error al traer total de ventas "+error
        })
    }
    
}


async function obtenerVentasMesero(req, res) {
    
        const fechas = req.body 
        try {
            const totalPedidos = await con.obtenerVentasMeseros(fechas);
    
                console.log(totalPedidos)
    
            res.status(200).json(totalPedidos)
        } catch (error) {
            res.status(500).json({
                message: "Error al traer total de ventas "+error
            })
        }
    
}
module.exports = {
    obtenerVentas,
    obtenerVentasMesero

}