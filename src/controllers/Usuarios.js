const con = require("../mysql.js")
const  io  = require("../routes/socketio.js");
//importamos zod para validar los datos
const z = require("zod")
const bcrypt = require("bcrypt")


async function obtenerUsuarios(req, res) {

    const usuarios = await con.obtenerUsuarios('Activo')
    res.json(usuarios)
}

module.exports = { obtenerUsuarios }