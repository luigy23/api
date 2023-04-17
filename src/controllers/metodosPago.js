const con = require("../mysql.js")

async function crearMetodoPago(req, res) {
    try {
      const { Nombre, Descripcion, Estado } = req.body;
      const result = await con.crearMetodoPago(Nombre, Descripcion, Estado);
      res.status(201).json({ 
        message: 'Método de pago creado',
        idMetodoPago: result
      });
    } catch (error) {
      console.error('Error en crearMetodoPago ->', error);
      res.status(500).json({ message: 'Error al crear método de pago' });
    }
  }
  async function obtenerMetodosPago(req, res) {
    try {
      const result = await con.obtenerMetodosPago();
      res.status(200).json({ metodos_pago: result });
    } catch (error) {
      console.error('Error en obtenerMetodosPago ->', error);
      res.status(500).json({ message: 'Error al obtener métodos de pago' });
    }
  }

  async function obtenerMetodoPagoPorId(req, res) {
    try {
      const result = await con.obtenerMetodoPagoPorId(req.params.id);
      if (!result) return res.status(404).json({ message: 'Método de pago no encontrado' });
      res.status(200).json({ metodo_pago: result });
    } catch (error) {
      console.error('Error en obtenerMetodoPagoPorId ->', error);
      res.status(500).json({ message: 'Error al obtener método de pago' });
    }
  }

  async function actualizarMetodoPago(req, res) {
    try {
      const { Nombre, Descripcion, Estado } = req.body;
      const result = await con.actualizarMetodoPago(req.params.id, Nombre, Descripcion, Estado);
      if (!result) return res.status(404).json({ message: 'Método de pago no encontrado' });
      res.status(200).json({ message: 'Método de pago actualizado' });
    } catch (error) {
      console.error('Error en actualizarMetodoPago ->', error);
      res.status(500).json({ message: 'Error al actualizar método de pago' });
    }
  }


  async function eliminarMetodoPago(req, res) {
    try {
      const result = await con.eliminarMetodoPago(req.params.id);
      if (!result) return res.status(404).json({ message: 'Método de pago no encontrado' });
      res.status(200).json({ message: 'Método de pago eliminado' });
    } catch (error) {
      console.error('Error en eliminarMetodoPago ->', error);
      res.status(500).json({ message: 'Error al eliminar método de pago' });
    }
  }

  //expotacion
    module.exports = {
        crearMetodoPago,
        obtenerMetodosPago,
        obtenerMetodoPagoPorId,
        actualizarMetodoPago,
        eliminarMetodoPago
    }