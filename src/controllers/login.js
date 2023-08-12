
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {serialize} = require('cookie');
const con = require('../mysql.js')


//login
async function login(req, res) {

    const { usuario, contraseña } = req.body;
    console.log(req.body)
try {
    //verificamos que hayan ingresado usuario y contraseña
    if (usuario == "" || contraseña == "") {
        res.status(500).json({
            message: "Ingrese usuario y contraseña"
        })
    }

    //verificamos que el usuario exista
    const user = await con.login(usuario)
    if (user.length == 0) {
        res.status(500).json({
            message: "Usuario o contraseña incorrectos"
        })
        return
    }

    //verificamos que la contraseña sea correcta
    const contraseñaCorrecta = await bcrypt.compare(contraseña, user[0].Contraseña)
    if (!contraseñaCorrecta) {
        res.status(500).json({
            message: "Usuario o contraseña incorrectos"
        })
        return
    }

    //verificamos que el usuario este activo
    if (user[0].Estado == "Inactivo") {
        res.status(500).json({
            message: "El usuario esta inactivo"
        })
        return
    }

    //si todo esta bien, creamos el token
    const infoToken = {
        usuario: user[0].Usuario,
        idCargo: user[0].idCargo,
    
    }
    const token = jwt.sign(infoToken, "hola")
    console.log(token)
  // enviamos el token para que el cliente lo guarde en una cookie
    // res.setHeader('Set-Cookie', serialize('token', token, {
    //     httpOnly: false,
    //     maxAge: 60 * 60 * 24 * 7 // 1 week
    //     }))
    res.status(200).json({
        usuario: user[0].Usuario,
        message: "Sesion iniciada",
        token: token
    })
    



} catch (error) {
    console.log(error)
    res.status(500).json({
        message: "Error al iniciar sesion"
    })
}
}

//registrar usuario
async function registrar(req, res) {

    //nombre, apellido, usuario, contraseña, fechaNacimiento, idCargo
    const { nombre, apellido, usuario, contraseña, fechaNacimiento } = req.body;
    //verificar que no exista el usuario
    const user = await con.login(usuario)
    if (user.length > 0) {
        res.status(500).json({
            message: "El usuario ya existe"
        })
        return
    }
    //encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);
    //registrar usuario
    const result = await con.registrar({ Nombres: nombre, Apellidos: apellido, Usuario: usuario, Contraseña: hash, FechaNacimiento: fechaNacimiento, idCargo: 1, Estado: "Activo" })
    res.status(200).json({
        message: "Usuario registrado"
    })

    // usuario.Usuario,
    // usuario.Nombres,
    // usuario.Apellidos,
    // usuario.FechaNacimiento,
    // usuario.idCargo,
    // usuario.Contraseña,
    // usuario.Estado,


}


//verificar logueo
async function verificarLogueo(req, res) {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        res.status(500).json({
            message: "No hay token pana"
        })
        return
    }
    try {
        const infoToken = jwt.verify(token, "hola")
        console.log(infoToken)
        res.status(200).json({
            message: "ok",
            usuario: infoToken.usuario
        })
    } catch (error) {
        res.status(500).json({
            error: "Token invalido"
        })
        return
    }
}



module.exports = {
    login,
    registrar,
    verificarLogueo
}