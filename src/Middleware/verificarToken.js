const jwt = require("jsonwebtoken")

//middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.cookies.token
    //console.log(req.cookies)
    if (!token) {
        res.status(500).json({
            message: "No hay token"
        })
        return
    }
    try {
        const infoToken = jwt.verify(token, "hola")
        //console.log(infoToken)
    } catch (error) {
        res.status(500).json({
            error: "Token invalido"
        })
        return
    }
    next()
}

//exportamos para poder usarlo en otros archivos
module.exports = verificarToken;