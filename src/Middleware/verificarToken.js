const jwt = require("jsonwebtoken")
con = require("../mysql.js")
//middleware para verificar el token
const verificarToken = (req, res, next) => {
    // permitimos cors
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")




    // sacamos el token de la cabecera Authorization (Bearer <token>)
    const token = req.headers.authorization.split(" ")[1]
    console.log("este es el token: "+token)
    if (!token) {
        res.status(500).json({
            message: "No hay token para verificar"
        })
        return
    }
    try {
        const infoToken = jwt.verify(token, "hola") 
        //verificamos que el usuario este activo
        const usuario = infoToken.usuario
        const result = con.verificarEstadoUsuario(usuario)
        if (result[0]!= "Activo") {
            res.status(500).json({
                message: "Usuario no activo"
            })
            return
        }





        console.log(infoToken)
    } catch (error) {
        res.status(500).json({
            error: "Token invalido",
            result: result[0]
        })
        return
    }
    next()
}

//exportamos para poder usarlo en otros archivos
module.exports = verificarToken;