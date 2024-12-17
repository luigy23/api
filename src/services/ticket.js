const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer') // Import
const path = require('path')

// permitir impresión de caracteres especiales y acentos
const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '//localhost/BL_POS', // hay que compartir la impresora en red //localhost/XP-Cocina
  characterSet: CharacterSet.PC858_EURO
})

const printerBebidas = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'tcp://192.168.20.100', // hay que compartir la impresora en red
  characterSet: CharacterSet.PC858_EURO
})

// el logo está en la misma carpeta que el archivo
const logo = path.join(__dirname, '200.png')

function quitarAcentos (texto) {
  console.log('texto', texto)
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

async function imprimirTicketComanda (pedido) {
  const { MesaDescripcion, Mesero, Productos } = pedido

  console.log('----------------imprimiendo--------------')
  console.log(pedido)
  console.log('---------------------------------------')

  await printer.printImage(logo)

  printer.alignCenter()
  printer.newLine()
  printer.print(`Mesa: ${MesaDescripcion}  |`)
  printer.println(`Mesero: ${quitarAcentos(Mesero)}`)
  printer.drawLine()

  const imprimirProducto = (producto, printerInstance) => {
    printerInstance.alignLeft()
    printerInstance.setTextSize(1, 1)
    printerInstance.bold(true)
    printerInstance.println(`${producto.cantidad}x ${quitarAcentos(producto.nombre)}`)
    printerInstance.bold(false)
    printerInstance.setTextSize(0, 0)
    if (producto.comentario) {
      printerInstance.setTextSize(0, 1) // Hacemos el comentario un poco más alto para mejor legibilidad
      printerInstance.println(`  Nota: ${quitarAcentos(producto.comentario)}`)
      printerInstance.setTextSize(0, 0) // Volvemos al tamaño normal
    }
    printerInstance.newLine() // Añadimos una línea extra entre productos para mejor separación
  }

  const bebidas = Productos.filter(producto => producto.idCategoria === 4)
  const otrosProductos = Productos.filter(producto => producto.idCategoria !== 4)

  if (bebidas.length > 0) {
    await printerBebidas.printImage(logo)
    printerBebidas.alignCenter()
    printerBebidas.newLine()
    printerBebidas.print(`Mesa: ${MesaDescripcion}  |`)
    printerBebidas.println(`Mesero: ${quitarAcentos(Mesero)}`)
    printerBebidas.drawLine()
    bebidas.forEach(producto => imprimirProducto(producto, printerBebidas))
    printerBebidas.drawLine()
    printerBebidas.cut()
    printerBebidas.execute()
    printerBebidas.clear()
  }

  otrosProductos.forEach(producto => imprimirProducto(producto, printer))

  printer.drawLine()
  printer.cut()
  printer.execute()

  // Limpiar la impresora
  printer.clear()
}

async function imprimirCuentaMesero (pedido) {
  const { mesa, Mesero, productos, idPedido } = pedido

  const nombreMesero = Mesero.nombre ? Mesero.nombre : Mesero.user

  printer.alignCenter()

  await printer.printImage(logo)
  printer.newLine()
  printer.bold(true)
  printer.println('Pedido # ' + idPedido)
  printer.bold(false)
  printer.drawLine()
  printer.newLine()
  printer.print('Mesa: ' + mesa + ' | ')
  printer.println('Mesero: ' + nombreMesero)
  printer.newLine()
  printer.drawLine()

  // tabla con productos y precios
  printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
    { text: 'Descripcion', align: 'LEFT', width: 0.5, bold: true },
    { text: 'Cant', align: 'CENTER', width: 0.25, bold: true },
    { text: 'Precio', align: 'RIGHT', cols: 8, bold: true }
  ])
  printer.drawLine()
  printer.newLine()
  productos.forEach(producto => {
    if (producto.Estado === 'Cancelado') return

    printer.tableCustom([
      { text: '*' + producto.Nombre, align: 'LEFT', width: 0.5 },
      { text: producto.Cantidad, align: 'CENTER', width: 0.25 },
      { text: '$' + producto.Precio, align: 'RIGHT', cols: 8 }
    ])
    printer.drawLine()
  })

  // total

  printer.alignRight()
  // calcular total
  let total = 0
  productos.forEach(producto => {
    if (producto.Estado === 'Listo' || producto.Estado === 'Pendiente') {
      total += producto.Precio * producto.Cantidad
    } else {
      total += 0
    }
  })
  printer.bold(true)
  printer.println('Total: $' + total)

  // total + propina
  printer.bold(false)
  let totalPropina = total * 1.10
  // quitamos decimales
  totalPropina = totalPropina.toFixed(0)

  printer.println('propina voluntaria (10%): $' + (total * 0.10))
  printer.println('subtotal: $' + totalPropina)

  printer.alignLeft()
  printer.bold(false)
  // fecha y hora actual
  const fecha = new Date()
  printer.println('Fecha: ' + fecha.toLocaleDateString())
  printer.println('Hora: ' + fecha.toLocaleTimeString())
  printer.newLine()
  // comentario esta cuenta no cuenta como comprobante de pago
  printer.println('Este ticket no es valido como comprobante de pago')

  printer.cut()
  printer.execute()

  // limpiar la impresora
  printer.clear()
}

async function imprimirPrueba () {
  printer.alignCenter()
  printer.println('Hola mundo')
  printer.cut()
  printer.execute()
  printer.clear()

  return 'ok'
}

module.exports = {
  imprimirTicketComanda,
  imprimirCuentaMesero,
  imprimirPrueba

}
