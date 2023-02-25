
const errores = {
    errorDBCategoriaP: {
      status: 500,
      message: 'No puede eliminar la categoria porque tiene productos asociados'
    },
    errorToken: {
      status: 403,
      message: 'No autorizado'
    },
    
  }
  
  const manejadorErrores = (err, req, res, next) => {
    // Si el error es un error de base de datos de categoria con productos
    if (err.errno == 1451) {
      return res.status(errores.errorDBCategoriaP.status).send(errores.errorDBCategoriaP.message);
    }
  
    // Si el error no es el que esperabas, pasalo al siguiente middleware
    next(err);
  }
  
  module.exports = manejadorErrores;