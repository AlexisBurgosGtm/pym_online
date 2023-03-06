const execute = require('./connection');
const express = require('express');
const router = express.Router();


//REPORTE DE VENTAS Y DEVOLUCIONES
router.post('/rptventas_vendedor',async(req,res)=>{

    const{sucursal, codven, mes, anio} = req.body;

    let qry = `SELECT DISTINCT       NOMVEN,FECHA, TIPO, SUM(TOTALPRECIO)  AS TOTALPRECIO, LASTUPDATE
    FROM            ME_RPT_VENTAS
    GROUP BY NOMVEN,FECHA, TIPO, LASTUPDATE, CODSUCURSAL, ANIO, MES, CODVEN
    HAVING        (ANIO = ${anio}) AND (MES = ${mes}) AND (CODSUCURSAL = '${sucursal}') AND (CODVEN=${codven})
    ORDER BY FECHA
    `;

    execute.Query(res,qry);
});



//EDICION DEL PEDIDO
router.post('/loadpedido',async(req,res)=>{

    const {sucursal, usuario, coddoc, correlativo} = req.body;
    
    let qry='';
    let qryold = `SELECT EMP_NIT AS EMPNIT, CODPROD, DESCRIPCION AS DESPROD, 
        CODMEDIDA, CANTIDAD, EQUIVALE, CANTIDADINV AS TOTALUNIDADES, 
        COSTO, PRECIO, TOTALCOSTO, TOTALPRECIO, 0 AS EXENTO, 
        '${usuario}' AS USUARIO, TIPOPRECIO, '${sucursal}' AS CODSUCURSAL 
        FROM ME_DOCPRODUCTOS
        WHERE CODSUCURSAL='${sucursal}' 
        AND CODDOC='${coddoc}' 
        AND DOC_NUMERO='${correlativo}'; `


        qry = `
        SELECT ME_Docproductos.EMP_NIT AS EMPNIT, ME_Docproductos.CODPROD, ME_Docproductos.DESCRIPCION AS DESPROD, ME_Docproductos.CODMEDIDA, 
                         ME_Docproductos.CANTIDAD, ME_Docproductos.EQUIVALE, ME_Docproductos.CANTIDADINV AS TOTALUNIDADES, ME_Docproductos.COSTO, ME_Docproductos.PRECIO, 
                         ME_Docproductos.TOTALCOSTO, ME_Docproductos.TOTALPRECIO, 0 AS EXENTO, '${usuario}' AS USUARIO, ME_Docproductos.TIPOPRECIO, 
                         '${sucursal}' AS CODSUCURSAL, 
                         ISNULL(ME_Productos.EXISTENCIA,0) AS EXISTENCIA
        FROM ME_Docproductos LEFT OUTER JOIN
                         ME_Productos ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND ME_Docproductos.CODPROD = ME_Productos.CODPROD AND 
                         ME_Docproductos.EMP_NIT = ME_Productos.EMP_NIT
        WHERE (ME_Docproductos.CODSUCURSAL = '${sucursal}') AND (ME_Docproductos.CODDOC = '${coddoc}') AND (ME_Docproductos.DOC_NUMERO = '${correlativo}') 
    `

    execute.Query(res, qry);

})

router.post('/loadpedido_original',async(req,res)=>{

    const {sucursal, usuario, coddoc, correlativo} = req.body;

    let qrydel = `DELETE FROM ME_TEMP_VENTAS 
            WHERE CODSUCURSAL='${sucursal}' 
            AND USUARIO='${usuario}'; `

    let qry='';
    qry = `INSERT INTO ME_TEMP_VENTAS 
            (EMPNIT,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,EXENTO,USUARIO,TIPOPRECIO,CODSUCURSAL) 
        SELECT EMP_NIT AS EMPNIT, CODPROD, DESCRIPCION AS DESPROD, 
        CODMEDIDA, CANTIDAD, EQUIVALE, CANTIDADINV AS TOTALUNIDADES, 
        COSTO, PRECIO, TOTALCOSTO, TOTALPRECIO, 0 AS EXENTO, '${usuario}' AS USUARIO, TIPOPRECIO, '${sucursal}' AS CODSUCURSAL 
        FROM ME_DOCPRODUCTOS
        WHERE CODSUCURSAL='${sucursal}' 
        AND CODDOC='${coddoc}' 
        AND DOC_NUMERO='${correlativo}'; `

    execute.Query(res,qrydel + qry);

})


router.post('/eliminarpedidocargado',async(req,res)=>{

    const {sucursal,coddoc,correlativo} = req.body;

    let qry = `DELETE FROM ME_DOCUMENTOS 
    WHERE CODSUCURSAL='${sucursal}' 
    AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}'
    AND DOC_ESTATUS='O'; `
    let qryprods = `DELETE FROM ME_DOCPRODUCTOS 
        WHERE CODSUCURSAL='${sucursal}' AND CODDOC='${coddoc}' 
        AND DOC_NUMERO='${correlativo}' ;`

    execute.Query(res, qry + qryprods);

})


// VENTANA DE VENTAS
///////////////////////////////////////
router.get("/json", async(req,res)=>{
    let qry = `SELECT       ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Precios.CODMEDIDA, ME_Precios.EQUIVALE, ME_Precios.COSTO, ME_Precios.PRECIO
    FROM            ME_Productos INNER JOIN
                             ME_Precios ON ME_Productos.EMP_NIT = ME_Precios.EMP_NIT AND ME_Productos.CODPROD = ME_Precios.CODPROD AND ME_Productos.CODSUCURSAL = ME_Precios.CODSUCURSAL
    WHERE        (ME_Productos.CODSUCURSAL = 'ME-IZABAL') FOR XML AUTO`
    execute.Query(res,qry);

})

// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.get("/buscarproducto", async(req,res)=>{
    
    const {empnit,filtro,app,tipoprecio} = req.query;
    // app= sucusal
    // K= CAMBIO DE PRODUCTO

    let qry ='';

    let campoprecio = '';
    let equ = '<>0'; //equivalente diferente a cero para que jale todos
    switch (tipoprecio) {
        case 'P':
            campoprecio = 'ME_PRECIOS.PRECIO';        
            break;
        case 'C':
            campoprecio = 'ME_PRECIOS.MAYORISTA';
            break;
        case 'B':
            campoprecio = 'ME_PRECIOS.ESCALA';
            break;
        case 'A':
            campoprecio = 'ME_PRECIOS.OFERTA';
            break;
        case 'K':
            campoprecio = '0.01';
            equ = '=1'; //equivalente =1 para que solo me jale las unidades

            break;
        default:
            campoprecio = 'ME_PRECIOS.PRECIO';
            break;
    }
    
    
    qry = `SELECT TOP 20 ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Precios.CODMEDIDA, 
                ME_Precios.EQUIVALE, ME_Precios.COSTO, ${campoprecio} AS PRECIO, 
                ME_Marcas.DESMARCA, 0 AS EXENTO, ISNULL(ME_PRODUCTOS.EXISTENCIA,0) AS EXISTENCIA,
                ME_Productos.DESPROD3
            FROM ME_Productos LEFT OUTER JOIN
                ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA LEFT OUTER JOIN
                ME_Precios ON ME_Productos.CODSUCURSAL = ME_Precios.CODSUCURSAL AND ME_Productos.CODPROD = ME_Precios.CODPROD
            WHERE (ME_Productos.DESPROD LIKE '%${filtro}%') AND (ME_Productos.CODSUCURSAL = '${app}') AND (ME_Precios.EQUIVALE ${equ}) 
                OR (ME_Productos.CODPROD = '${filtro}') AND (ME_Productos.CODSUCURSAL = '${app}') AND (ME_Precios.EQUIVALE ${equ})
            ORDER BY ME_Precios.CODPROD, ME_Precios.CODMEDIDA` 
    
        
    execute.Query(res,qry);

})


// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.post("/buscarproductotodos", async(req,res)=>{
    
    const {sucursal} = req.body;
    // app= sucusal
    // K= CAMBIO DE PRODUCTO

    let qry ='';

     
    qry = `SELECT ME_Productos.CODSUCURSAL, ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Precios.CODMEDIDA, 
                ME_Precios.EQUIVALE, 
                ME_Precios.COSTO, 
                ME_PRECIOS.PRECIO AS PRECIO,
                ME_PRECIOS.OFERTA AS PRECIOA,
                ME_PRECIOS.ESCALA AS PRECIOB,
                ME_PRECIOS.MAYORISTA AS PRECIOC,
                0.01 AS CAMBIO, 
                ME_Marcas.DESMARCA, 
                0 AS EXENTO, 
                ISNULL(ME_PRODUCTOS.EXISTENCIA,0) AS EXISTENCIA,
                ME_Productos.DESPROD3
            FROM ME_Productos LEFT OUTER JOIN
                ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA LEFT OUTER JOIN
                ME_Precios ON ME_Productos.CODSUCURSAL = ME_Precios.CODSUCURSAL AND ME_Productos.CODPROD = ME_Precios.CODPROD
            WHERE (ME_Productos.CODSUCURSAL = '${sucursal}') 
            ORDER BY ME_Precios.CODPROD, ME_Precios.CODMEDIDA` 
            
    execute.Query(res,qry);

})

// obtiene el total de temp ventas según sea el usuario
router.get("/tempVentastotal", async(req,res)=>{
    let empnit = req.query.empnit;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';


            qry = `SELECT COUNT(CODPROD) AS TOTALITEMS, SUM(TOTALCOSTO) AS TOTALCOSTO, SUM(TOTALPRECIO) AS TOTALPRECIO, SUM(EXENTO) AS TOTALEXENTO
            FROM ME_TEMP_VENTAS
            WHERE (CODSUCURSAL = '${app}') AND (USUARIO = '${usuario}')`        

    execute.Query(res,qry);
    
});

