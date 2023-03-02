const execute = require('./connection');
const express = require('express');
const router = express.Router();


router.post("/claseuno", async(req,res)=>{
   
    const { sucursal } = req.body;

    let qry = `SELECT CODCLAUNO AS CODIGO, DESCLAUNO AS DESCRIPCION
                FROM CLASEUNO
                WHERE EMP_NIT='${sucursal}'`
    
    
  
    execute.Query(res,qry);
     
});

router.post("/productos_categoria", async(req,res)=>{
   
    const { sucursal, codigo } = req.body;

    let qry = `
        SELECT Productos.CODPROD, Productos.DESPROD, Productos.CODMARCA, Marcas.DESMARCA, 
                Precios.CODMEDIDA, Precios.EQUIVALE, Precios.COSTO, Precios.PRECIO
        FROM Productos LEFT OUTER JOIN
                             Marcas ON Productos.CODMARCA = Marcas.CODMARCA AND Productos.EMP_NIT = Marcas.EMP_NIT LEFT OUTER JOIN
                             Precios ON Productos.CODPROD = Precios.CODPROD AND Productos.EMP_NIT = Precios.EMP_NIT
        WHERE (Productos.EMP_NIT = '${sucursal}') AND (Productos.CODCLAUNO = '${codigo}') AND (Precios.CODMEDIDA IS NOT NULL)`
    
    
  
    execute.Query(res,qry);
     
});





module.exports = router;