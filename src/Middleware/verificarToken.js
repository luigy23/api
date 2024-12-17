const jwt = require("jsonwebtoken")
con = require("../mysql.js")
//middleware para verificar el token




const verificarToken = async (req, res, next) => {
    try {
        // Set CORS headers
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: "No se proporcionó token de autorización"
            });
        }

        // Extract token
        const authHeader = req.headers.authorization;
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        // Validate token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado"
            });
        }

        // Verify token
        const infoToken = jwt.verify(token, "hola");
        
        // Validate token payload
        if (!infoToken || !infoToken.usuario) {
            return res.status(401).json({
                success: false,
                message: "Token inválido o mal formado"
            });
        }

        // Verify user status
        const result = await con.verificarEstadoUsuario(infoToken.usuario);
        
        if (!result || !result.length) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (result[0].Estado !== "Activo") {
            return res.status(403).json({
                success: false,
                message: "Usuario no activo"
            });
        }

        // Add user info to request for downstream middleware/routes
        req.user = infoToken;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Token inválido"
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expirado"
            });
        }
        
        // Log server errors but don't expose details to client
        console.error('Error en verificación de token:', error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
};

//exportamos para poder usarlo en otros archivos
module.exports = verificarToken;