// obtiene el grid de temp ventas
router.get("/tempVentas", async(req,res)=>{
    let empnit = req.query.empnit;
    let coddoc = req.query.coddoc;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';

    qry = `SELECT 
            ME_TEMP_VENTAS.ID,ME_TEMP_VENTAS.CODPROD, 
            ME_TEMP_VENTAS.DESPROD, 
            ME_TEMP_VENTAS.CODMEDIDA, 
            ME_TEMP_VENTAS.CANTIDAD, 
            ME_TEMP_VENTAS.EQUIVALE,
            ME_TEMP_VENTAS.COSTO,
            ME_TEMP_VENTAS.TOTALCOSTO,  
            ME_TEMP_VENTAS.PRECIO, 
            ME_TEMP_VENTAS.TOTALPRECIO
                FROM ME_TEMP_VENTAS 
            WHERE (ME_TEMP_VENTAS.CODSUCURSAL = '${app}') AND (ME_TEMP_VENTAS.USUARIO = '${usuario}')
            ORDER BY ME_TEMP_VENTAS.ID DESC`

       
    execute.Query(res,qry);
    
});

// obtiene row de temp ventas
router.post("/tempVentasRow", async(req,res)=>{
    
    const {id,app} = req.body;

    let qry = '';
    
    qry = `SELECT ID,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,COSTO,PRECIO,EXENTO FROM ME_TEMP_VENTAS WHERE ID=${id}`
  
    execute.Query(res,qry);
    
});

// ACTUALIZA el grid de temp ventas
router.put("/tempVentasRow", async(req,res)=>{
    
    const {app,id,totalcosto,totalprecio,cantidad,totalunidades,exento} = req.body;
    
    let qry = '';
    
    qry = `UPDATE ME_TEMP_VENTAS SET CANTIDAD=${cantidad},TOTALCOSTO=${totalcosto},TOTALPRECIO=${totalprecio},TOTALUNIDADES=${totalunidades},EXENTO=${exento} WHERE ID=${id}`
    
    
    execute.Query(res,qry);
    
});

// inserta un nuevo registro en temp ventas   
router.post("/tempVentas", async(req,res)=>{
        
    let empnit = req.body.empnit;
    let usuario = req.body.usuario;
    let token = req.body.token;

    let tipoprecio = req.body.tipoprecio;

    let codprod = req.body.codprod;
    let desprod = req.body.desprod;
    let codmedida= req.body.codmedida;
    let cantidad=Number(req.body.cantidad);
    let equivale = Number(req.body.equivale);
    let totalunidades = Number(req.body.totalunidades);
    let costo = Number(req.body.costo);
    let precio=Number(req.body.precio);
    let totalcosto =Number(req.body.totalcosto);
    let totalprecio=Number(req.body.totalprecio);
    let exento=Number(req.body.exento);

    let coddoc = req.body.coddoc;


    let app = req.body.app;
    let qry = '';

    qry = `INSERT INTO ME_TEMP_VENTAS 
            (EMPNIT,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,EXENTO,USUARIO,TIPOPRECIO,CODSUCURSAL) 
    VALUES ('${empnit}','${codprod}','${desprod}','${codmedida}',${cantidad},${equivale},${totalunidades},${costo},${precio},${totalcosto},${totalprecio},${exento},'${usuario}','${tipoprecio}','${app}')`        
     
        
   execute.Query(res,qry);

});

// elimina un item de la venta
router.delete("/tempVentas", async(req,res)=>{
    let id=Number(req.body.id);
    

      let qry = `DELETE FROM ME_TEMP_VENTAS WHERE ID=${id}`
    
   execute.Query(res,qry);

});

// elimina un item de la venta todos 
router.post("/tempVentastodos", async(req,res)=>{
    const{empnit,usuario,app} = req.body;
    let qry = "";
   
    qry = `DELETE FROM ME_TEMP_VENTAS WHERE CODSUCURSAL='${app}' AND USUARIO='${usuario}'`

    execute.Query(res,qry);

});

// SIN USAR
// VENTAS BUSCAR CLIENTE POR NIT O CODIGO
router.get("/buscarcliente", async(req,res)=>{
    
    const {empnit,nit, app} = req.query;
    
    let qry = '';

    qry = `SELECT NITCLIE AS CODCLIENTE,NITFACTURA AS NIT,NOMCLIE AS NOMCLIENTE,DIRCLIE AS DIRCLIENTE,TIPOCLIE AS CATEGORIA FROM ME_CLIENTES WHERE NITCLIE='${nit}' AND CODSUCURSAL='${app}'`         

    execute.Query(res,qry);

});

// INSERTA UN PEDIDO EN LAS TABLAS DE DOCUMENTOS Y DOCPRODUCTOS
router.post("/documentos", async (req,res)=>{
    
    const {app,empnit,anio,mes,dia,coddoc,fecha,fechaentrega,formaentrega,codcliente,nomclie,codbodega,totalcosto,totalprecio,nitclie,dirclie,obs,direntrega,usuario,codven,lat,long} = req.body;
    

    let correlativo = req.body.correlativo;
    let ncorrelativo = correlativo;

    //variables sin asignar
    let concre = 'CRE';
    let abono = totalprecio; 
    let saldo = totalprecio;
    let pagotarjeta = 0; let recargotarjeta = 0;
    let codrep = 0;
    let totalexento=0;

    switch (correlativo.toString().length) {
        case 1:
            correlativo = '         ' + correlativo;
        break;
        case 2:
            correlativo = '        ' + correlativo;
        break;
        case 3:
            correlativo = '       ' + correlativo;
            
        break;
        case 4:
            correlativo = '      ' + correlativo;
            break;
        case 5:
            correlativo = '     ' + correlativo;
            break;
        case 6:
            correlativo = '    ' + correlativo;
            break;
        case 7:
            correlativo = '   ' + correlativo;
            break;
        case 8:
            correlativo = '  ' + correlativo;
        break;
        case 9:
            correlativo = ' ' + correlativo;
        break;
        case 10:
            correlativo = correlativo;
        break;
        default:
            break;
    };
    
    let nuevocorrelativo = Number(ncorrelativo) + 1;


    let qry = ''; // inserta los datos en la tabla documentos
    let qrydoc = ''; // inserta los datos de la tabla docproductos
    let qrycorrelativo = ''; //actualiza el correlativo del documento

            qry = `INSERT INTO ME_DOCUMENTOS (
                EMP_NIT, DOC_ANO, DOC_MES, CODDOC, DOC_NUMERO, 
                CODCAJA, DOC_FECHA, DOC_NUMREF, DOC_NOMREF, BODEGAENTRADA,
                BODEGASALIDA, USUARIO, DOC_ESTATUS, DOC_TOTALCOSTO, DOC_TOTALVENTA,
                DOC_HORA, DOC_FVENCE, DOC_DIASCREDITO, DOC_CONTADOCREDITO, DOC_DESCUENTOTOTAL,
                DOC_DESCUENTOPROD, DOC_PORDESCUTOTAL, DOC_IVA, DOC_SUBTOTALIVA, DOC_SUBTOTAL,
                NITCLIE, DOC_PORDESCUFAC, CODVEN, DOC_ABONOS, DOC_SALDO,
                DOC_VUELTO, DOC_NIT, DOC_PAGO, DOC_CODREF, DOC_TIPOCAMBIO,
                DOC_PARCIAL, DOC_ANTICIPO, ANT_CODDOC, ANT_DOCNUMERO, DOC_OBS,
                DOC_PORCENTAJEIVA, DOC_ENVIO, DOC_CUOTAS, DOC_TIPOCUOTA, 
                DIVA_NUMINT, FRT_CODIGO, TRANSPORTE, DOC_REFPEDIDO, DOC_REFFACTURA,
                CODPROV, DOC_TOTALOTROS, DOC_RECIBO, DOC_MATSOLI, DOC_REFERENCIA, 
                DOC_LUGAR, DOC_ANOMBREDE, DOC_IVAEXO, DOC_VALOREXO, DOC_SECTOR,
                DOC_DIRENTREGA, DOC_CANTENV, DOC_EXP, DOC_FECHAENT, TIPOPRODUCCION,
                DOC_TOTCOSINV, DOC_TOTALFIN, USUARIOENUSO, DOC_IMPUESTO1, DOC_TOTALIMPU1,
                DOC_PORCOMI, DOC_DOLARES, CODMESA, DOC_TIPOOPE, USUARIOAUTORIZA, 
                NUMAUTORIZA, DOC_TEMPORADA, DOC_INGUAT,
                CODVENBOD,
                CODHABI, DOC_SERIE,
                CTABAN, NUMINTBAN, 
                CODVENEMP,
                DOC_TOTCOSDOL, DOC_TOTCOSINVDOL, CODUNIDAD,
                TOTCOMBUSTIBLE, DOC_CODCONTRA, DOC_NUMCONTRA, INTERES, ABONOINTERES,
                SALDOINTERES, NUMEROCORTE, DOC_PORLOCAL, DOC_NUMORDEN, DOC_FENTREGA,
                DOC_INTERESADO, DOC_RECIBE, NUMEROROLLO, COD_CENTRO, GENCUOTA,
                DOC_PORINGUAT, DOC_INGUATEXENTO, DOC_TIPOTRANIVA, DOC_PORTIMBREPRE, DOC_TIMBREPRENSA,
                ABONOSANTICIPO, SALDOANTICIPO, DOC_PRODEXENTO, PUNTOSGANADOS, PUNTOSUSADOS,
                APL_ANTICIPO, COD_DEPARTA, FIRMAELECTRONICA, DOC_CODDOCRETENCION, DOC_SERIERETENCION,
                DOC_NUMRETENCION, FIRMAISC, ISCENVIADO, LAT, LONG, CODSUCURSAL
                ) 
                VALUES (
                '${empnit}', ${anio}, ${mes}, '${coddoc}', '${correlativo}',
                '', '${fecha}', '', '${nomclie}', '',
                '${codbodega}', '${usuario}', 'O', ${totalcosto}, ${totalprecio},
                0, '${fecha}', 0, '${concre}', 0,
                0, 0, 0, ${totalprecio}, ${totalprecio},
                '${nitclie}', 0, '${codven}', 0, ${saldo}, 
                0, '${nitclie}', 0, '', 1, 
                0, 0, '', '', '${obs}',
                0, 0, 0, 0, 
                0, '', '${formaentrega}', '', '',
                '', 0, 0, '${direntrega}', '', 
                '', '', '', 0, '', 
                '${dirclie}', '', '', '${fechaentrega}', '',
                ${totalcosto}, 0, '', 0, 0,
                0, 0, '', 0,'',
                0, 0, 0,
                0,
                '', '', 
                0, 0, 
                0,
                0, 0, '',
                0, '', '', 0, 0, 
                0, 0, 0, '','NO',
                '', '', 0, '', '',
                0, 'N', 'C', 0, 0,
                0, 0, 0, 0, 0,
                '', '', '', '', '',
                '', '', 0, ${lat},${long},'${app}'
                );`
                  //GETANSINULL()
            qrydoc = `INSERT INTO ME_DOCPRODUCTOS 
                  (EMP_NIT,DOC_ANO,DOC_MES,CODDOC,DOC_NUMERO,
                  DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD,EQUIVALE,
                  CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,
                  BODEGAENTRADA,BODEGASALIDA,SUBTOTAL,DESCUENTOPROD,PORDESCUPROD,
                  DESCUENTOFAC,PORDESCUFAC,TOTALDESCUENTO,DESCRIPCION,SUBTOTALPROD,
                  TIPOCAMBIO,PRODPRECIO,CANTIDADENVIADA,CODFAC,NUMFAC,
                  ITEMFAC,NOAFECTAINV, DOCPESO,COSTOINV,FLETE,TOTALPRECIOFIN,PRECIOFIN,TOTALCOSTOINV,CANTIDADBONI,CODOPR,NUMOPR,
                  ITEMOPR,CODINV,NUMINV,ITEMINV,TIPOCLIE,LISTA,PORIVA,VALORIVA,NOLOTE,VALORIMPU1,DESEMPAQUE,
                  SALDOINVANTCOM,NCUENTAMESA,CUENTACERRADA,COSTODOL,COSTOINVDOL,TOTALCOSTODOL,TOTALCOSTOINVDOL,
                  IMPCOMBUSTIBLE,CODVENPROD,COMIVEN,SOBREPRECIO,CODREG,NUMREG,ITEMREG,CANTIDADORIGINAL,CANTIDADMODIFICADA,NSERIETARJETA,
                  CODOC,NUMOC,PORTIMBREPRENSA,VALORTIMBREPRENSA,CODTIPODESCU,TOTALPUNTOS,ITEMOC,CODPRODORIGEN,CODMEDIDAORIGEN,
                  CANTIDADDEVUELTA,CODARANCEL,TIPOPRECIO,CODSUCURSAL) 
                  SELECT 
                  EMPNIT,${anio} as DOC_ANO,${mes} AS DOC_MES,'${coddoc}' AS CODDOC,'${correlativo}' AS DOC_NUMERO,
                  ID AS DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD, EQUIVALE,
                  TOTALUNIDADES AS CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,
                  '','${codbodega}',
                  TOTALPRECIO,0,0,0,0,0,DESPROD,TOTALPRECIO,1,PRECIO,0,'','',0,0,
                  0,COSTO,0,TOTALPRECIO,
                  PRECIO,TOTALCOSTO,0,'','',0,'','',0,
                  'P',
                  '',
                  0,0,'SN',0,'',0,'',0,0,COSTO,0,TOTALCOSTO,0,0,0,0,'','',0,0,0,'','','',0,0,'',0,0,'','',0,'',TIPOPRECIO,'${app}'
                  FROM ME_TEMP_VENTAS   
                  WHERE EMPNIT='${empnit}' AND USUARIO='${usuario}';`
            qrycorrelativo =`UPDATE ME_TIPODOCUMENTOS SET CORRELATIVO=${nuevocorrelativo} WHERE CODSUCURSAL='${app}' AND CODDOC='${coddoc}';`
            
 
    execute.Query(res,qrycorrelativo + qry + qrydoc);
    
});





