const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.post("/dia", async(req,res)=>{
    
    const {sucursal,fecha} = req.body;
            
    
    let qry = `
    SELECT 
        EMP_NIT, DOC_FECHA, DOC_NOMCLIE AS CLIENTE, DOC_NIT AS NIT, DOC_DIRCLIE AS DIRCLIE, DOC_TOTALVENTA
    FROM DOCUMENTOS
    WHERE EMP_NIT='${sucursal}' AND DOC_FECHA='${fecha}' AND DOC_STATUS<>'A';
    `
    
    execute.Query(qry,res);

});


module.exports = router;
