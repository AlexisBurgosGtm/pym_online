const execute = require('./connection');
const express = require('express');
const router = express.Router();
const axios = require('axios');


router.post("/fel", async(req,res)=>{

    const {nitemisor,xmldte, felnombre, felclave, identificador} = req.body;

    axios.post('https://certificador.feel.com.gt/fel/certificacion/v2/dte/',
    {nit_emisor: nitemisor, 
      correo_copia: "contadorgeneral@grupobuenavista.com.gt", 
      xml_dte: xmldte
    }, 
    {
      headers: {
        usuario: felnombre,
        llave: felclave,
        identificador: identificador,
        'Content-Type': 'application/json'
      } 
    })
    .then((response) => {
        const data = response.data;
        res.send(data);
    }, (error) => {
        res.send(error);
    });
   
});


router.post("/solicitud_cambios_cliente", async(req,res)=>{

    const{sucursal,codclie,nitclie,tiponegocio,negocio,nomclie,dirclie,lat,long} = req.body;

    let qry = `INSERT INTO ME_CENSO_SOLICITUDES (
            CODSUCURSAL, CODCLIE,NITCLIE,TIPONEGOCIO,NEGOCIO,NOMCLIE,DIRCLIE,LAT,LONG)
    VALUES ('${sucursal}',${codclie},'${nitclie}','${tiponegocio}','${negocio}','${nomclie}','${dirclie}',${lat},${long});`
    
 
    
     execute.Query(res,qry);
     

     /*

       const{sucursal,codven,fecha,codclie,nitclie,tiponegocio,negocio,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long,sector} = req.body;

    let qry = `INSERT INTO ME_CENSO_SOLICITUDES (
            CODSUCURSAL,   CODVEN,     FECHA, CODCLIE,NITCLIE,TIPONEGOCIO,NEGOCIO,NOMCLIE,DIRCLIE,REFERENCIA,CODMUN,CODDEPTO,OBS,VISITA,LAT,LONG,TELEFONO, STATUS, SECTOR)
    VALUES ('${sucursal}',${codven},'${fecha}',${codclie},'${nitclie}','${tiponegocio}','${negocio}','${nomclie}','${dirclie}','${referencia}','${codmun}','${coddepto}','${obs}','${visita}',${lat},${long},'${telefono}','PENDIENTE','${sector}');`
    

      */
});


router.post("/setreminder", async(req,res)=>{

    const{sucursal,codclie,nit,nombre,direccion,fecha,hora,minuto,recordatorio} = req.body;

    let qry = `INSERT INTO ME_RECORDATORIOS (CODSUCURSAL,CODCLIE,NIT,NOMCLIE,DIRECCION,HORA,MINUTO,FECHA,RECORDATORIO)
     VALUES ('${sucursal}',${codclie},'${nit}','${nombre}','${direccion}',${hora},${minuto},'${fecha}','${recordatorio}');`

     execute.Query(res,qry);
     
});

//CENSO
router.post('/censovendedor',async(req,res)=>{

    const {sucursal,codven,visita} = req.body;
    
    let qry = `SELECT ME_CENSO.ID, ME_CENSO.FECHA, ME_CENSO.CODCLIE, ME_CENSO.NITCLIE, ME_CENSO.TIPONEGOCIO, ME_CENSO.NEGOCIO, ME_CENSO.NOMCLIE, ME_CENSO.DIRCLIE, ISNULL(ME_CENSO.REFERENCIA, 'SN') AS REFERENCIA, ME_CENSO.CODMUN, 
    ME_Municipios.DESMUNI, ME_CENSO.CODDEPTO, ME_Departamentos.DESDEPTO, ISNULL(ME_CENSO.OBS,'SN') AS OBS, ISNULL(ME_CENSO.TELEFONO,'SN') AS TELEFONO, ME_CENSO.VISITA, ME_CENSO.LAT, ME_CENSO.LONG
    FROM ME_CENSO LEFT OUTER JOIN
    ME_Departamentos ON ME_CENSO.CODDEPTO = ME_Departamentos.CODDEPTO AND ME_CENSO.CODSUCURSAL = ME_Departamentos.CODSUCURSAL LEFT OUTER JOIN
    ME_Municipios ON ME_CENSO.CODMUN = ME_Municipios.CODMUNI AND ME_CENSO.CODSUCURSAL = ME_Municipios.CODSUCURSAL
    WHERE (ME_CENSO.CODSUCURSAL = '${sucursal}') AND (ME_CENSO.CODVEN = ${codven}) AND (ME_CENSO.VISITA='${visita}')
    ORDER BY ME_CENSO.ID`;

    execute.Query(res,qry);
    
})