//******************************* */
// REPORTES DE VENDEDORES
//******************************* */

router.post('/historialcliente',async (req,res)=>{
    const {sucursal,codcliente} = req.body;
    let qry = `
    SELECT ME_Documentos.CODDOC, ME_Documentos.DOC_NUMERO AS CORRELATIVO, ME_Documentos.DOC_FECHA AS FECHA, ME_Documentos.NITCLIE, ME_Docproductos.CODPROD, ME_Docproductos.DESCRIPCION AS DESPROD,
                          ME_Docproductos.CODMEDIDA, ME_Docproductos.CANTIDAD, ME_Docproductos.PRECIO, ME_Docproductos.TOTALPRECIO
    FROM ME_Documentos LEFT OUTER JOIN
                         ME_Docproductos ON ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND 
                         ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT LEFT OUTER JOIN
                         ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND 
                         ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
    WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.NITCLIE = '${codcliente}') ORDER BY ME_Documentos.DOC_FECHA DESC
    `;

    execute.Query(res,qry);
})

// UNA FECHA (DIA)

//Elimina un pedido, desde el vendedor
router.post("/deletepedidovendedor",async(req,res)=>{
    const {sucursal,fecha,codven,coddoc,correlativo} = req.body;

    let qry = `DELETE FROM ME_DOCUMENTOS WHERE CODSUCURSAL='${sucursal}' AND CODDOC='${coddoc}' AND DOC_FECHA='${fecha}' AND DOC_NUMERO='${correlativo}' AND DOC_ESTATUS='O'; `
    let qryprods = `DELETE FROM ME_DOCPRODUCTOS WHERE CODSUCURSAL='${sucursal}' AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}' ;`
    execute.Query(res, qry + qryprods);

})


//LOGRO MES
router.post("/logromesvendedor", async(req,res)=>{
    const {sucursal,codven,mes,anio}  = req.body;
    
    let qry = '';
    
    qry = `
    SELECT  COUNT(ME_Documentos.DOC_NUMERO) AS PEDIDOS, ISNULL(SUM(ME_Documentos.DOC_TOTALVENTA), 0) AS IMPORTE, ME_USUARIOS.OBJETIVOMES AS OBJETIVO
    FROM  ME_Documentos LEFT OUTER JOIN
                             ME_USUARIOS ON ME_Documentos.CODVEN = ME_USUARIOS.CODUSUARIO AND ME_Documentos.CODSUCURSAL = ME_USUARIOS.CODSUCURSAL
    WHERE (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.CODVEN = 1) AND (ME_Documentos.DOC_ESTATUS <> 'A')
    GROUP BY ME_USUARIOS.OBJETIVOMES, ME_USUARIOS.TIPO, ME_Documentos.DOC_ANO, ME_Documentos.DOC_MES
    HAVING  (ME_USUARIOS.TIPO = 'VENDEDOR') AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes})
    `

    execute.Query(res,qry);
});


// TOTAL VENTAS Y TOTAL PEDIDOS POR FECHA
router.post("/totalventadia", async(req,res)=>{
    const {sucursal,codven,fecha}  = req.body;
    
    let qry = '';
    qry = `SELECT COUNT(DOC_NUMERO) AS PEDIDOS, ISNULL(SUM(DOC_TOTALVENTA),0) AS IMPORTE
            FROM ME_Documentos
            WHERE (CODSUCURSAL ='${sucursal}') AND (DOC_FECHA = '${fecha}') AND (CODVEN = ${codven}) AND (DOC_ESTATUS<>'A')`
        
    execute.Query(res,qry);
});

// LISTA DE PEDIDOS POR UNA FECHA
router.post("/listapedidos", async(req,res)=>{
    const {sucursal,codven,fecha}  = req.body;
    
    let qry = '';
    qry = `SELECT  ME_Clientes.NITFACTURA AS NIT, 
                    ME_Documentos.CODDOC, 
                    ME_Documentos.DOC_NUMERO AS CORRELATIVO, 
                    ME_Documentos.NITCLIE AS CODCLIE, 
                    ME_Clientes.NOMFAC AS NEGOCIO, 
                    ME_Documentos.DOC_NOMREF AS NOMCLIE, 
                    ME_Documentos.DOC_DIRENTREGA AS DIRCLIE, 
                    '' AS DESMUNI, 
                    ISNULL(ME_Documentos.DOC_TOTALVENTA, 0) AS IMPORTE, 
                    ME_Documentos.DOC_FECHA AS FECHA, 
                    ME_Documentos.LAT, 
                    ME_Documentos.LONG, 
                    ME_Documentos.DOC_OBS AS OBS, 
                    ME_Documentos.DOC_MATSOLI AS DIRENTREGA, 
                    ME_Documentos.DOC_ESTATUS AS ST,
                    ISNULL(ME_Documentos.FEL_UDDI,'SN') AS FEL_UDDI, 
                    ME_Documentos.FEL_SERIE, 
                    ME_Documentos.FEL_NUMERO, 
                    ME_Documentos.FEL_FECHA
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Clientes ON ME_Documentos.NITCLIE = ME_Clientes.NITCLIE AND ME_Documentos.CODSUCURSAL = ME_Clientes.CODSUCURSAL
    WHERE        (ME_Documentos.CODSUCURSAL = '${sucursal}') 
                AND (ME_Documentos.DOC_FECHA = '${fecha}') AND (ME_Documentos.CODVEN = ${codven}) 
                AND (ME_Documentos.DOC_ESTATUS <> 'A')
    ORDER BY ME_Documentos.DOC_NUMERO DESC`

    
    execute.Query(res,qry);
});

