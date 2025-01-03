const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer') // Import
const path = require('path')

try {
  


// permitir impresión de caracteres especiales y acentos
const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '//localhost/POS-COCINA', // hay que compartir la impresora en red //localhost/XP-Cocina
  characterSet: CharacterSet.PC858_EURO
})

const printerBebidas = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '//localhost/POS-BEBIDAS', // hay que compartir la impresora en red
  characterSet: CharacterSet.PC858_EURO
})

const printerCaja = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '//localhost/XP-80Caja', // hay que compartir la impresora en red //localhost/XP-Cocina
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
  const otrosProductos = Productos.filter(producto => producto.idCategoria !== 4 && producto.idCategoria !== 30)


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
    printerBebidas.beep()

    printerBebidas.clear()
  }

  otrosProductos.forEach(producto => imprimirProducto(producto, printer))

  printer.drawLine()
  printer.cut()
  printer.execute()
  printer.beep()
  // Limpiar la impresora
  printer.clear()
}

async function imprimirCuentaMesero (pedido) {
  const { mesa, Mesero, productos, idPedido } = pedido

  const nombreMesero = Mesero.nombre ? Mesero.nombre : Mesero.user

  printerCaja.alignCenter()

  await printerCaja.printImage(logo)
  printerCaja.newLine()
  printerCaja.bold(true)
  printerCaja.println('Pedido # ' + idPedido)
  printerCaja.bold(false)
  printerCaja.drawLine()
  printerCaja.newLine()
  printerCaja.print('Mesa: ' + mesa + ' | ')
  printerCaja.println('Mesero: ' + nombreMesero)
  printerCaja.newLine()
  printerCaja.drawLine()

  // tabla con productos y precios
  printerCaja.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
    { text: 'Descripcion', align: 'LEFT', width: 0.5, bold: true },
    { text: 'Cant', align: 'CENTER', width: 0.25, bold: true },
    { text: 'Precio', align: 'RIGHT', cols: 8, bold: true }
  ])
  printerCaja.drawLine()
  printerCaja.newLine()
  productos.forEach(producto => {
    if (producto.Estado === 'Cancelado') return

    printerCaja.tableCustom([
      { text: '*' + producto.Nombre, align: 'LEFT', width: 0.5 },
      { text: producto.Cantidad, align: 'CENTER', width: 0.25 },
      { text: '$' + producto.Precio, align: 'RIGHT', cols: 8 }
    ])
    printerCaja.drawLine()
  })

  // total

  printerCaja.alignRight()
  // calcular total
  let total = 0
  productos.forEach(producto => {
    if (producto.Estado === 'Listo' || producto.Estado === 'Pendiente') {
      total += producto.Precio * producto.Cantidad
    } else {
      total += 0
    }
  })
  printerCaja.bold(true)
  printerCaja.println('Total: $' + total)

  // total + propina
  printerCaja.bold(false)
  let totalPropina = total * 1.10
  // quitamos decimales
  totalPropina = totalPropina.toFixed(0)

  printerCaja.println('propina voluntaria (10%): $' + (total * 0.10))
  printerCaja.println('subtotal: $' + totalPropina)

  printerCaja.alignLeft()
  printerCaja.bold(false)
  // fecha y hora actual
  const fecha = new Date()
  printerCaja.println('Fecha: ' + fecha.toLocaleDateString())
  printerCaja.println('Hora: ' + fecha.toLocaleTimeString())
  printerCaja.newLine()
  // comentario esta cuenta no cuenta como comprobante de pago
  printerCaja.println('Este ticket no es valido como factura electronica')

  printerCaja.cut()
  printerCaja.execute()

  // limpiar la impresora
  printerCaja.clear()
}

async function imprimirPrueba () {

  try{
  await printerCaja.alignCenter()
  printerCaja.newLine()
  printerCaja.bold(true)
  printerCaja.println('Ticket de prueba')
  printerCaja.drawLine()

  // imprimir hora y fecha
  const fecha = new Date()
  printerCaja.println(fecha.toLocaleDateString())
  printerCaja.drawLine()
  printerCaja.cut()
  printerCaja.execute() // Print text

  printerCaja.beep() // Beep the buzzer

  // Limpiar la impresora
  printerCaja.clear()

  //imprimir en las otras impresoras
  await printer.alignCenter()
  printer.newLine()
  printer.bold(true)
  printer.println('Ticket de prueba')
  printer.drawLine()

  // imprimir hora y fecha
  printer.println(fecha.toLocaleDateString())
  printer.drawLine()
  printer.cut()
  printer.execute() // Print text

  printer.beep() // Beep the buzzer

  // Limpiar la impresora
  printer.clear()

  await printerBebidas.alignCenter()
  printerBebidas.newLine()
  printerBebidas.bold(true)
  printerBebidas.println('Ticket de prueba')
  printerBebidas.drawLine()

  // imprimir hora y fecha
  printerBebidas.println(fecha.toLocaleDateString())
  printerBebidas.drawLine()
  printerBebidas.cut()
  printerBebidas.execute() // Print text

  printerBebidas.beep() // Beep the buzzer

  // Limpiar la impresora
  printerBebidas.clear()}
  catch (error) {
    console.error("Error en imprimirPrueba: ", error)
    return 'hay un error'
  }
  finally{
    return 'impreso'
  }






}

module.exports = {
  imprimirTicketComanda,
  imprimirCuentaMesero,
  imprimirPrueba

}
} catch (error) {
  console.error(error)
}
