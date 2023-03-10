const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.post("/dia", async(req,res)=>{
    
    const {sucursal,fecha,coddoc} = req.body;
            
    
    let qry = `
    SELECT 
        EMP_NIT, CODDOC, DOC_NUMERO AS CORRELATIVO,
        DOC_FECHA AS FECHA, DOC_NOMREF AS CLIENTE, 
        DOC_NIT AS NIT, DOC_DIRENTREGA AS DIRCLIE, 
        DOC_TOTALVENTA AS IMPORTE
    FROM DOCUMENTOS
    WHERE EMP_NIT='${sucursal}' 
        AND CODDOC IN(${coddoc})
        AND DOC_FECHA='${fecha}' 
        AND DOC_ESTATUS<>'A';
    `
    
    execute.Query(res,qry);

});


module.exports = router;