// LISTA DE PEDIDOS POR UNA FECHA
router.post("/BACKUP_listapedidos", async(req,res)=>{
    const {sucursal,codven,fecha}  = req.body;
    
    let qry = '';
    qry = `SELECT CODDOC, DOC_NUMERO AS CORRELATIVO, NITCLIE AS CODCLIE, DOC_NOMREF AS NOMCLIE, DOC_DIRENTREGA AS DIRCLIE, '' AS DESMUNI, ISNULL(DOC_TOTALVENTA,0) AS IMPORTE, DOC_FECHA AS FECHA, LAT, LONG, DOC_OBS AS OBS, DOC_MATSOLI AS DIRENTREGA, DOC_ESTATUS AS ST
            FROM ME_Documentos
            WHERE (CODSUCURSAL = '${sucursal}') AND (DOC_FECHA = '${fecha}') AND (CODVEN = ${codven}) AND (DOC_ESTATUS<>'A')`

    
    execute.Query(res,qry);
});


//reporte de productos del dia y vendedor
router.post('/reporteproductosdia', async(req,res)=>{
    
    const {fecha,sucursal,codven} = req.body;

    let qry = `SELECT ISNULL(ME_Docproductos.CODPROD,'SN') AS CODPROD, ISNULL(ME_Productos.DESPROD, 'SN') AS DESPROD, SUM(ISNULL(ME_Docproductos.CANTIDADINV,0)) AS TOTALUNIDADES, SUM(ISNULL(ME_Docproductos.TOTALCOSTO,0)) AS TOTALCOSTO, SUM(ISNULL(ME_Docproductos.TOTALPRECIO,0)) 
    AS TOTALPRECIO
    FROM ME_Docproductos LEFT OUTER JOIN
    ME_Productos ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND ME_Docproductos.CODPROD = ME_Productos.CODPROD RIGHT OUTER JOIN
    ME_Documentos ON ME_Docproductos.DOC_NUMERO = ME_Documentos.DOC_NUMERO AND ME_Docproductos.CODDOC = ME_Documentos.CODDOC AND 
    ME_Docproductos.CODSUCURSAL = ME_Documentos.CODSUCURSAL AND ME_Docproductos.DOC_ANO = ME_Documentos.DOC_ANO AND ME_Docproductos.EMP_NIT = ME_Documentos.EMP_NIT LEFT OUTER JOIN
    ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
    WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_FECHA = '${fecha}') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.DOC_ESTATUS<>'A')
    GROUP BY ME_Docproductos.CODPROD, ME_Productos.DESPROD`;
    
    execute.Query(res,qry);

});

// reporte de marcas por vendedor y dia
router.post('/reportemarcasdia',async(req,res)=>{

    const {fecha,sucursal,codven} = req.body;

    let qry = `SELECT  ISNULL(ME_Marcas.DESMARCA, 'SN') AS DESMARCA, 
    ISNULL(SUM(ME_Docproductos.TOTALCOSTO),0) AS TOTALCOSTO, 
    ISNULL(SUM(ME_Docproductos.TOTALPRECIO),0) AS TOTALPRECIO,
    ISNULL(SUM(ME_Docproductos.CANTIDADINV),0) AS FARDOS
    FROM            ME_Productos LEFT OUTER JOIN
                             ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA RIGHT OUTER JOIN
                             ME_Docproductos ON ME_Productos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Productos.CODPROD = ME_Docproductos.CODPROD RIGHT OUTER JOIN
                             ME_Documentos ON ME_Docproductos.DOC_MES = ME_Documentos.DOC_MES AND ME_Docproductos.DOC_ANO = ME_Documentos.DOC_ANO AND ME_Docproductos.EMP_NIT = ME_Documentos.EMP_NIT AND 
                             ME_Docproductos.CODDOC = ME_Documentos.CODDOC AND ME_Docproductos.DOC_NUMERO = ME_Documentos.DOC_NUMERO LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.DOC_FECHA = '${fecha}') AND 
                             (ME_Documentos.CODSUCURSAL = '${sucursal}')
                GROUP BY ME_Marcas.DESMARCA`;

    execute.Query(res,qry);

});

// MENSUALES
//reporte de fechas por vendedor y mes
router.post("/reportedinero", async (req,res)=>{

    const {anio,mes,sucursal,codven} = req.body;

    let qry = `SELECT       ME_Documentos.DOC_FECHA AS FECHA, COUNT(ME_Documentos.DOC_FECHA) AS PEDIDOS, SUM(ISNULL(ME_Documentos.DOC_TOTALVENTA,0)) AS TOTALVENTA
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Tipodocumentos.TIPODOC = 'PED') AND 
                             (ME_Documentos.DOC_ESTATUS <> 'A')
                GROUP BY ME_Documentos.DOC_FECHA`;
    
    execute.Query(res,qry);
                             
});

//reporte de productos por mes y vendedo
router.post('/reporteproductos', async(req,res)=>{
    
    const {anio,mes,sucursal,codven} = req.body;

    let qry = `SELECT ISNULL(ME_Docproductos.CODPROD,'SN') AS CODPROD, ISNULL(ME_Productos.DESPROD,'SN') AS DESPROD, SUM(ISNULL(ME_Docproductos.CANTIDADINV,0)) AS TOTALUNIDADES, SUM(ISNULL(ME_Docproductos.TOTALCOSTO,0)) AS TOTALCOSTO, SUM(ISNULL(ME_Docproductos.TOTALPRECIO,0)) 
    AS TOTALPRECIO
FROM            ME_Docproductos LEFT OUTER JOIN
    ME_Productos ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND ME_Docproductos.CODPROD = ME_Productos.CODPROD RIGHT OUTER JOIN
    ME_Documentos ON ME_Docproductos.DOC_NUMERO = ME_Documentos.DOC_NUMERO AND ME_Docproductos.CODDOC = ME_Documentos.CODDOC AND 
    ME_Docproductos.CODSUCURSAL = ME_Documentos.CODSUCURSAL AND ME_Docproductos.DOC_ANO = ME_Documentos.DOC_ANO AND ME_Docproductos.EMP_NIT = ME_Documentos.EMP_NIT LEFT OUTER JOIN
    ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
            WHERE (ME_Documentos.DOC_ESTATUS<>'A') AND (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.CODVEN = ${codven})
            GROUP BY ME_Docproductos.CODPROD, ME_Productos.DESPROD`;
    
    execute.Query(res,qry);

});


// reporte de marcas por vendedor y mes
router.post('/reportemarcas',async(req,res)=>{

    const {anio,mes,sucursal,codven} = req.body;

    let qry = `SELECT ISNULL(ME_Marcas.DESMARCA,0) AS DESMARCA, 
        ISNULL(SUM(ME_Docproductos.TOTALCOSTO),0) AS TOTALCOSTO, 
        ISNULL(SUM(ME_Docproductos.TOTALPRECIO),0) AS TOTALPRECIO
    FROM            ME_Marcas RIGHT OUTER JOIN
                             ME_Productos ON ME_Marcas.CODSUCURSAL = ME_Productos.CODSUCURSAL AND ME_Marcas.CODMARCA = ME_Productos.CODMARCA RIGHT OUTER JOIN
                             ME_Documentos LEFT OUTER JOIN
                             ME_Docproductos ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_MES = ME_Docproductos.DOC_MES AND ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND 
                             ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO ON 
                             ME_Productos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Productos.CODPROD = ME_Docproductos.CODPROD LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ANO = ${anio}) AND 
                             (ME_Documentos.CODSUCURSAL = '${sucursal}')
                GROUP BY ME_Marcas.DESMARCA`;

                

    execute.Query(res,qry);


});

// reporte de locaciones por vendedor y mes
router.post('/reportelocaciones',async(req,res)=>{

    const {anio,mes,sucursal,codven} = req.body;

    let qry = `
    SELECT ME_Documentos.DOC_FECHA AS FECHA, ME_Documentos.DOC_NOMREF AS CLIENTE, COUNT(ME_Documentos.DOC_FECHA) AS PEDIDOS, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALVENTA, ME_Documentos.LAT, ME_Documentos.LONG
    FROM ME_Documentos LEFT OUTER JOIN ME_Tipodocumentos ON ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
    WHERE (ME_Documentos.DOC_ANO = ${anio}) 
            AND (ME_Documentos.DOC_MES = ${mes}) 
            AND (ME_Documentos.CODVEN = ${codven}) 
            AND (ME_Documentos.CODSUCURSAL = '${sucursal}') 
            AND (ME_Tipodocumentos.TIPODOC = 'PED') 
            AND (ME_Documentos.DOC_ESTATUS <> 'A')
    GROUP BY ME_Documentos.DOC_FECHA, ME_Documentos.DOC_NOMREF, ME_Documentos.LAT, ME_Documentos.LONG`;

    execute.Query(res,qry);

});


//******************************* */
// REPORTES DE GERENCIA
//******************************* */

