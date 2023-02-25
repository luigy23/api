//será el controlador de la ruta /categorias
//

const con = require('../mysql.js')

function getCategorias(req, res) {
con.traerCategoria().then((categorias) => {
res.json(categorias)
})
}

function crearCategoria(req, res) {
const { Nombre,Descripcion } = req.body
con.crearCategoria(Nombre,Descripcion).then((categoria) => {
res.json(categoria)
})


}

function cambiarCategoria(req, res) {
console.log(req.body)
const { id } = req.params
const { Nombre } = req.body
console.log("actualizando categoria: ",id, Nombre)
con.cambiarCategoria(id, Nombre).then((categoria) => {
res.json(categoria)
})
}
function delCategoria(req, res, next) {
    const { id } = req.params
    con.delCategoria(id)
      .then((categoria) => {
        res.json(categoria)
      })
      .catch(err => {
        next(err);
      });
  }

module.exports = { getCategorias , crearCategoria, cambiarCategoria, delCategoria }