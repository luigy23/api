const con = require("../mysql.js")
const  io  = require("../routes/socketio.js");


async function obtenerVentas(req, res) {
    try {
        const {fechaInicio, fechaFin} = req.body 

        // Convertir a objetos Date
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);

        // Ajustar a la zona horaria local y convertir a formato YYYY-MM-DD
        const fechas = {
            fechaInicio: fechaInicioDate.toLocaleDateString('en-CA'),
            fechaFin: fechaFinDate.toLocaleDateString('en-CA')
        };
        
   
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
    
        const {fechaInicio, fechaFin} = req.body 
  

        // Convertir a objetos Date
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
    
        // Ajustar a la zona horaria local y convertir a formato YYYY-MM-DD
        const fechas = {
            fechaInicio: fechaInicioDate.toLocaleDateString('en-CA'),
            fechaFin: fechaFinDate.toLocaleDateString('en-CA')
        };
    
        console.log(fechas);

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

async function obtenerVentasTipoPago(req, res) {
    try {
        const {fechaInicio, fechaFin, tipoPago} = req.body

        // Convertir a objetos Date
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);

        // Ajustar a la zona horaria local y convertir a formato YYYY-MM-DD
        const fechas = {
            fechaInicio: fechaInicioDate.toLocaleDateString('en-CA'),
            fechaFin: fechaFinDate.toLocaleDateString('en-CA')
        };
        
   
        const totalPedidos = await con.obtenerVentasTipoPago(fechas, tipoPago);

            console.log(totalPedidos)

        res.status(200).json(totalPedidos[0])
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