// reporte de sucursales ventas
router.post('/rptsucursalesventas',async(req,res)=>{

    const {anio,mes} = req.body;

    let qry = `SELECT ME_Sucursales.NOMBRE AS SUCURSAL, SUM(ME_Documentos.DOC_TOTALCOSTO) AS COSTO, SUM(ME_Documentos.DOC_TOTALVENTA) AS IMPORTE, Me_Sucursales.COLOR
                    FROM     ME_Documentos LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND 
                             ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT LEFT OUTER JOIN
                             ME_Sucursales ON ME_Documentos.CODSUCURSAL = ME_Sucursales.CODSUCURSAL
                    WHERE   (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Tipodocumentos.TIPODOC = 'PED')
                    GROUP BY ME_Sucursales.NOMBRE, ME_Sucursales.COLOR`;

    execute.Query(res,qry);

});

// ranking de vendedores / datos del host
router.post('/rptrankingvendedores', async(req,res)=>{
    const {anio,mes} = req.body;
    let qry = `SELECT ME_Vendedores.NOMVEN, ME_Sucursales.NOMBRE AS SUCURSAL, SUM(ME_Documentos.DOC_TOTALCOSTO) AS TOTALCOSTO, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALPRECIO
                FROM ME_Documentos LEFT OUTER JOIN
                ME_Vendedores ON ME_Documentos.CODVEN = ME_Vendedores.CODVEN AND ME_Documentos.CODSUCURSAL = ME_Vendedores.CODSUCURSAL LEFT OUTER JOIN
                ME_Sucursales ON ME_Vendedores.CODSUCURSAL = ME_Sucursales.CODSUCURSAL
                WHERE (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes})
                GROUP BY ME_Vendedores.NOMVEN, ME_Sucursales.NOMBRE
                ORDER BY TOTALPRECIO DESC`;
    
    execute.Query(res,qry);
});


// reporte de sucursales ventas - DATOS DE LA SUCURSAL
router.post('/rptsucursalesventassucursales',async(req,res)=>{

    const {anio,mes} = req.body;

    let qry = `SELECT ME_Sucursales.COLOR, ME_RPT_VENTAS.CODSUCURSAL AS SUCURSAL, ME_Sucursales.NOMBRE AS NOMSUCURSAL, SUM(ME_RPT_VENTAS.TOTALPRECIO) AS IMPORTE
    FROM            ME_RPT_VENTAS LEFT OUTER JOIN
                             ME_Sucursales ON ME_RPT_VENTAS.CODSUCURSAL = ME_Sucursales.CODSUCURSAL
    WHERE        (ME_RPT_VENTAS.ANIO =${anio}) AND (ME_RPT_VENTAS.MES = ${mes})
    GROUP BY ME_Sucursales.COLOR, ME_RPT_VENTAS.CODSUCURSAL, ME_Sucursales.NOMBRE`;

    execute.Query(res,qry);

});
// ranking de vendedores / datos de la sucursal
router.post('/rptrankingvendedoressucursal', async(req,res)=>{
    const {anio,mes} = req.body;
    let qry = `SELECT        NOMVEN, SUM(TOTALPRECIO) AS TOTALPRECIO, CODSUCURSAL AS SUCURSAL
    FROM            ME_RPT_VENTAS
    WHERE        (ANIO = ${anio}) AND (MES = ${mes})
    GROUP BY NOMVEN, CODSUCURSAL
    ORDER BY TOTALPRECIO DESC`;
    
    execute.Query(res,qry);
});




//******************************* */
// REPORTES DE SUPERVISOR
//******************************* */


// ranking de vendedores por sucursal y fecha
router.post('/rptrankingvendedoressucursal2', async(req,res)=>{
    const {fecha,sucursal} = req.body;
    let qry = `SELECT       ME_Vendedores.NOMVEN, COUNT(ME_Documentos.CODDOC) AS PEDIDOS, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Vendedores ON ME_Documentos.CODVEN = ME_Vendedores.CODVEN AND ME_Documentos.CODSUCURSAL = ME_Vendedores.CODSUCURSAL
                WHERE (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_FECHA = '${fecha}')
                GROUP BY ME_Vendedores.NOMVEN
                ORDER BY TOTALPRECIO DESC`;
    
    execute.Query(res,qry);
});

// ranking de vendedores por sucursal y fecha
router.post('/rptrankingvendedoressucursalmes', async(req,res)=>{
    const {anio,mes,sucursal} = req.body;

    let qry = `SELECT  ME_Vendedores.NOMVEN, COUNT(ME_Documentos.CODDOC) AS PEDIDOS, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Vendedores ON ME_Documentos.CODVEN = ME_Vendedores.CODVEN AND ME_Documentos.CODSUCURSAL = ME_Vendedores.CODSUCURSAL
                WHERE (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes})
                GROUP BY ME_Vendedores.NOMVEN
                ORDER BY TOTALPRECIO DESC`;
    

                //console.log(qry);
                
    execute.Query(res,qry);
});

// reporte de marcas por fecha
router.post('/reportemarcasfecha',async(req,res)=>{

    const {sucursal,fecha} = req.body;

    let qry = `SELECT       ME_Marcas.DESMARCA, SUM(ME_Docproductos.TOTALCOSTO) AS TOTALCOSTO, SUM(ME_Docproductos.TOTALPRECIO) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Docproductos LEFT OUTER JOIN
                             ME_Productos LEFT OUTER JOIN
                             ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND 
                             ME_Docproductos.CODPROD = ME_Productos.CODPROD ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_MES = ME_Docproductos.DOC_MES AND 
                             ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND 
                             ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_FECHA = '${fecha}')
                GROUP BY ME_Marcas.DESMARCA`;

                

    execute.Query(res,qry);


});

// reporte de marcas por mes
router.post('/reportemarcasmes',async(req,res)=>{

    const {anio,mes,sucursal} = req.body;

    let qry = `SELECT ISNULL(ME_Marcas.DESMARCA,'SN') AS DESMARCA, SUM(ISNULL(ME_Docproductos.TOTALCOSTO,0)) AS TOTALCOSTO, SUM(ISNULL(ME_Docproductos.TOTALPRECIO,0)) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Docproductos LEFT OUTER JOIN
                             ME_Productos LEFT OUTER JOIN
                             ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND 
                             ME_Docproductos.CODPROD = ME_Productos.CODPROD ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_MES = ME_Docproductos.DOC_MES AND 
                             ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND 
                             ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ANO = ${anio}) AND 
                             (ME_Documentos.CODSUCURSAL = '${sucursal}')
                GROUP BY ME_Marcas.DESMARCA`;

                

    execute.Query(res,qry);


});


