
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { serialize } = require('cookie');
const con = require('../mysql.js')
const z = require('zod')


//login
async function login(req, res) {

    const { usuario, contraseña } = req.body;
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
        if (user[0].Estado != "Activo") {
            res.status(500).json({
                message: "El usuario esta inactivo"
            })
            return
        }

        //si todo esta bien, creamos el token
        const infoToken = {
            usuario: user[0].Usuario,
            idCargo: user[0].idCargo,
            nombre: user[0].Nombres+" "+user[0].Apellidos,
            

        }
        const token = jwt.sign(infoToken, "hola")
        console.log(token)
    
        res.status(200).json({
            usuario: user[0].Usuario,
            message: "Sesion iniciada",
            token: token,
            nombre: user[0].Nombres+" "+user[0].Apellidos,
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
    try {
        // Desestructurar los datos del cuerpo de la solicitud
        const { nombre, apellido, usuario, contraseña, fechaNacimiento } = req.body;

        // Definir el esquema de validación para los datos
        const schema = z.object({
            nombre: z.string().min(3).max(50)  
            ,

            apellido: z.string().min(3).max(50),
            usuario: z.string().min(3).max(50),
            contraseña: z.string().min(6).max(50),  // Aumentar el mínimo para una contraseña segura
            fechaNacimiento: z.string().min(10).max(10),  // Asegurar el formato de fecha (dd/mm/aaaa)
        });


    




        // Validar los datos recibidos
        const datosValidados = schema.parse({
            nombre,
            apellido,
            usuario,
            contraseña,
            fechaNacimiento,
        });

        // Verificar si el usuario ya existe
        const existingUser = await con.login(datosValidados.usuario);
        if (existingUser.length > 0) {
            return res.status(409).json({
                message: 'El usuario ya existe',
            });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(datosValidados.contraseña, salt);

        // Registrar el usuario en la base de datos
        const registrationResult = await con.registrar({
            Nombres: datosValidados.nombre,
            Apellidos: datosValidados.apellido,
            Usuario: datosValidados.usuario,
            Contraseña: hashedPassword,
            FechaNacimiento: datosValidados.fechaNacimiento,
            idCargo: 1, // Valor por defecto
            Estado: 'Activo', // Valor por defecto
        });

        // Responder con un mensaje de éxito
        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
        });
    } catch (error) {
        // Manejar errores y proporcionar respuestas adecuadas
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al procesar la solicitud',
        });
    }
}


//verificar logueo
async function verificarLogueo(req, res) {




    if (!req.headers.authorization) {
        res.status(500).json({
            message: "No hay token"
        })
        return
    }


    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
        res.status(500).json({
            message: "No hay token"
        })
        return
    }
    try {
        const infoToken = jwt.verify(token, "hola")



        const usuario = infoToken.usuario
        const result = await con.verificarEstadoUsuario(usuario)



        res.status(200).json({
            message: "ok",
            usuario: infoToken.usuario,
            idCargo: infoToken.idCargo,
            nombre: infoToken.nombre,
            result: result[0].estado
        })
    } catch (error) {
        console.log("-----error-----")
        console.log(error)
        console.log("------------------")
        res.status(500).json({
            error: "Token invalido1",
            message: error
        })
        return
    }
}


async function obtenerUsuarios(req, res) {

try {
        //parametro de estado
        const { estado, usuario } = req.params;
    
        //si se envia el parametro de usuario, se obtiene el usuario con ese usuario
        if (usuario != undefined) {
            const user = await con.obtenerUsuario(usuario)
            return res.json(user)
        }
    
        //si no se envia el parametro de estado, se obtienen todos los usuarios
        if (estado == undefined) {
        const usuarios = await con.obtenerUsuarios()
        return res.json(usuarios)
        }
        //si se envia el parametro de estado, se obtienen los usuarios con ese estado
        const usuarios = await con.obtenerUsuarios(estado)
        return res.json(usuarios)
    
} catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al procesar la solicitud',
        });
}
    
}

async function actualizarUsuario(req, res) {
    try {
        // zod schema
        console.log(req.body)
        const schema = z.object({
            nombre: z.string().min(3).max(50).optional(),
            apellido: z.string().min(3).max(50).optional(),
            usuario: z.string().min(3).max(50),
            //en la contraseña si es '' no se actualiza
            contraseña: z.string().min(6).max(50).optional(),
            
            fechaNacimiento: z.string().min(10).max(10).optional(),
            cargo: z.number().min(1).max(3).optional(),
            estado: z.string().min(3).max(50).optional(),
        });
        

        // validar datos, los que no estén presentes no estarán en el objeto datosValidados
        const datosValidados = schema.parse(req.body);

        // verificar si el usuario existe
        const existingUser = await con.login(datosValidados.usuario);
        if (existingUser.length == 0) {
            return res.status(404).json({
                message: 'El usuario no existe',
            });
        }

        // encriptar contraseña
        if (datosValidados.contraseña) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(datosValidados.contraseña, salt);
            datosValidados.contraseña = hashedPassword;
        }


        // actualizar usuario
        const result = await con.actualizarUsuario({
            Nombres: datosValidados.nombre,
            Apellidos: datosValidados.apellido,
            Usuario: datosValidados.usuario,
            Contraseña: datosValidados.contraseña,
            FechaNacimiento: datosValidados.fechaNacimiento,
            idCargo: datosValidados.cargo,
            Estado: "Activo",
        });

        // responder con un mensaje de éxito
        return res.status(200).json({
            message: 'Usuario actualizado exitosamente',
        });
    } catch (error) {
        // manejar errores y proporcionar respuestas adecuadas
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al procesar la solicitud',
        });
    }
}


async function eliminarUsuario(req, res) {
    try {
        const { usuario } = req.params;
      
        const result = await con.cambiarEstadoUsuario(usuario, "Eliminado");
        if (result.affectedRows > 0) {
            return res.status(200).json({
                message: 'Usuario eliminado exitosamente',
            });
        } else {
            return res.status(404).json({
                message: 'Usuario no encontrado',
            });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al procesar la solicitud',
        });
    }
}

module.exports = {
    login,
    registrar,
    verificarLogueo,
    obtenerUsuarios,
    eliminarUsuario,
    actualizarUsuario
    

}