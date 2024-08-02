const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer'); // Import 

//permitir impresión de caracteres especiales y acentos
let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '//localhost/XP-80C',
    characterSet: CharacterSet.PC858_EURO,
});




const productosLista = [
    { nombre: "Arroz con Camarones de la casa 12", cantidad: 2, precio: 10.99, comentario: "Sin cebolla" },
    { nombre: "Costillas de la casa", cantidad: 2, precio: 2.50 },
    { nombre: "Papas fritas", cantidad: 1, precio: 3.99, comentario: "Extra crujientes" }
];

function quitarAcentos(texto) {
    console.log("texto", texto)
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function imprimirTicketComanda(pedido) {
    

    const { MesaDescripcion, Mesero, Productos } = pedido;

    console.log("----------------imprimiendo--------------")

    console.log(pedido)
 
    console.log("---------------------------------------")

    printer.alignCenter();
    printer.newLine();


    printer.print(`Mesa: ${MesaDescripcion}  |`);
    printer.println(`Mesero: ${quitarAcentos(Mesero)}`);
    printer.drawLine();

    Productos.forEach(producto => {
        // Aumentamos el tamaño del texto para el nombre del producto y la cantidad
        printer.setTextSize(1, 1);
        printer.bold(true);
        printer.println(`${producto.cantidad}x ${quitarAcentos(producto.nombre)}`);
        printer.bold(false);
        printer.setTextSize(0, 0);
        

        
        if (producto.comentario) {
            printer.setTextSize(0, 1); // Hacemos el comentario un poco más alto para mejor legibilidad
            printer.println(`  Nota: ${quitarAcentos(producto.comentario)}`);
            printer.setTextSize(0, 0); // Volvemos al tamaño normal
        }
        
        printer.newLine(); // Añadimos una línea extra entre productos para mejor separación
    });


    printer.drawLine();
    printer.cut();
    printer.execute();
    }


    module.exports = {
        imprimirTicketComanda
    };