// INSERTA UN PEDIDO EN LAS TABLAS DE me-DOCUMENTOS Y me-DOCPRODUCTOS
router.post("/backup_insertventa", async (req,res)=>{
    
    const {jsondocproductos,codsucursal,empnit,anio,mes,dia,coddoc,correl,fecha,fechaentrega,formaentrega,codcliente,nomclie,codbodega,totalcosto,totalprecio,nitclie,dirclie,obs,direntrega,usuario,codven,lat,long,hora,nitdoc,fecha_operacion} = req.body;
  
    let app = codsucursal;
  
    let tblDocproductos = JSON.parse(jsondocproductos);
   
    let qry = ''; // inserta los datos en la tabla documentos
    let qrydoc = ''; // inserta los datos de la tabla docproductos
    let qrycorrelativo = ''; //actualiza el correlativo del documento

    let correlativo = correl;
    //carga los espacios en blanco en el correlativo actual
    correlativo = getCorrelativo(correlativo);

    tblDocproductos.map((p)=>{
        qrydoc = qrydoc + `INSERT INTO ME_DOCPRODUCTOS 
        (EMP_NIT,DOC_ANO,DOC_MES,CODDOC,DOC_NUMERO,
        DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD,EQUIVALE,
        CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,
        BODEGAENTRADA,BODEGASALIDA,SUBTOTAL,DESCUENTOPROD,PORDESCUPROD,
        DESCUENTOFAC,PORDESCUFAC,TOTALDESCUENTO,DESCRIPCION,SUBTOTALPROD,
        TIPOCAMBIO,PRODPRECIO,CANTIDADENVIADA,CODFAC,NUMFAC,
        ITEMFAC,NOAFECTAINV, DOCPESO,COSTOINV,FLETE,TOTALPRECIOFIN,PRECIOFIN,TOTALCOSTOINV,CANTIDADBONI,CODOPR,NUMOPR,
        ITEMOPR,CODINV,NUMINV,ITEMINV,TIPOCLIE,LISTA,PORIVA,VALORIVA,NOLOTE,VALORIMPU1,DESEMPAQUE,
        SALDOINVANTCOM,NCUENTAMESA,CUENTACERRADA,COSTODOL,COSTOINVDOL,TOTALCOSTODOL,TOTALCOSTOINVDOL,
        IMPCOMBUSTIBLE,CODVENPROD,COMIVEN,SOBREPRECIO,CODREG,NUMREG,ITEMREG,CANTIDADORIGINAL,CANTIDADMODIFICADA,NSERIETARJETA,
        CODOC,NUMOC,PORTIMBREPRENSA,VALORTIMBREPRENSA,CODTIPODESCU,TOTALPUNTOS,ITEMOC,CODPRODORIGEN,CODMEDIDAORIGEN,
        CANTIDADDEVUELTA,CODARANCEL,TIPOPRECIO,CODSUCURSAL) 
        VALUES ('${p.EMPNIT}',${anio},${mes},'${coddoc}','${correlativo}',
        ${p.ID},'${p.CODPROD}','${p.CODMEDIDA}',${p.CANTIDAD},${p.EQUIVALE},
        ${p.TOTALUNIDADES},${p.COSTO},${p.PRECIO},${p.TOTALCOSTO},${p.TOTALPRECIO},
        '','${codbodega}',${p.TOTALPRECIO},0,0,
        0,0,0,'${p.DESPROD}',${p.TOTALPRECIO},
        1,${p.PRECIO},0,'','',
        0,0,0,${p.COSTO},0,${p.TOTALPRECIO},
        ${p.PRECIO},${p.TOTALCOSTO},0,'','',0,'','',0,'P','',
         0,0,'SN',0,'',0,'',0,0,${p.COSTO},0,${p.TOTALCOSTO},0,0,0,0,'','',0,0,0,'','','',0,0,'',0,0,'','',0,'','${p.TIPOPRECIO}','${codsucursal}' 
        );`
    });


    //obtiene el número del correlativo actual para actualizar luego
    let ncorrelativo = correl;


    //variables sin asignar
    let concre = 'CRE';
    let abono = totalprecio; 
    let saldo = totalprecio;
    let pagotarjeta = 0; let recargotarjeta = 0;
    let codrep = 0;
    let totalexento=0;

  
    let nuevocorrelativo = Number(ncorrelativo) + 1;

            qry = `INSERT INTO ME_DOCUMENTOS (
                EMP_NIT, DOC_ANO, DOC_MES, CODDOC, DOC_NUMERO, 
                CODCAJA, DOC_FECHA, DOC_NUMREF, DOC_NOMREF, BODEGAENTRADA,
                BODEGASALIDA, USUARIO, DOC_ESTATUS, DOC_TOTALCOSTO, DOC_TOTALVENTA,
                DOC_HORA, DOC_FVENCE, DOC_DIASCREDITO, DOC_CONTADOCREDITO, DOC_DESCUENTOTOTAL,
                DOC_DESCUENTOPROD, DOC_PORDESCUTOTAL, DOC_IVA, DOC_SUBTOTALIVA, DOC_SUBTOTAL,
                NITCLIE, DOC_PORDESCUFAC, CODVEN, DOC_ABONOS, DOC_SALDO,
                DOC_VUELTO, DOC_NIT, DOC_PAGO, DOC_CODREF, DOC_TIPOCAMBIO,
                DOC_PARCIAL, DOC_ANTICIPO, ANT_CODDOC, ANT_DOCNUMERO, DOC_OBS,
                DOC_PORCENTAJEIVA, DOC_ENVIO, DOC_CUOTAS, DOC_TIPOCUOTA, 
                DIVA_NUMINT, FRT_CODIGO, TRANSPORTE, DOC_REFPEDIDO, DOC_REFFACTURA,
                CODPROV, DOC_TOTALOTROS, DOC_RECIBO, DOC_MATSOLI, DOC_REFERENCIA, 
                DOC_LUGAR, DOC_ANOMBREDE, DOC_IVAEXO, DOC_VALOREXO, DOC_SECTOR,
                DOC_DIRENTREGA, DOC_CANTENV, DOC_EXP, DOC_FECHAENT, TIPOPRODUCCION,
                DOC_TOTCOSINV, DOC_TOTALFIN, USUARIOENUSO, DOC_IMPUESTO1, DOC_TOTALIMPU1,
                DOC_PORCOMI, DOC_DOLARES, CODMESA, DOC_TIPOOPE, USUARIOAUTORIZA, 
                NUMAUTORIZA, DOC_TEMPORADA, DOC_INGUAT,
                CODVENBOD,
                CODHABI, DOC_SERIE,
                CTABAN, NUMINTBAN, 
                CODVENEMP,
                DOC_TOTCOSDOL, DOC_TOTCOSINVDOL, CODUNIDAD,
                TOTCOMBUSTIBLE, DOC_CODCONTRA, DOC_NUMCONTRA, INTERES, ABONOINTERES,
                SALDOINTERES, NUMEROCORTE, DOC_PORLOCAL, DOC_NUMORDEN, DOC_FENTREGA,
                DOC_INTERESADO, DOC_RECIBE, NUMEROROLLO, COD_CENTRO, GENCUOTA,
                DOC_PORINGUAT, DOC_INGUATEXENTO, DOC_TIPOTRANIVA, DOC_PORTIMBREPRE, DOC_TIMBREPRENSA,
                ABONOSANTICIPO, SALDOANTICIPO, DOC_PRODEXENTO, PUNTOSGANADOS, PUNTOSUSADOS,
                APL_ANTICIPO, COD_DEPARTA, FIRMAELECTRONICA, DOC_CODDOCRETENCION, DOC_SERIERETENCION,
                DOC_NUMRETENCION, FIRMAISC, ISCENVIADO, LAT, LONG, CODSUCURSAL, FECHA_OPERACION
                ) 
                VALUES (
                '${empnit}', ${anio}, ${mes}, '${coddoc}', '${correlativo}',
                '', '${fecha}', '', '${nomclie}', '',
                '${codbodega}', '${usuario}', 'O', ${totalcosto}, ${totalprecio},
                '${hora}', '${fecha}', 0, '${concre}', 0,
                0, 0, 0, ${totalprecio}, ${totalprecio},
                '${nitclie}', 0, '${codven}', 0, ${saldo}, 
                0, '${nitdoc}', 0, '', 1, 
                0, 0, '', '', '${obs}',
                0, 0, 0, 0, 
                0, '', '${formaentrega}', '', '',
                '', 0, 0, '${direntrega}', '', 
                '', '', '', 0, '', 
                '${dirclie}', '', '', '${fechaentrega}', '',
                ${totalcosto}, 0, '', 0, 0,
                0, 0, '', 0,'',
                0, 0, 0,
                0,
                '', '', 
                0, 0, 
                0,
                0, 0, '',
                0, '', '', 0, 0, 
                0, 0, 0, '','NO',
                '', '', 0, '', '',
                0, 'N', 'C', 0, 0,
                0, 0, 0, 0, 0,
                '', '', '', '', '',
                '', '', 0, ${lat},${long},'${app}','${fecha_operacion}'
                );`
                   
                qrycorrelativo =`
                    UPDATE TIPODOCUMENTOS 
                        SET CORRELATIVO=${nuevocorrelativo} 
                        WHERE EMP_NIT='${empnit}' AND CODDOC='${coddoc}';`
      
    execute.Query(res, qrycorrelativo + qry + qrydoc);
    
});

router.post("/updatecorrelativo", async (req,res)=>{

    const {codsucursal,coddoc,correlativo} = req.body;

    let nuevocorrelativo = Number(correlativo) + 1;

    let qrycorrelativo =`UPDATE ME_TIPODOCUMENTOS 
                            SET CORRELATIVO=${nuevocorrelativo} 
                            WHERE CODSUCURSAL='${codsucursal}' AND CODDOC='${coddoc}';
                        UPDATE ME_USUARIOS 
                            SET CORRELATIVO=${nuevocorrelativo} 
                            WHERE CODSUCURSAL='${codsucursal}' AND CODDOC='${coddoc}';`
    execute.Query(res,qrycorrelativo);

});

function getCorrelativo(correlativo){
    let numdoc = '';

    switch (correlativo.toString().length) {
        case 1:
            numdoc = '         ' + correlativo;
        break;
        case 2:
            numdoc = '        ' + correlativo;
        break;
        case 3:
            numdoc = '       ' + correlativo;
        break;
        case 4:
            numdoc = '      ' + correlativo;
            break;
        case 5:
            numdoc = '     ' + correlativo;
            break;
        case 6:
            numdoc = '    ' + correlativo;
            break;
        case 7:
            numdoc = '   ' + correlativo;
            break;
        case 8:
            numdoc = '  ' + correlativo;
        break;
        case 9:
            numdoc = ' ' + correlativo;
        break;
        case 10:
            numdoc = correlativo;
        break;
        default:
            break;
    };

    return numdoc;

};


