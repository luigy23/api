const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer'); // Import 
const path = require('path');

//permitir impresión de caracteres especiales y acentos
let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '//localhost/XP-Cocina', //hay que compartir la impresora en red 
    characterSet: CharacterSet.PC858_EURO,
});


//el logo está en la misma carpeta que el archivo
const logo = path.join(__dirname, '200.png');

const productosLista = [
    { nombre: "Arroz con Camarones de la casa 12", cantidad: 2, precio: 10.99, comentario: "Sin cebolla" },
    { nombre: "Costillas de la casa", cantidad: 2, precio: 2.50 },
    { nombre: "Papas fritas", cantidad: 1, precio: 3.99, comentario: "Extra crujientes" }
];

function quitarAcentos(texto) {
    console.log("texto", texto)
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function imprimirTicketComanda(pedido) {
    
    
    const { MesaDescripcion, Mesero, Productos } = pedido;

    console.log("----------------imprimiendo--------------")

    console.log(pedido)
 
    console.log("---------------------------------------")

    await printer.printImage(logo);

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

    //limpiar la impresora
    printer.clear();
    

    }
    //pedido:
    // productos: [
    //     {
    //       Nombre: 'pollo',
    //       Precio: 1,
    //       Cantidad: 1,
    //       Comentario: '',
    //       codProducto: 'pollo',
    //       Estado: 'Listo',
    //       idRegistro: 1,
    //       idPedido: 4
    //     },
    //     {
    //       Nombre: 'Churrasco 400g',
    //       Precio: 20000,
    //       Cantidad: 1,
    //       Comentario: '',
    //       codProducto: 'Churrasco400',
    //       Estado: 'Listo',
    //       idRegistro: 0,
    //       idPedido: 4
    //     }
    //   ],
    //   mesa: '4',
    //   Mesero: {
    //     isAuthenticated: true,
    //     nombre: 'luigy',
    //     idCargo: 1,
    //     notificaciones: []
    //   }
    // }

async function imprimirCuentaMesero(pedido) {
    const { mesa, Mesero, productos, idPedido } = pedido;


    const nombreMesero = Mesero.nombre?Mesero.nombre:Mesero.user;
    

    printer.alignCenter();



    await printer.printImage(logo);
    printer.newLine();
    printer.bold(true);
    printer.println("Cuenta # " + idPedido);
    printer.bold(false);
    printer.drawLine();
    printer.newLine();
    printer.print("Mesa: " + mesa+" | ");
    printer.println("Mesero: " + nombreMesero);
    printer.newLine();
    printer.drawLine();
  
    //tabla con productos y precios
    printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
        { text:"Descripcion", align:"LEFT", width:0.5,bold:true },
        { text:"Cant", align:"CENTER", width:0.25, bold:true },
        { text:"Precio", align:"RIGHT", cols:8, bold:true }
      ]);
      printer.drawLine();
        printer.newLine();
        productos.forEach(producto => {
            if (producto.Estado === "Cancelado") return;
        
            printer.tableCustom([
                { text: "*"+producto.Nombre, align: "LEFT", width: 0.5 },
                { text: producto.Cantidad, align: "CENTER", width: 0.25 },
                { text:"$" +producto.Precio, align: "RIGHT", cols: 8 }
            ]);
            printer.drawLine();
        

  
        
      });

   //total
  
    printer.alignRight();
    //calcular total
    let total = 0;
    productos.forEach(producto => {
        if (producto.Estado === "Listo" || producto.Estado === "Pendiente") {
        total += producto.Precio * producto.Cantidad;}
        else{
            total += 0;
        }
    });
    printer.bold(true);
    printer.println("Total: $" + total);

    //total + propina
    printer.bold(false);
    let totalPropina = total * 1.10;
    //quitamos decimales
    totalPropina = totalPropina.toFixed(0);

    printer.println("propina voluntaria (10%): $" + (total*0.10) );
    printer.println("subtotal: $" + totalPropina);
   

    printer.alignLeft();
    printer.bold(false);
    //fecha y hora actual
    const fecha = new Date();
    printer.println("Fecha: " + fecha.toLocaleDateString());
    printer.println("Hora: " + fecha.toLocaleTimeString());
    printer.newLine();
    



    printer.cut();
    printer.execute();

    //limpiar la impresora
    printer.clear();
    

    


}

async function imprimirPrueba() {
    
    printer.alignCenter();
    printer.println("Hola mundo");
    printer.cut();
    printer.execute();
    printer.clear();

    return "ok";
}


    module.exports = {
        imprimirTicketComanda,
        imprimirCuentaMesero,
        imprimirPrueba

    };