const {Router} = require("Express")
 const router= Router();
const con = require("../mysql.js");

const productos = require("../productos.json" )





router.get("/", (req,res)=>{
    
    res.json({"title":"hola qtal"})
})


router.get("/test", (req,res)=>{

  const sql = "INSERT INTO `productos` (`codProducto`, `Nombre`, `Descripcion`, `idCategoria`, `Precio`, `Estado`) VALUES ('77', 'sevenUP', '1,5 Litros', '1', '15000', 'Agotado');"

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });



    res.json({"title":"soy un texto"})
})



router.get("/productos", (req,res)=>{
    
    res.json(productos)
})

router.post("/productos", (req,res)=>{
    console.log(req.body)
    productos.push(req.body)
    
})



router.get('/nuevo/pedido', function(req, res){

  var sql = "SELECT * FROM `pedido` ";
  //Agregar más código aquí...
  con.query(sql, function (err, result) {
    if (err) throw err;


    const json = JSON.stringify(result);
    res.json(result)
    
  });
}); //Agregar llave de cierre aquí

module.exports = router;