// INSERTA UN PEDIDO EN LAS TABLAS DE me-DOCUMENTOS Y me-DOCPRODUCTOS
router.post("/insertventa", async (req,res)=>{
    
    const {jsondocproductos,sucursal,empnit,anio,mes,dia,coddoc,correl,tipoclie,fecha,fechaentrega,formaentrega,codcliente,nomclie,codbodega,totalcosto,totalprecio,nitclie,dirclie,obs,direntrega,usuario,codven,lat,long,hora,nitdoc,fecha_operacion,concre} = req.body;
  
    let tblDocproductos = JSON.parse(jsondocproductos);
   
    let qryDocumentos = ''; // inserta los datos en la tabla documentos
    let qryDocproductos = ''; // inserta los datos de la tabla docproductos
    let qryCorrelativo = ''; //actualiza el correlativo del documento

    let tipocambio = 7.8;

    //carga los espacios en blanco en el correlativo actual
    let correlativo = correl;
    correlativo = getCorrelativo(correlativo);

    let item = 0;
    tblDocproductos.map((p)=>{
        item += 1;
        qryDocproductos = qryDocproductos + `
        INSERT INTO [dbo].[Docproductos]
           ([EMP_NIT],[DOC_ANO],[DOC_MES],[CODDOC],[DOC_NUMERO],[DOC_ITEM],[CODPROD]
           ,[CODMEDIDA],[CANTIDAD],[EQUIVALE],[CANTIDADINV],[COSTO],[PRECIO],[TOTALCOSTO]
           ,[TOTALPRECIO],[BODEGAENTRADA],[BODEGASALIDA],[SUBTOTAL],[DESCUENTOPROD],[PORDESCUPROD]
           ,[DESCUENTOFAC],[PORDESCUFAC],[TOTALDESCUENTO],[DESCRIPCION],[SUBTOTALPROD],[TIPOCAMBIO]
           ,[PRODPRECIO],[CANTIDADENVIADA],[CODFAC],[NUMFAC],[ITEMFAC],[NOAFECTAINV]
           ,[PRODFVENCE],[DOCPESO],[COSTOINV],[FLETE],[TOTALPRECIOFIN],[PRECIOFIN],[TOTALCOSTOINV]
           ,[CANTIDADBONI],[CODOPR],[NUMOPR],[ITEMOPR],[CODINV],[NUMINV],[ITEMINV]
           ,[TIPOCLIE],[LISTA],[PORIVA],[VALORIVA],[NOLOTE],[VALORIMPU1],[DESEMPAQUE],[SALDOINVANTCOM]
           ,[NCUENTAMESA],[CUENTACERRADA],[COSTODOL],[COSTOINVDOL],[TOTALCOSTODOL],[TOTALCOSTOINVDOL]
           ,[IMPCOMBUSTIBLE],[CODVENPROD],[COMIVEN],[SOBREPRECIO],[CODREG],[NUMREG],[ITEMREG]
           ,[CANTIDADORIGINAL],[CANTIDADMODIFICADA],[NSERIETARJETA],[CODOC],[NUMOC],[PORTIMBREPRENSA]
           ,[VALORTIMBREPRENSA],[CODTIPODESCU],[TOTALPUNTOS],[ITEMOC],[CODPRODORIGEN],[CODMEDIDAORIGEN]
           ,[CANTIDADDEVUELTA],[CODARANCEL],[VALOR_IDB],[POR_IDB],[PRE_IDB],[CANTIDADPIEZAS],[COSTOINVBOD]
           ,[TOTCOSINVBOD],[COSTOINVCOM],[COSTOINVCOMBOD],[NITCLIEPROD],[CODPRODLEECODIGO],[CANTIDADRESERVA]
           ,[ANTICIPOPED],[CANTIDADPED],[CANTIDADINGRESADA],[TOMARDATOSINV])
     SELECT 
            '${sucursal}'AS EMP_NIT, ${2023} AS DOC_ANO, ${3} AS DOC_MES,	
            '${coddoc}' AS CODDOC, '${correlativo}' AS DOC_NUMERO, ${item} AS DOC_ITEM,	
            '${p.CODPROD}' AS CODPROD, '${p.CODMEDIDA}'AS CODMEDIDA,	${p.CANTIDAD} AS CANTIDAD,	
            ${p.EQUIVALE} AS EQUIVALE, ${p.TOTALUNIDADES} AS CANTIDADINV,	${p.COSTO} AS COSTO,	
            ${p.PRECIO} AS PRECIO, ${p.TOTALCOSTO} AS TOTALCOSTO,
            ${p.TOTALPRECIO} AS TOTALPRECIO, '' AS BODEGAENTRADA,	'${p.CODBODEGA}' AS BODEGASALIDA,	
            ${p.TOTALPRECIO} AS SUBTOTAL, ${0} AS DESCUENTOPROD, ${0} AS PORDESCUPROD,	
            0 AS DESCUENTOFAC,	0 AS PORDESCUFAC,	${0} AS TOTALDESCUENTO,	
            '${p.DESPROD}' AS DESCRIPCION, ${p.TOTALPRECIO} AS SUBTOTALPROD,	
            ${tipocambio} AS TIPOCAMBIO, ${p.PRECIO} AS PRODPRECIO, 
            ${p.TOTALUNIDADES} AS CANTIDADENVIADA,	
            '' AS CODFAC, '' AS NUMFAC, 0 AS ITEMFAC, 0 AS NOAFECTAINV,	'' AS PRODFVENCE, 0 AS DOCPESO,	
            ${p.COSTO} AS COSTOINV, 0 AS FLETE, 0 AS TOTALPRECIOFIN, 0 AS PRECIOFIN,	
            ${p.TOTALCOSTO} AS TOTALCOSTOINV, 0 AS CANTIDADBONI, '' AS CODOPR, '' AS NUMOPR, 
            0 AS ITEMOPR, '' AS CODINV, '' AS NUMINV, 0 AS ITEMINV,	
            '${tipoclie}' AS TIPOCLIE,	'${p.CODLISTA}' AS LISTA, 0 AS PORIVA, 0 AS VALORIVA,	
            '${p.NOLOTE}' AS NOLOTE, 0 AS VALORIMPU1, '' AS DESEMPAQUE,	0 AS SALDOINVANTCOM, '' AS NCUENTAMESA,	0 AS CUENTACERRADA,	
            0 AS COSTODOL,	${p.COSTO} AS COSTOINVDOL,	0 AS TOTALCOSTODOL,	
            ${p.TOTALCOSTO} AS TOTALCOSTOINVDOL,	
            0 AS IMPCOMBUSTIBLE, 0 AS CODVENPROD, 0 AS COMIVEN,	0 AS SOBREPRECIO, '' AS CODREG,	'' AS NUMREG, 0 AS ITEMREG,	
            0 AS CANTIDADORIGINAL,	0 AS CANTIDADMODIFICADA, '' AS NSERIETARJETA, '' AS CODOC, '' AS NUMOC,	0 AS PORTIMBREPRENSA,	
            0 AS VALORTIMBREPRENSA,	'' AS CODTIPODESCU,	0 AS TOTALPUNTOS, 0 AS ITEMOC, '' AS CODPRODORIGEN,	'' AS CODMEDIDAORIGEN,	
            0 AS CANTIDADDEVUELTA, '' AS CODARANCEL, 0 AS VALOR_IDB, 0 AS POR_IDB, 0 AS PRE_IDB, 1 AS CANTIDADPIEZAS,	
            0 AS COSTOINVBOD, 0 AS TOTCOSINVBOD, 0 AS COSTOINVCOM, 0 AS COSTOINVCOMBOD, '' AS NITCLIEPROD,	
            '${p.CODPROD}' AS CODPRODLEECODIGO, 0 AS CANTIDADRESERVA, 0 AS ANTICIPOPED, 0 AS CANTIDADPED, 0 AS CANTIDADINGRESADA,	
            0 AS TOMARDATOSINV;
        ;`
    });


    //obtiene el número del correlativo actual para actualizar luego
    let ncorrelativo = correl;


    //variables sin asignar
    let diascredito = 1;
    let por_descuento = 0;
    let totaldescuento = 0;
    let ivadocumento = 0;
    
    let abono = totalprecio; 
    let saldo = totalprecio;
    let pagotarjeta = 0; 
    let recargotarjeta = 0;
    let codrep = 0;
    let totalexento=0;

  
    let nuevocorrelativo = Number(ncorrelativo) + 1;

    qryDocumentos = `
INSERT INTO [dbo].[Documentos]
    ([EMP_NIT],[DOC_ANO],[DOC_MES],[CODDOC]
    ,[DOC_NUMERO],[CODCAJA],[DOC_FECHA],[DOC_NUMREF],[DOC_NOMREF],[BODEGAENTRADA],[BODEGASALIDA]
    ,[USUARIO],[DOC_ESTATUS],[DOC_TOTALCOSTO],[DOC_TOTALVENTA],[DOC_HORA],[DOC_FVENCE],[DOC_DIASCREDITO],[DOC_CONTADOCREDITO]
    ,[DOC_DESCUENTOTOTAL],[DOC_DESCUENTOPROD],[DOC_PORDESCUTOTAL],[DOC_IVA],[DOC_SUBTOTALIVA],[DOC_SUBTOTAL],[NITCLIE]
    ,[DOC_PORDESCUFAC],[CODVEN],[DOC_ABONOS],[DOC_SALDO],[DOC_VUELTO],[DOC_NIT],[DOC_PAGO]
    ,[DOC_CODREF],[DOC_TIPOCAMBIO],[DOC_PARCIAL],[DOC_ANTICIPO],[ANT_CODDOC],[ANT_DOCNUMERO],[DOC_OBS]
    ,[DOC_PORCENTAJEIVA],[DOC_ENVIO],[DOC_CUOTAS],[DOC_TIPOCUOTA],[DOC_FMODIFICA],[DIVA_NUMINT]
    ,[FRT_CODIGO],[TRANSPORTE],[DOC_REFPEDIDO],[DOC_REFFACTURA],[CODPROV],[DOC_TOTALOTROS]
    ,[DOC_RECIBO],[DOC_MATSOLI],[DOC_REFERENCIA],[DOC_LUGAR],[DOC_ANOMBREDE],[DOC_IVAEXO],[DOC_VALOREXO]
    ,[DOC_SECTOR],[DOC_DIRENTREGA],[DOC_CANTENV],[DOC_EXP],[DOC_FECHAENT],[TIPOPRODUCCION],[DOC_TOTCOSINV]
    ,[DOC_TOTALFIN],[USUARIOENUSO],[DOC_IMPUESTO1],[DOC_TOTALIMPU1],[DOC_PORCOMI],[DOC_DOLARES]
    ,[CODMESA],[DOC_TIPOOPE],[USUARIOAUTORIZA],[NUMAUTORIZA],[FECHAAUTORIZA],[HORAAUTORIZA],[DOC_TEMPORADA]
    ,[DOC_INGUAT],[FECHAINGBOD],[HORAINGBOD],[FECHASALBOD],[HORASALBOD],[CODVENBOD],[CODHABI],[DOC_SERIE],[DOC_FECHAFAC],[DOC_IVARETENIDO],[FECHARECBOD]
    ,[HORARECBOD],[CTABAN],[NUMINTBAN],[FECHARECEMP],[HORARECEMP],[FECHAINGEMP],[HORAINGEMP],[FECHASALEMP]
    ,[HORASALEMP],[CODVENEMP],[FECHARECFAC],[HORARECFAC],[FECHAINGFAC],[HORAINGFAC],[FECHASALFAC],[HORASALFAC]
    ,[FECHARECENT],[HORARECENT],[FECHAINGENT],[HORAINGENT],[FECHASALENT],[HORASALENT]
    ,[DOC_TOTCOSDOL],[DOC_TOTCOSINVDOL],[CODUNIDAD],[TOTCOMBUSTIBLE],[DOC_CODCONTRA],[DOC_NUMCONTRA] ,[INTERES]
    ,[ABONOINTERES],[SALDOINTERES],[NUMEROCORTE],[DOC_PORLOCAL],[DOC_NUMORDEN],[DOC_FENTREGA],[DOC_INTERESADO]
    ,[DOC_RECIBE],[NUMEROROLLO],[COD_CENTRO],[GENCUOTA],[DOC_PORINGUAT],[DOC_INGUATEXENTO],[DOC_TIPOTRANIVA]
    ,[DOC_PORTIMBREPRE],[DOC_TIMBREPRENSA],[ABONOSANTICIPO],[SALDOANTICIPO],[DOC_PRODEXENTO],[PUNTOSGANADOS]
    ,[PUNTOSUSADOS],[APL_ANTICIPO],[COD_DEPARTA],[FIRMAELECTRONICA],[DOC_CODDOCRETENCION],[DOC_SERIERETENCION]
    ,[DOC_NUMRETENCION],[FIRMAISC],[ISCENVIADO],[IDELECTRONICA],[INTERESFAC],[TOTAL_IDB],[TIPO_CONSTANCIA]
    ,[NUM_CONSTANCIA],[VALOR_CONSTANCIA],[CODDOCLIQ],[NUMDOCLIQ],[CODACTI],[GASTOLIQ],[DOC_TOTCOSINVBOD]
    ,[ITEM_EVENTOLIQ],[DOC_LATITUD],[DOC_LONGITUD],[DOC_NUMEROAPP],[DOC_FIRMA_VEN],[DOC_FIRMA_CLIE]
    ,[DOC_DESPACHADA],[DOC_SERIE_A],[DOC_REFFACTURA_A],[FIRMAELECTRONICA_A],[IDELECTRONICA_A]) 
SELECT 
        '${sucursal}' AS EMP_NIT, ${2023} AS DOC_ANO, ${3} AS DOC_MES, 	
        '${coddoc}' AS CODDOC, '${correlativo}' AS DOC_NUMERO, '' AS CODCAJA, '${fecha}' AS DOC_FECHA, 	
        '' AS DOC_NUMREF, '${nomclie}' AS DOC_NOMREF, '' AS BODEGAENTRADA, '${codbodega}' AS BODEGASALIDA, 	
        '${usuario}' AS USUARIO, 'I' AS DOC_ESTATUS, ${totalcosto} AS DOC_TOTALCOSTO, 
        ${totalprecio} AS DOC_TOTALVENTA, '00:00:00' AS DOC_HORA, 
        '${fecha}' AS DOC_FVENCE, ${diascredito} AS DOC_DIASCREDITO, 	
        '${concre}' AS DOC_CONTADOCREDITO, ${totaldescuento} AS DOC_DESCUENTOTOTAL, 	
        ${totaldescuento} AS DOC_DESCUENTOPROD, ${por_descuento} AS DOC_PORDESCUTOTAL, 	
        ${ivadocumento} AS DOC_IVA, ${totalprecio/1.12} AS DOC_SUBTOTALIVA, 	
        ${(totalprecio - totaldescuento)} AS DOC_SUBTOTAL, '${nitclie}' AS NITCLIE, 
        0 AS DOC_PORDESCUFAC, 0 AS CODVEN, 0 AS DOC_ABONOS, 
        0 AS DOC_SALDO, 0 AS DOC_VUELTO, '${nitclie}' AS DOC_NIT, 0 AS DOC_PAGO, 	
        ''AS DOC_CODREF, ${tipocambio} AS DOC_TIPOCAMBIO, 0 AS DOC_PARCIAL, 	
        0 AS DOC_ANTICIPO, 	''AS ANT_CODDOC, ''AS ANT_DOCNUMERO, '' AS DOC_OBS, 	
        0 AS DOC_PORCENTAJEIVA, 0 AS DOC_ENVIO, 0 AS DOC_CUOTAS, 	
        0 AS DOC_TIPOCUOTA, '' AS DOC_FMODIFICA, 0 AS DIVA_NUMINT, 	
        ''AS FRT_CODIGO, '' AS TRANSPORTE, '' AS DOC_REFPEDIDO, ''AS DOC_REFFACTURA, ''AS CODPROV, 	
        0 AS DOC_TOTALOTROS, 0 AS DOC_RECIBO, '' AS DOC_MATSOLI, '' AS DOC_REFERENCIA, 
        '' AS DOC_LUGAR, '' AS DOC_ANOMBREDE, '' AS DOC_IVAEXO, 0 AS DOC_VALOREXO, '' AS DOC_SECTOR,
        '${dirclie}' AS DOC_DIRENTREGA, '' AS DOC_CANTENV, '' AS DOC_EXP, '' AS DOC_FECHAENT, 
        '' AS TIPOPRODUCCION,  ${totalcosto} AS DOC_TOTCOSINV,  0 AS DOC_TOTALFIN, 	
        '' AS USUARIOENUSO, 0 AS DOC_IMPUESTO1, 0 AS DOC_TOTALIMPU1, 0 AS DOC_PORCOMI, 0 AS DOC_DOLARES, 	
        '' AS CODMESA, 0 AS DOC_TIPOOPE, '' AS USUARIOAUTORIZA, 0 AS NUMAUTORIZA, '' AS FECHAAUTORIZA, '' AS HORAAUTORIZA, 	
        0 AS DOC_TEMPORADA, 0 AS DOC_INGUAT, '' AS FECHAINGBOD, '' AS HORAINGBOD, '' AS FECHASALBOD, 
        '' AS HORASALBOD, 0 AS CODVENBOD, '' AS CODHABI, '' AS DOC_SERIE, '' AS DOC_FECHAFAC, 0 AS DOC_IVARETENIDO, 	
        ''AS FECHARECBOD, 	'' AS HORARECBOD, 0 AS CTABAN, 0 AS NUMINTBAN, '' AS FECHARECEMP, 	
        ''AS HORARECEMP, '' AS FECHAINGEMP, '' AS HORAINGEMP, '' AS FECHASALEMP, '' AS HORASALEMP, 	
        0 AS CODVENEMP, '' AS FECHARECFAC, '' AS HORARECFAC, '' AS FECHAINGFAC, '' AS HORAINGFAC, 	
        '' AS FECHASALFAC, '' AS HORASALFAC, '' AS FECHARECENT, '' AS HORARECENT, '' AS FECHAINGENT, 	
        '' AS HORAINGENT, '' AS FECHASALENT, '' AS HORASALENT, 	0 AS DOC_TOTCOSDOL, 0 AS DOC_TOTCOSINVDOL, 	
        '' AS CODUNIDAD, 0 AS TOTCOMBUSTIBLE, '' AS DOC_CODCONTRA, '' AS DOC_NUMCONTRA, 0 AS INTERES, 	
        0 AS ABONOINTERES, 0 AS SALDOINTERES, 0 AS NUMEROCORTE, 0 AS DOC_PORLOCAL, '' AS DOC_NUMORDEN, 	
        '' AS DOC_FENTREGA, '' AS DOC_INTERESADO, '' AS DOC_RECIBE, 0 AS NUMEROROLLO, '' AS COD_CENTRO, '' AS GENCUOTA, 	
        10 AS DOC_PORINGUAT, 'N' AS DOC_INGUATEXENTO, 'C' AS DOC_TIPOTRANIVA, 0.5 AS DOC_PORTIMBREPRE, 0 AS DOC_TIMBREPRENSA, 	
        0 AS ABONOSANTICIPO, 0 AS SALDOANTICIPO, 0 AS DOC_PRODEXENTO, 0 AS PUNTOSGANADOS, 0 AS PUNTOSUSADOS, 0 AS APL_ANTICIPO, 	
        '' AS COD_DEPARTA, 	'' AS FIRMAELECTRONICA, '' AS DOC_CODDOCRETENCION, '' AS DOC_SERIERETENCION, '' AS DOC_NUMRETENCION, 	
        '' AS FIRMAISC, 0 AS ISCENVIADO, '' AS IDELECTRONICA, 0 AS INTERESFAC, 0 AS TOTAL_IDB, 'N' AS TIPO_CONSTANCIA, 	
        '' AS NUM_CONSTANCIA, 0 AS VALOR_CONSTANCIA, '' AS CODDOCLIQ, '' AS NUMDOCLIQ, '' AS CODACTI, '' AS GASTOLIQ, 	
        0 AS DOC_TOTCOSINVBOD, 0 AS ITEM_EVENTOLIQ, 0 AS DOC_LATITUD, 0 AS DOC_LONGITUD, '' AS DOC_NUMEROAPP, '' AS DOC_FIRMA_VEN, 	
        '' AS DOC_FIRMA_CLIE, '' AS DOC_DESPACHADA, '' AS DOC_SERIE_A, '' AS DOC_REFFACTURA_A, '' AS FIRMAELECTRONICA_A, 	
        '' AS IDELECTRONICA_A;`
                   
    qryCorrelativo=`UPDATE TIPODOCUMENTOS 
                    SET CORRELATIVO=${nuevocorrelativo} 
                    WHERE EMP_NIT='${empnit}' AND CODDOC='${coddoc}';`
      
    console.log(qryDocumentos);
    console.log('*** ** *** *** *** *** *** ***')
    console.log(qryDocproductos);

    execute.Query(res, qryCorrelativo + qryDocumentos + qryDocproductos);
    
});



module.exports = router;