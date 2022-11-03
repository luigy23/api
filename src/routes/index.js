const { Router } = require("express")
const router= Router();




router.get("/", (req,res)=>{
    
    res.json({"title":"hola qtal"})
})


router.get("/test", (req,res)=>{
    
    res.json({"title":"soy un texto"})
})


const productos = require("../productos.json")
router.get("/productos", (req,res)=>{
    
    res.json(productos)
})

router.post("/productos", (req,res)=>{
    console.log(req.body)
    productos.push(req.body)
    
})



module.exports = router;