router.post("/listavendedortodos", async(req,res)=>{

    const {app,sucursal,codven}  = req.body;
    
    let qry = '';

  
    
        qry = `SELECT '${sucursal}' AS CODSUCURSAL, ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, 
        ME_Clientes.FAXCLIE AS TIPONEGOCIO, '' AS STVISITA, ME_Clientes.REFERENCIA, ME_Clientes.VISITA, ME_Clientes.NOMFAC AS NEGOCIO
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
       
    
    execute.Query(res,qry);

})

router.post("/listavendedortodos3", async(req,res)=>{

    const {app,sucursal,codven}  = req.body;
    
    let qry = '';

  
    
        qry = `SELECT '${sucursal}' AS CODSUCURSAL, ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, 
        ME_Clientes.FAXCLIE AS TIPONEGOCIO, '' AS STVISITA, ME_Clientes.REFERENCIA, ME_Clientes.VISITA, ME_Clientes.NOMFAC AS NEGOCIO
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
       
    
    execute.Query(res,qry);

})

router.post("/listavendedortodos2", async(req,res)=>{

    const {app,sucursal,codven}  = req.body;
    
    let qry = '';

  
    
        qry = `SELECT '${sucursal}' AS CODSUCURSAL, ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, 
        ME_Clientes.FAXCLIE AS TIPONEGOCIO, '' AS STVISITA, ME_Clientes.REFERENCIA, ME_Clientes.VISITA, ME_Clientes.NOMFAC AS NEGOCIO
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.CODVEN2 = '${codven}')
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
       
    
    execute.Query(res,qry);

})

router.post("/listavendedor", async(req,res)=>{

    const {app,sucursal,codven,dia}  = req.body;
    let qry = '';

    if (dia=='OTROS'){
        qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}')  
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
    
    }else{
        qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.VISITA = '${dia}') 
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
    
    }

    
    
    execute.Query(res,qry);

})

router.post("/listaajenosvendedor", async(req,res)=>{

    const {app,sucursal,filtro}  = req.body;

    let qry = '';
    qry = `SELECT TOP 30 ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
    ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.REFERENCIA,
    ME_Clientes.FAXCLIE AS TIPONEGOCIO, '' AS STVISITA, ME_Clientes.REFERENCIA, ME_Clientes.VISITA, ME_Clientes.NOMFAC AS NEGOCIO
            FROM ME_Clientes LEFT OUTER JOIN
    ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
            WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
            AND (CONCAT(ME_Clientes.NOMFAC,'-',ME_Clientes.NOMCLIE) LIKE '%${filtro}%') 
            AND (ME_Clientes.CODCLIE=0) 
            OR
            (ME_Clientes.CODSUCURSAL = '${sucursal}') 
            AND (ME_Clientes.NITCLIE= '${filtro}') 
            AND (ME_Clientes.CODCLIE=0)
            ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`
    
    execute.Query(res,qry);

})


//REVISADA 03-2023
router.post("/listaajenosvendedor2", async(req,res)=>{

    const {app,sucursal,filtro,codven}  = req.body;

    let qryx = '';
    qryx = `SELECT TOP 50 Clientes.NITCLIE AS CODIGO, Clientes.NITFACTURA AS NIT, 
    Clientes.NOMCLIE, Clientes.DIRCLIE, Municipios.DESMUNI, Clientes.TELCLIE AS TELEFONO, ISNULL(Clientes.LATITUD, 0) AS LAT, 
    ISNULL(Clientes.LONGITUD, 0) AS LONG, ISNULL(Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE,
    Clientes.FAXCLIE AS TIPONEGOCIO , '' AS STVISITA, 'SN' AS REFERENCIA, 'OTROS' AS VISITA, Clientes.NOMFAC AS NEGOCIO
            FROM Clientes LEFT OUTER JOIN
    Municipios ON Clientes.EMP_NIT = Municipios.EMP_NIT AND Clientes.CODMUNI = Municipios.CODMUNI
            WHERE (Clientes.EMP_NIT = '${sucursal}') 
            AND (CONCAT(Clientes.NOMFAC,'-',Clientes.NOMCLIE) LIKE '%${filtro}%') 
            AND (Clientes.CODCLIE=0) 
            OR
            (Clientes.EMP_NIT = '${sucursal}') 
            AND (Clientes.NITCLIE= '${filtro}') 
        ORDER BY Clientes.FECHAINGRESO,Clientes.NOMCLIE`
    

    let qry = `
    SELECT  TOP (50) Clientes.NITCLIE AS CODIGO, Clientes.NITFACTURA AS NIT, Clientes.NOMCLIE, Clientes.DIRCLIE, Municipios.DESMUNI, Clientes.TELCLIE AS TELEFONO, ISNULL(Clientes.LATITUD, 0) AS LAT, 
                         ISNULL(Clientes.LONGITUD, 0) AS LONG, ISNULL(Clientes.FECHAINGRESO, '2020-04-15') AS LASTSALE, Clientes.FAXCLIE AS TIPONEGOCIO, '' AS STVISITA, 'SN' AS REFERENCIA, 'OTROS' AS VISITA, 
                         Clientes.NOMFAC AS NEGOCIO, 
                         ClasificacionCliente.SALDO, 
                         ClasificacionCliente.[NO VENCIDO] AS NO_VENCIDO, 
                         ClasificacionCliente.[DE 1 A 30] AS DE1A30, 
                         ClasificacionCliente.[DE 31 A 45] AS DE31A45, 
                         ClasificacionCliente.[DE 46 A 60] AS DE46A60, 
                         ClasificacionCliente.[DE 61 A MAS] AS DE61AMAS,
                (ClasificacionCliente.SALDO-ClasificacionCliente.[NO VENCIDO]) AS SALDO_VENCIDO
    FROM  Clientes LEFT OUTER JOIN
                         ClasificacionCliente ON Clientes.NITCLIE = ClasificacionCliente.NITCLIE AND Clientes.EMP_NIT = ClasificacionCliente.EMP_NIT LEFT OUTER JOIN
                         Municipios ON Clientes.EMP_NIT = Municipios.EMP_NIT AND Clientes.CODMUNI = Municipios.CODMUNI
            WHERE (Clientes.EMP_NIT = '${sucursal}') 
            AND (CONCAT(Clientes.NOMFAC,'-',Clientes.NOMCLIE) LIKE '%${filtro}%') 
            AND (Clientes.CODCLIE=0) 
            OR
            (Clientes.EMP_NIT = '${sucursal}') 
            AND (Clientes.NITCLIE= '${filtro}') 
        ORDER BY Clientes.FECHAINGRESO,Clientes.NOMCLIE
    `
    execute.Query(res,qry);

})

//LISTADO DE CLIENTES POR SUCURSAL
router.post('/clientesvendedor',async(req,res)=>{

    const {sucursal,codven} = req.body;
    
    let qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Clientes.CODMUNI, ME_Municipios.DESMUNI, ME_Clientes.CODDEPTO, ME_Departamentos.DESDEPTO, 
    ME_Clientes.TELCLIE AS TELEFONO, ME_Clientes.CODVEN, ME_Vendedores.NOMVEN, ME_Clientes.LATITUD AS LAT, ME_Clientes.LONGITUD AS LONG, ME_Clientes.VISITA, ME_Clientes.CODCLIE AS ACTIVO, 
    ME_Clientes.CODSUCURSAL, ME_Clientes.FECHAINGRESO AS LASTSALE
        FROM            ME_Clientes LEFT OUTER JOIN
    ME_Vendedores ON ME_Clientes.CODVEN = ME_Vendedores.CODVEN AND ME_Clientes.CODSUCURSAL = ME_Vendedores.CODSUCURSAL LEFT OUTER JOIN
    ME_Departamentos ON ME_Clientes.CODSUCURSAL = ME_Departamentos.CODSUCURSAL AND ME_Clientes.CODDEPTO = ME_Departamentos.CODDEPTO LEFT OUTER JOIN
    ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
    WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') AND (ME_Clientes.CODVEN=${codven})
    ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.VISITA,ME_Clientes.NOMCLIE`;

    execute.Query(res,qry);
    
})

//ESTABLECE LA FECHA DE ULTIMA VENTA DEL CLIENTE
router.post('/lastsale',async(req,res)=>{
    const {sucursal,nitclie,fecha,visita} = req.body;

    //FAXCLIE= SERÁ USADO PARA INDICAR EL RESULTADO DE LA VISITA: VENTA,NODINERO,CERRADO
    let qry = `UPDATE ME_CLIENTES SET FECHAINGRESO='${fecha}',FAXCLIE='${visita}' WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})

//DESACTIVA EL CLIENTE CAMBIANDO EL CAMPO CODCLIE DE 0 A 1
router.put('/desactivar',async(req,res)=>{
    const {sucursal,nitclie} = req.body;
    
    let qry = `UPDATE ME_CLIENTES SET CODCLIE=1 WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})

//RE-ACTIVA EL CLIENTE CAMBIANDO EL CAMPO CODCLIE DE 1 A 0
router.put('/reactivar',async(req,res)=>{
    const {sucursal,nitclie} = req.body;
    
    let qry = `UPDATE ME_CLIENTES SET CODCLIE=0 WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})


// BUSCA CLIENTE POR NOMBRE
router.get("/buscarcliente", async(req,res)=>{
    const {app,empnit,filtro} = req.query;
        
    let qry ='';

            qry = `SELECT ME_Clientes.NITCLIE AS CODCLIE, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Clientes.CODMUNI AS CODMUNICIPIO, ME_Municipios.DESMUNI AS DESMUNICIPIO, 
            ME_Clientes.CODDEPTO, ME_Departamentos.DESDEPTO, ME_Clientes.LISTA AS PRECIO, 0 AS SALDO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, ISNULL(ME_Clientes.LONGITUD, 0) AS LONG
            FROM ME_Clientes LEFT OUTER JOIN
            ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI LEFT OUTER JOIN
            ME_Departamentos ON ME_Clientes.CODSUCURSAL = ME_Departamentos.CODSUCURSAL AND ME_Clientes.CODDEPTO = ME_Departamentos.CODDEPTO
        WHERE (ME_Clientes.CODSUCURSAL = '${app}') 
        AND (ME_Clientes.NOMCLIE LIKE '%${filtro}%')
        `     
    
    execute.Query(res,qry);

});

// AGREGA UN NUEVO CLIENTE
router.post("/clientenuevo", async(req,res)=>{
    const {app,fecha,codven,empnit,codclie,nitclie,nomclie,nomfac,dirclie,coddepto,codmunicipio,codpais,telclie,emailclie,codbodega,tipoprecio,lat,long} = req.body;
    
    let qry ='';

    
            qry = `INSERT INTO ME_CLIENTES (
                EMP_NIT, NITCLIE, CODCLIE, NOMCLIE, DIRCLIE,
                CODDEPTO, CODMUNI, TELCLIE, EMAILCLIE, TIPOCLIE,
                ACEPTACHEQUE, FECHAINGRESO, NITFACTURA, CODVEN, LIMITECREDITO,
                DIASCREDITO, CODPAIS, NOMFAC, CODBODEGA, DESCUENTO,
                CODTIPOCLIE, COMISION, IMPUESTO1, TEMPORADACREDITO, TEMPORADADIAS,
                VENTADOLARES, VENTAEXPORTA, MONTOIVARET, PORIVARET, CODTIPOFP,
                UTILIZAPUNTOS, TIPOPUNTOS, NCUOTAS, VARIASLISTAS, DIASPRIMERCUOTA,
                DIASCUOTAS, CALCULOCUOTAS, CLIE_CARGOAUT, TIPO_CARGOAUT, LATITUDCLIE, LONGITUDCLIE,
                LATITUD, LONGITUD
            )VALUES(
                '${empnit}','${codclie}',0,'${nomclie}','${dirclie}',
                '${coddepto}','${codmunicipio}','${telclie}','${emailclie}','${tipoprecio}',
                0,'${fecha}','${nitclie}','${codven}',0,
                30,'${codpais}','${nomfac}','${codbodega}',0,
                'A',0,0,0,0,
                0,0,0,0,0,
                0,'NUNCA',0,0,0,
                0,0,0,0,0,0,
                '${lat}','${long}'
            )`         
    
    execute.Query(res,qry);

});

//LISTADO DE MUNICIPIOS EN EL SISTEMA
router.get("/municipios", async(req,res)=>{
    const {app,empnit} = req.query;
    let qry ='';

    qry = `SELECT CODMUNI AS CODMUNICIPIO, DESMUNI AS DESMUNICIPIO FROM ME_MUNICIPIOS WHERE CODSUCURSAL='${app}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
});

//LISTADO DE MUNICIPIOS EN EL SISTEMA
router.get("/departamentos", async(req,res)=>{
    const {app,empnit} = req.query;
    let qry ='';

    qry = `SELECT CODDEPTO, DESDEPTO FROM ME_DEPARTAMENTOS WHERE CODSUCURSAL='${app}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
    
});



module.exports = router;
