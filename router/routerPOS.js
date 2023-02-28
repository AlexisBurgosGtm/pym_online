const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.post("/claseuno", async(req,res)=>{

    const{sucursal} = req.body;

    let qry = `SELECT CODCLAUNO AS CODIGO, DESCLAUNO AS DESCRIPCION
                FROM CLASEUNO
                WHERE EMP_NIT='${sucursal}'`
    
  
    execute.Query(res,qry);
     
});






module.exports = router;