const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer');
const path = require('path');

// Clase de configuración de impresora
class ConfiguracionImpresora {
  constructor(nombre, interfaz) {
    this.impresora = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `//localhost/${interfaz}`,
      characterSet: CharacterSet.PC858_EURO,
    });
    this.nombre = nombre;
  }

  async estaConectada() {
    try {
      return await this.impresora.isPrinterConnected();
    } catch (error) {
      console.error(`Error verificando conexión de impresora ${this.nombre}:`, error);
      return false;
    }
  }
}

// Clase de servicio de impresión
class ServicioImpresion {
  constructor() {
    this.impresoras = {
      cocina: new ConfiguracionImpresora('Cocina', 'POS-COCINA'),
      bebidas: new ConfiguracionImpresora('Bebidas', 'POS-BEBIDAS'),
      caja: new ConfiguracionImpresora('Caja', 'XP-80Caja'),
    };
    this.logo = path.join(__dirname, '200.png');
  }

  static normalizarTexto(texto) {
    return texto?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
  }

  async verificarConexionesImpresoras() {
    const conexiones = await Promise.all(
      Object.entries(this.impresoras).map(async ([clave, impresora]) => {
        const conectada = await impresora.estaConectada();
        return { [clave]: conectada };
      })
    );

    const impresorasDesconectadas = conexiones
      .filter(conexion => !Object.values(conexion)[0])
      .map(conexion => Object.keys(conexion)[0]);

    if (impresorasDesconectadas.length > 0) {
      throw new Error(`Impresoras desconectadas: ${impresorasDesconectadas.join(', ')}`);
    }
  }

  async imprimirLogo(instanciaImpresora) {
    try {
      await instanciaImpresora.impresora.printImage(this.logo);
      instanciaImpresora.impresora.newLine();
    } catch (error) {
      throw new Error(`Error al imprimir logo: ${error.message}`);
    }
  }

  imprimirEncabezado(instanciaImpresora, { numeroMesa, mesero }) {
    const impresora = instanciaImpresora.impresora;
    impresora.alignCenter();
    impresora.print(`Mesa: ${numeroMesa}  |`);
    impresora.println(`Mesero: ${ServicioImpresion.normalizarTexto(mesero)}`);
    impresora.drawLine();
  }

  imprimirProducto(instanciaImpresora, producto) {
    const impresora = instanciaImpresora.impresora;
    impresora.alignLeft();
    impresora.setTextSize(1, 1);
    impresora.bold(true);
    impresora.println(`${producto.cantidad}x ${ServicioImpresion.normalizarTexto(producto.nombre)}`);
    impresora.bold(false);
    impresora.setTextSize(0, 0);

    if (producto.comentario) {
      impresora.setTextSize(0, 1);
      impresora.println(`  Nota: ${ServicioImpresion.normalizarTexto(producto.comentario)}`);
      impresora.setTextSize(0, 0);
    }
    impresora.newLine();
  }

  async imprimirComanda(pedido) {
    try {
      const { MesaDescripcion, Mesero, Productos } = pedido;

      if (!MesaDescripcion || !Mesero || !Productos) {
        throw new Error('Faltan datos requeridos del pedido');
      }

      await this.verificarConexionesImpresoras();

      const bebidas = Productos.filter(producto => producto.idCategoria === 4);
      const otrosProductos = Productos.filter(producto => producto.idCategoria !== 4 && producto.idCategoria !== 30);

      // Imprimir ticket de bebidas
      if (bebidas.length > 0) {
        await this.imprimirTicketBebidas(bebidas, { numeroMesa: MesaDescripcion, mesero: Mesero });
      }

      // Imprimir ticket de cocina
      if (otrosProductos.length > 0) {
        await this.imprimirTicketCocina(otrosProductos, { numeroMesa: MesaDescripcion, mesero: Mesero });
      }

      console.log('Pedido impreso exitosamente:', pedido);
      return { exito: true };

    } catch (error) {
      console.error('Error al imprimir comanda:', error);
      return { error: error.message };
    }
  }

  async imprimirTicketBebidas(bebidas, infoPedido) {
    const impresora = this.impresoras.bebidas;
    await this.imprimirLogo(impresora);
    this.imprimirEncabezado(impresora, infoPedido);
    
    bebidas.forEach(producto => this.imprimirProducto(impresora, producto));
    
    impresora.impresora.drawLine();
    impresora.impresora.cut();
    await impresora.impresora.execute();
    impresora.impresora.beep();
    impresora.impresora.clear();
  }

  async imprimirTicketCocina(productos, infoPedido) {
    const impresora = this.impresoras.cocina;
    await this.imprimirLogo(impresora);
    this.imprimirEncabezado(impresora, infoPedido);
    
    productos.forEach(producto => this.imprimirProducto(impresora, producto));
    
    impresora.impresora.drawLine();
    impresora.impresora.cut();
    await impresora.impresora.execute();
    impresora.impresora.beep();
    impresora.impresora.clear();
  }

  async imprimirCuentaMesero(datosPedido) {
    try {
      const { mesa, Mesero, productos, idPedido } = datosPedido;
      const impresora = this.impresoras.caja.impresora;

      await this.imprimirLogo(this.impresoras.caja);
      this.imprimirEncabezadoCuenta(impresora, { mesa, Mesero, idPedido });
      this.imprimirTablaProductos(impresora, productos);
      this.imprimirTotales(impresora, productos);
      this.imprimirPiePagina(impresora);

      impresora.cut();
      await impresora.execute();
      impresora.clear();

      return { exito: true };
    } catch (error) {
      console.error('Error al imprimir cuenta del mesero:', error);
      return { error: error.message };
    }
  }

  imprimirEncabezadoCuenta(impresora, { mesa, Mesero, idPedido }) {
    const nombreMesero = Mesero.nombre || Mesero.user;

    impresora.alignCenter();
    impresora.bold(true);
    impresora.println(`Pedido # ${idPedido}`);
    impresora.bold(false);
    impresora.drawLine();
    impresora.newLine();
    impresora.print(`Mesa: ${mesa} | `);
    impresora.println(`Mesero: ${nombreMesero}`);
    impresora.newLine();
    impresora.drawLine();
  }

  imprimirTablaProductos(impresora, productos) {
    impresora.tableCustom([
      { text: 'Descripción', align: 'LEFT', width: 0.5, bold: true },
      { text: 'Cant', align: 'CENTER', width: 0.25, bold: true },
      { text: 'Precio', align: 'RIGHT', cols: 8, bold: true }
    ]);
    impresora.drawLine();
    impresora.newLine();

    productos
      .filter(producto => producto.Estado !== 'Cancelado')
      .forEach(producto => {
        impresora.tableCustom([
          { text: '*' + producto.Nombre, align: 'LEFT', width: 0.5 },
          { text: producto.Cantidad.toString(), align: 'CENTER', width: 0.25 },
          { text: `$${producto.Precio}`, align: 'RIGHT', cols: 8 }
        ]);
        impresora.drawLine();
      });
  }

  imprimirTotales(impresora, productos) {
    const total = productos
      .filter(producto => ['Listo', 'Pendiente'].includes(producto.Estado))
      .reduce((suma, producto) => suma + (producto.Precio * producto.Cantidad), 0);

    const propina = total * 0.10;
    const totalConPropina = Math.floor(total * 1.10);

    impresora.alignRight();
    impresora.bold(true);
    impresora.println(`Total: $${total}`);
    impresora.bold(false);
    impresora.println(`Propina voluntaria (10%): $${propina.toFixed(2)}`);
    impresora.println(`Subtotal: $${totalConPropina}`);
  }

  imprimirPiePagina(impresora) {
    const ahora = new Date();
    impresora.alignLeft();
    impresora.println(`Fecha: ${ahora.toLocaleDateString()}`);
    impresora.println(`Hora: ${ahora.toLocaleTimeString()}`);
    impresora.newLine();
    impresora.println('Este ticket no es válido como factura electrónica');
  }

  async imprimirPrueba() {
    try {
      await this.verificarConexionesImpresoras();
      
      const impresoras = Object.values(this.impresoras);
      await Promise.all(impresoras.map(impresora => this.imprimirTicketPrueba(impresora)));
      
      return { exito: true, mensaje: 'Impresiones de prueba completadas exitosamente' };
    } catch (error) {
      console.error('Error en impresión de prueba:', error);
      return { error: error.message };
    }
  }

  async imprimirTicketPrueba(configuracionImpresora) {
    const impresora = configuracionImpresora.impresora;
    const ahora = new Date();

    impresora.alignCenter();
    impresora.newLine();
    impresora.bold(true);
    impresora.println('Ticket de prueba');
    impresora.drawLine();
    impresora.println(ahora.toLocaleDateString());
    impresora.drawLine();
    impresora.cut();
    await impresora.execute();
    impresora.beep();
    impresora.clear();
  }
}

// Exportar una instancia singleton
const servicioImpresion = new ServicioImpresion();

module.exports = {
  imprimirTicketComanda: (pedido) => servicioImpresion.imprimirComanda(pedido),
  imprimirCuentaMesero: (pedido) => servicioImpresion.imprimirCuentaMesero(pedido),
  imprimirPrueba: () => servicioImpresion.imprimirPrueba()
};