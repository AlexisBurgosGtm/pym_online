let funciones = {
  get_FEL_fecha(date) {

    let strFecha = '';

    const [yy, mm, dd] = date.split(/-/g);

    let hoy = new Date();
      let hora = hoy.getHours();
      if(hora.toString().length==1){hora="0" + hora.toString()};
      let minuto = hoy.getMinutes();
      if(minuto.toString().length==1){minuto="0" + minuto.toString()};
      let segundo = hoy.getSeconds();
      if(segundo.toString().length==1){segundo="0" + segundo.toString()};
    
    strFecha = `${yy}-${mm}-${dd}T${hora.toString()}:${minuto.toString()}:${segundo.toString()}.000-06:00`.replace('T00:00:00.000Z', '');
    return strFecha;

    //s'2022-11-27T10:49:22.000-06:00'
  },
  fcn_solicitar_fel(coddoc,correlativo,nit,nombre,direccion,municipio,departamento,idbtn,fecha){
    
      let btnCertif = document.getElementById(idbtn);
      nit = funciones.limpiarTexto(nit).toUpperCase();

      funciones.Confirmacion('¿Está seguro que desea intentar certificar esta factura?')
      .then((value)=>{
        if(value==true){
              
              btnCertif.innerHTML = 'Solicitando...';
              btnCertif.disabled = true;

              funciones.getXmlFel(coddoc,correlativo,nit,nombre,direccion,municipio,departamento,fecha)
              .then((xmlstring)=>{
                
                      funciones.converBase64(xmlstring)
                      .then((valor)=>{
                            funciones.solicitar_FEL(coddoc,correlativo,valor)
                            .then((data)=>{
                                if(data.resultado==true){
                                    //console.log(data);
                                    funciones.enviar_FEL_firmado(coddoc,correlativo,data.archivo)
                                    .then((data)=>{
                                            //console.log(data);
                                            if(data.resultado==true){
                                              funciones.Aviso('Factura firmada exitosamente!!');

                                              btnCertif.innerHTML = '<i class="fal fa-print"></i>SOLICITAR FACTURA';
                                              btnCertif.disabled = false;
                                              
                                              funciones.update_FEL_series(coddoc,correlativo,data.uuid.toString(),data.serie.toString(),data.numero.toString(),data.fecha.toString())
                                              .then(()=>{
                                                  apigen.pedidosVendedor(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFecha'),'tblReport','containerTotal');
                                              })
                                              .catch(()=>{
                                                  funciones.AvisoError('No se pudo Cargar la lista')
                                              })
                                            }else{
                                              btnCertif.innerHTML = '<i class="fal fa-print"></i>SOLICITAR FACTURA';
                                              btnCertif.disabled = false;

                                              funciones.mostrarErrores(JSON.stringify(data.descripcion_errores));

                                              funciones.AvisoError('No se pudo crear la factura');
                                            }
                                    })
                                    .catch((error)=>{
                                      console.log('Error: ');
                                      console.log(error);
                                      btnCertif.innerHTML = '<i class="fal fa-print"></i>SOLICITAR FACTURA';
                                      btnCertif.disabled = false;

                                      funciones.mostrarErrores(error);

                                      funciones.AvisoError('No se pudo crear la factura');
                                    })
                                    
                                    
                                }else{
                                  btnCertif.innerHTML = '<i class="fal fa-print"></i>SOLICITAR FACTURA';
                                  btnCertif.disabled = false;
                                                                
                                  funciones.AvisoError('Factura no se pudo certificar');

                                  funciones.mostrarErrores(data.descripcion);



                                }
                                
                            })
                            .catch((error)=>{
                                console.log(error);
                                btnCertif.innerHTML = '<i class="fal fa-print"></i>SOLICITAR FACTURA';
                                btnCertif.disabled = false;
                                funciones.AvisoError('Error al certificar')

                                funciones.mostrarErrores(error);
                                                               
                            })
                      })      
              })
              .catch((err)=>{
                  btnCertif.innerHTML = '<i class="fal fa-print"></i>SOLICITAR FACTURA';
                  btnCertif.disabled = false;
                  funciones.AvisoError('No se pudo obtener el xml')
              })

        
        } 
    })
      
  },
  fcn_solicitar_fel_directo(coddoc,correlativo,nit,nombre,direccion,municipio,departamento,idbtn,fecha){
    
      nit = funciones.limpiarTexto(nit).toUpperCase();
      return new Promise((resolve,reject)=>{
        
        if(FEL.CONFIG_FEL_HABILITADO=='NO'){reject();funciones.AvisoError('No está habilitado para emitir Factura Electrónica');return;};

        funciones.getXmlFel(coddoc,correlativo,nit,nombre,direccion,municipio,departamento,fecha)
            .then((xmlstring)=>{      
                    funciones.converBase64(xmlstring)
                    .then((valor)=>{
                          funciones.solicitar_FEL(coddoc,correlativo,valor)
                          .then((data)=>{
                              if(data.resultado==true){

                                  setLog(`<label class="text-info">Factura firmada exitosamente, enviando a certificación</label>`,'rootWait');
                                  
                                  funciones.enviar_FEL_firmado(coddoc,correlativo,data.archivo)
                                  .then((data)=>{
                                          //console.log(data);
                                          if(data.resultado==true){
                                            
                                            setLog(`<label class="text-info">Factura CERTIFICADA exitosamente!!</label>`,'rootWait');
                                            
                                            funciones.update_FEL_series(coddoc,correlativo,data.uuid.toString(),data.serie.toString(),data.numero.toString(),data.fecha.toString())
                                            .then(()=>{
                                                resolve(data.uuid.toString())
                                            })
                                            .catch(()=>{
                                                reject('La factura se certificó pero no se actualizaron los datos')
                                            })
                                          }else{
                                              reject('La factura no pudo ser certificada. Error: ' + data.descripcion)
                                          }
                                  })
                                  .catch((error)=>{
                                      reject('La factura no pudo ser certificada. Error: ' +  error)
                                  })
                                  
                                  
                              }else{
                                reject('Factura no se pudo firmar. Error: ' + data.descripcion)
                              }
                              
                          })
                          .catch((error)=>{
                            reject('Factura no se pudo firmar. Error: ' + error)
                          })
                    })      
            })
            .catch((err)=>{
                reject('No se pudo obtener el xml')
            })

      })
    
  },
  solicitar_FEL(coddoc,correlativo,xml){
      return new Promise((resolve,reject)=>{
            axios.post('https://signer-emisores.feel.com.gt/sign_solicitud_firmas/firma_xml', {
                llave: FEL.ACCESO_FIRMA_CLAVE, 
                archivo: xml, 
                codigo: `${GlobalCodSucursal}-${coddoc}-${correlativo}`, 
                alias: FEL.ACCESO_FIRMA_USUARIO, 
                es_anulacion: "N" 
            })
            .then((response) => {
                //console.log(response);
                const data = response.data;
                resolve(data);
            }, (error) => {
             
                reject(error);
            });
      })
  },
  enviar_FEL_firmado(coddoc,correlativo,xml){
    return new Promise((resolve,reject)=>{
      
      axios({
        method: 'POST',
        url: '/fel/fel_certificar',
        data: {
          nitemisor: FEL.NITEmisor,
          xmldte:xml, 
          felnombre:FEL.ACCESO_REQ_NOMBRE, 
          felclave:FEL.ACCESO_REQ_CLAVE, 
          identificador: `${GlobalCodSucursal}-${coddoc}-${correlativo}`
        }
      })
      .then((response) => {
              const data = response.data;
              resolve(data);
      }, (error) => {
              reject(error);
      });

    })
  },
  update_FEL_series(coddoc,correlativo,uddi,serie,numero,fechacertificacion){

    return new Promise((resolve,reject)=>{
        axios.post('/fel/fel_certificar_update_documento', {
          sucursal:GlobalCodSucursal,
          coddoc:coddoc,
          correlativo:correlativo,
          uudi:uddi,
          serie:serie,
          numero:numero,
          fechacertificacion:fechacertificacion
        })
        .then((response) => {
            const data = response.data;
            resolve(data);
        }, (error) => {
        
            reject(error);
        });
    })

  },
  enviar_FEL_firmado_FRONTEND_ERROR_CORS(coddoc,correlativo,xml){
    return new Promise((resolve,reject)=>{
          axios.post('https://certificador.feel.com.gt/fel/certificacion/v2/dte/',
          {nit_emisor: FEL.NITEmisor, 
            correo_copia: "contadorgeneral@grupobuenavista.com.gt", 
            xml_dte: xml
          }, 
          {
            headers: {
              usuario: FEL.ACCESO_REQ_NOMBRE,
              llave:FEL.ACCESO_REQ_CLAVE,
              identificador: `${GlobalCodSucursal}-${coddoc}-${correlativo}`,
              'Content-Type': 'application/json'
            } 
          })
          .then((response) => {
              const data = response.data;

              resolve(data);
          }, (error) => {
           
              reject(error);
          });
    })
  },
  getXmlFel(coddoc,correlativo,nit,nombre,direccion,municipio,departamento,fecha){
      
      let xmlstring = '';
      let tipoespecial = "";
      if(nit.length.toString()=='13'){tipoespecial ='TipoEspecial="CUI"'};

      return new Promise((resolve,reject)=>{
        let fechaemision = funciones.get_FEL_fecha(fecha); //'2022-11-27T10:49:22.000-06:00';

        let numeroacceso = '400000110';
  
        let encabezado = `<dte:GTDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0"  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.2.0">
                            <dte:SAT ClaseDocumento="dte">
                            <dte:DTE ID="DatosCertificados">
                              <dte:DatosEmision ID="DatosEmision">
                              <dte:DatosGenerales CodigoMoneda="GTQ" FechaHoraEmision="${fechaemision}" NumeroAcceso="${numeroacceso}" Tipo="FACT" />
                            `
  
        let emisor = `  <dte:Emisor AfiliacionIVA="GEN" CodigoEstablecimiento="${FEL.CodigoEstablecimiento}" CorreoEmisor="" NITEmisor="${FEL.NITEmisor}" NombreComercial="${FEL.NombreComercial}" NombreEmisor="${FEL.NombreEmisor}">
                          <dte:DireccionEmisor>
                            <dte:Direccion>${FEL.Direccion}</dte:Direccion>
                            <dte:CodigoPostal>${FEL.CodigoPostal}</dte:CodigoPostal>
                            <dte:Municipio>${FEL.Municipio}</dte:Municipio>
                            <dte:Departamento>${FEL.Departamento}</dte:Departamento>
                            <dte:Pais>GT</dte:Pais>
                          </dte:DireccionEmisor>
                        </dte:Emisor>`;
  
        let receptor = ` <dte:Receptor CorreoReceptor="" IDReceptor="${nit}" NombreReceptor="${nombre}" ${tipoespecial}>
                          <dte:DireccionReceptor>
                            <dte:Direccion>${direccion}</dte:Direccion>
                            <dte:CodigoPostal>0</dte:CodigoPostal>
                            <dte:Municipio>${municipio}</dte:Municipio>
                            <dte:Departamento>${departamento}</dte:Departamento>
                            <dte:Pais>GT</dte:Pais>
                          </dte:DireccionReceptor>
                        </dte:Receptor>`;
                          
        
        let frases = ` <dte:Frases>
                        <dte:Frase CodigoEscenario="1" TipoFrase="1" />
                        <dte:Frase CodigoEscenario="1" TipoFrase="2" />
                      </dte:Frases>`
  
        let totales = '';
        let items = '';
  
        let footer = `</dte:DatosEmision>
                        </dte:DTE>
                        <dte:Adenda>
                        <dte:Valor1>${coddoc}</dte:Valor1>
                        <dte:Valor2>${correlativo}</dte:Valor2>
                        </dte:Adenda>
                      </dte:SAT>
                      </dte:GTDocumento>`
  
        let strdata ='';
  
        axios.post('/digitacion/detallepedido3', {
            sucursal: GlobalCodSucursal,
            coddoc:coddoc,
            correlativo:correlativo
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            let totaliva = 0;
            let numerolinea = 0;
            data.map((rows)=>{
                    numerolinea += 1;
                    let subtotal = 0;
                    let iva = 0;
                    total = Number(total) + Number(rows.IMPORTE);
                    iva = (Number(rows.IMPORTE.toFixed(3)) - (Number(rows.IMPORTE.toFixed(3))/1.12)).toFixed(3);
                    subtotal = (Number(rows.IMPORTE)-iva).toFixed(2);
                    totaliva += Number(iva);
                    strdata += funciones.getStrItem(numerolinea,rows.CANTIDAD,rows.CODMEDIDA,rows.DESPROD,rows.PRECIO,0,subtotal,iva);
            })
            items = '<dte:Items>' + strdata + '</dte:Items>';
            console.log('totaliva:' + totaliva);
            totales = ` <dte:Totales>
                          <dte:TotalImpuestos>
                          <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${Number(totaliva).toFixed(3)}" />
                          </dte:TotalImpuestos>
                          <dte:GranTotal>${total.toFixed(3)}</dte:GranTotal>
                        </dte:Totales>`;
           xmlstring = encabezado + emisor + receptor + frases + items + totales + footer;
          
           console.log(xmlstring);

           resolve(xmlstring);
        }, (error) => {
            xmlstring='NO';
            reject(xmlstring);
        });


      })

     

 

  },
  getStrItem(numerolinea,cantidad,codmedida,descripcion,precioun,descuento,subtotal,iva){
       
    let totalprecio = (Number(precioun)*Number(cantidad));
   
    let str = ` 
            <dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>${cantidad}</dte:Cantidad>
            <dte:UnidadMedida>${codmedida.substring(0,3)}</dte:UnidadMedida>
            <dte:Descripcion>${descripcion}</dte:Descripcion>
            <dte:PrecioUnitario>${precioun.toFixed(3)}</dte:PrecioUnitario>
            <dte:Precio>${totalprecio.toFixed(3)}</dte:Precio>
            <dte:Descuento>${Number(descuento)}</dte:Descuento>
            <dte:Impuestos>
              <dte:Impuesto>
              <dte:NombreCorto>IVA</dte:NombreCorto>
              <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
              <dte:MontoGravable>${subtotal}</dte:MontoGravable>
              <dte:MontoImpuesto>${iva}</dte:MontoImpuesto>
              </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${(Number(totalprecio)-Number(descuento)).toFixed(3)}</dte:Total>
            </dte:Item>   
          `;
    
    return str;
  },
  imprimirTicket2(coddoc,correlativo,fechaemision,nit,nombre,direccion,fel_uudi,fel_serie,fel_numero,fel_fecha){

        let container = document.getElementById('containerTicket');
        let strEncabezado = '';

        switch (GlobalCodSucursal) {
          case '8813591-8':
            strEncabezado = `
            <div class="row">
              <div class="col-12 text-center">
                <img src='./logos/santafe.png' width="150" height="100"></img>
                <br>
                <h1>GRANJA AVICOLA SANTA FE, S.A.</h1>
                <h3>GRANJA AVICOLA SANTA FE</h3>
                <h3>NIT: 8813591-8</h3>
                <h3>ESTABLECIMIENTO No. 1</h3>
                <h3>ALDEA DON GREGORIO ZONA 0</h3>
                <h3>SANTA ROSA, SANTA CRUZ NARANJO</h3>
                <h3>PBX: 77250279</h3>
                <h3>41504806</h3>
                <br>
                <h3>FACTURA</h3>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col-6">
                  <h3>SERIE:</h3>
                  <h3>NUMERO:</h3>
                  <h3>DOC. REF:</h3>
                  <br>
                  <h3>FECHA:</h3>
                  <h3>CERTIFICACIÓN:</h3>
                  <br>
                  <h3>NIT:</h3>
                  <h3>NOMBRE:</h3>
                  <h3>DIRECCION</h3>
              </div>
              <div class="col-6">
                  <h3>${fel_serie}</h3>
                  <h3>${fel_numero}</h3>
                  <h3>${coddoc}-${correlativo}:</h3>
                  <br>
                  <h3>${fel_fecha}</h3>
                  <h3>${fel_uudi}</h3>
                  <br>
                  <h3>${nit}</h3>
                  <h3>${nombre}</h3>
                  <h3>${direccion}</h3>
              </div>
            </div>
            
            <br>

            <div class="row">
                <div class="col-3"><h3>DESCRIPCION</h3></div>
                <div class="col-3"><h3>UNIDADES</h3></div>
                <div class="col-3"><h3>PRECIO</h3></div>
                <div class="col-3"><h3>TOTAL</h3></div>
            </div>            
           `;
            break;
        
          default:
            break;
        }

       

        let strdata = '';

        let footer = '';
        let msg = ''; 

        axios.post('/digitacion/detallepedido3', {
            sucursal: GlobalCodSucursal,
            coddoc:coddoc,
            correlativo:correlativo
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata += `
                    <div class="row">
                        <div class="col-3"><h3>${rows.DESPROD}</h3></div>
                        <div class="col-3"><h3>${rows.CANTIDAD.toString()}</h3></div>
                        <div class="col-3"><h3>${funciones.setMoneda(rows.PRECIO,'Q')}</h3></div>
                        <div class="col-3"><h3>${funciones.setMoneda(rows.IMPORTE,'Q')}</h3></div>
                    </div>  
                    `;
            })
            footer = `
                      <br>
                      <h1>TOTAL: ${funciones.setMoneda(total,'Q')}</h1>
                      
                      <div class="row">
                          <div class="col-12 text-center">
                              <h2>SUJETO A PAGOS TRIMESTRALES ISR</h2>
                              <br>
                              <h3>NO SE HACEN DEVOLUCIONES EN EFECTIVO</h3>
                              <br>
                              <h5>Para cualquier sugerencia o</h5>
                              <h5>comentario comunicarse al correo</h5>
                              <h5>correo: cobros@grupobuenavista.com.gt</h5>
                              <h5>FECHA/HORA DE CERTIFICACION</h5>
                              <h5>${fel_fecha}</h5>
                              <h5>NUMERO DE AUTORIZACION:</h5>
                              <h5>${fel_uudi}</h5>
                              <h5>DOCUMENTO TRIBUTARIO ELECTRONICO</h5>
                              <h5>CERTIFICADOR: INFILE, S.A.</h5>
                              <h5>NIT: 12521337</h5>
                          </div>
                      </div>
                      `
            msg = strEncabezado + strdata + footer;
          
            container.innerHTML = msg;

            funciones.imprimirSelec('containerTicket');

            //msg = encodeURIComponent(msg);
            //window.open('https://api.whatsapp.com/send?phone='+numero+'&text='+msg);

        }, (error) => {
            //funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';

        });


  },
  imprimirTicket(coddoc,correlativo,fechaemision,nit,nombre,direccion,fel_uudi,fel_serie,fel_numero,fel_fecha){
      
      window.open(FEL.URL_REPORT_INFILE.toString() + fel_uudi)      
  
  },
  imprimirTicket_uudi(fel_uudi){
      
    window.open(FEL.URL_REPORT_INFILE.toString() + fel_uudi)      

  },
  convertDateNormal(date) {
      const [yy, mm, dd] = date.split(/-/g);
      return `${dd}/${mm}/${yy}`.replace('T00:00:00.000Z', '');
    },
    shareAppWhatsapp: ()=>{
     let url= window.location.origin
     swal({
      text: 'Escriba el número a donde se enviará el link de la aplicación:',
      content: "input",
      button: {
        text: "Enviar Whatsapp",
        closeModal: true,
      },
    })
    .then(numero => {
      if (!numero) throw null;
        let stn = '502' + numero.toString();
        let msg = encodeURIComponent(`Aplicación Ventas Mercados Efectivos ${versionapp} `);
            window.open('https://api.whatsapp.com/send?phone='+stn+'&text='+msg+url)
    })   

    },
    mostrarErrores: (deserror)=>{
      console.log('error:')
      console.log(deserror);
        rootErrores.innerHTML = deserror;
        $("#modalErrores").modal('show');
    },
    readContacts:(idResult)=>{

    let container = document.getElementById(idResult);

    var api = (navigator.contacts || navigator.mozContacts);
      
    if (api && !!apigen.select) { // new Chrome API
      apigen.select(['name', 'email', 'tel'], {multiple: false})
        .then(function (contacts) {
          console.log('Found ' + contacts.length + ' contacts.');
          if (contacts.length) {
            
            let numero = contacts[0].tel.toString()
            numero = numero.replace('+502','');
            let stn = '502' + numero.toString();
            stn = stn.replace(' ','');
            funciones.Aviso(stn);
            container.innerHTML = JSON.stringify(contacts);
            
          }
        })
        .catch(function (err) {
          console.log('Fetching contacts failed: ' + err.name);
          funciones.AvisoError('Fetching contacts failed: ' + err.name)
        });
        
    } else if (api && !!apigen.find) { // old Firefox OS API
      var criteria = {
        sortBy: 'familyName',
        sortOrder: 'ascending'
      };
  
      apigen.find(criteria)
        .then(function (contacts) {
          console.log('Found ' + contacts.length + ' contacts.');
          container.innerHTML = JSON.stringify(contacts);
          if (contacts.length) {
            let numero = contacts[0].tel.toString()
            numero = numero.replace('+502','');
            let stn = '502' + numero.toString();
            stn = stn.replace(' ','');
            funciones.Aviso(stn);
            container.innerHTML = JSON.stringify(contacts);
            
          }
        })
        .catch(function (err) {
          console.log('Fetching contacts failed: ' + err.name);
          funciones.AvisoError('Fetching contacts failed: ' + err.name)
        });
        
    } else {
      console.log('Contacts API not supported.');
      container.innerHTML = 'Contacts API not supported.'
    }
    },
    get_data_nit: (nit)=>{

      return new Promise((resolve, reject) => {
                            
        let alias = FEL.ACCESO_REQ_NOMBRE;
        let llave = FEL.ACCESO_REQ_CLAVE;
        
        let url = `/datosnit?nit=${nit}&fel_alias=${alias}&fel_llave=${llave}`;
        
        axios.get(url)
        .then((response) => {
            let json = response.data;
            json = json.replace(","," ");
            json = json.replace(",,"," ");
            json = json.replace(","," ");
            console.log(response.data);

            resolve(json);
        }, (error) => {
            console.log(error);
            reject();
        });
  


      });

    },
    get_data_dpi: (dpi)=>{

      return new Promise((resolve, reject) => {
                            
        let alias = FEL.ACCESO_REQ_NOMBRE;
        let llave = FEL.ACCESO_REQ_CLAVE;

        let url = `/datosdpi?dpi=${dpi}&fel_alias=${alias}&fel_llave=${llave}`;
        
        axios.get(url)
        .then((response) => {
            let json = response.data;
            json = json.replace(","," ");
            json = json.replace(",,"," ");
            json = json.replace(","," ");
            console.log(response.data);

            resolve(json);
        }, (error) => {
            console.log(error);
            reject();
        });
  


      });

    },
    instalationHandlers: (idBtnInstall)=>{
      //INSTALACION APP
      let btnInstalarApp = document.getElementById(idBtnInstall);
      btnInstalarApp.hidden = true;

      let capturedInstallEvent;
      window.addEventListener('beforeinstallprompt',(e)=>{
        e.preventDefault();
        btnInstalarApp.hidden = false;
        capturedInstallEvent = e;
      });
      btnInstalarApp.addEventListener('click',(e)=>{
        capturedInstallEvent.prompt();
      capturedInstallEvent.userChoice.then((choice)=>{
          //solicita al usuario confirmacion para instalar
      })
    })
    //INSTALACION APP
    },
    instalationHandlers2: (idContainer,idBtnInstall)=>{
      //INSTALACION APP
      let btnInstalarApp = document.getElementById(idBtnInstall);
      btnInstalarApp.hidden = true;

      let container = document.getElementById(idContainer);

      let capturedInstallEvent;
      window.addEventListener('beforeinstallprompt',(e)=>{
        e.preventDefault();
        container.hidden = false;
        capturedInstallEvent = e;
      });
      btnInstalarApp.addEventListener('click',(e)=>{
        capturedInstallEvent.prompt();
        capturedInstallEvent.userChoice.then((choice)=>{
          //solicita al usuario confirmacion para instalar
        })
      })
      //INSTALACION APP
    },
    Confirmacion: function(msn){
        return swal({
            title: 'Confirme',
            text: msn,
            icon: 'warning',
            buttons: {
                cancel: true,
                confirm: true,
              }})
    },
    Aviso: function(msn){
        swal(msn, {
            timer: 1500,
            icon: "success",
            buttons: false
            });

        try {
            navigator.vibrate(500);
        } catch (error) {
            
        }
    },
    AvisoError: function(msn){
        swal(msn, {
            timer: 1500,
            icon: "error",
            buttons: false
            });
        try {
            navigator.vibrate([100,200,500]);
        } catch (error) {
            
        }
    },
    FiltrarListaProductos: function(idTabla){
        swal({
          text: 'Escriba para buscar...',
          content: "input",
          button: {
            text: "Buscar",
            closeModal: true,
          },
        })
        .then(name => {
          if (!name) throw null;
            funciones.FiltrarTabla(idTabla,name);

            //'tblProductosVentas'
        })
    },
    solicitarClave: function(){
      return new Promise((resolve,reject)=>{
          swal({
            text: 'Escriba su contraseña de usuario',
            content: "input",
            button: {
              text: "Contraseña",
              closeModal: true,
            },
          })
          .then(name => {
            if (!name) throw null;
                resolve(name);
          })
          .catch(()=>{
            reject('no');
          })
      })     
    },
    setMoneda: function(num,signo) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) num = "0";
        let sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        let cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + signo + ' ' + num + ((cents == "00") ? '' : '.' + cents)).toString();
    },
    setMargen: function(num,signo) {
      
      num = num.toString().replace(/\$|\,/g, '');
      if (isNaN(num)) num = "0";
      let sign = (num == (num = Math.abs(num)));
      num = Math.floor(num * 100 + 0.50000000001);
      let cents = num % 100;
      num = Math.floor(num / 100).toString();
      if (cents < 10) cents = "0" + cents;
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
          num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
      return ( ((sign) ? '' : '-') +  num + ((cents == "00") ? '' : '.' + cents) + ' ' + signo  ).toString();
    },
    loadScript: function(url, idContainer) {
        return new Promise((resolve, reject) => {
          var script = document.createElement('script');
          script.src = url;
    
          script.onload = resolve;
          script.onerror = reject;
             
          document.getElementById(idContainer).appendChild(script)
        });
    },
    loadView: (url, idContainer)=> {
        return new Promise((resolve, reject) => {
            
            let contenedor = document.getElementById(idContainer);

            axios.get(url)
            .then((response) => {
                contenedor.innerHTML ='';
                contenedor.innerHTML = response.data;
                resolve();
            }, (error) => {
                console.log(error);
                reject();
            });
      
          });
    },   
    hablar: function(msn){
        var utterance = new SpeechSynthesisUtterance(msn);
        return window.speechSynthesis.speak(utterance); 
    },
    crearBusquedaTabla: function(idTabla,idBusqueda){
    var tableReg = document.getElementById(idTabla);
    var searchText = document.getElementById(idBusqueda).value.toLowerCase();
      var cellsOfRow="";
      var found=false;
      var compareWith="";
   
      // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
                {
                  cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                    found = false;
                    // Recorremos todas las celdas
                    for (var j = 0; j < cellsOfRow.length && !found; j++)
                    {
                      compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                      // Buscamos el texto en el contenido de la celda
                      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                      {
                          found = true;
                      }
                  }
                  if(found)
                  {
                      tableReg.rows[i].style.display = '';
                  } else {
                      // si no ha encontrado ninguna coincidencia, esconde la
                      // fila de la tabla
                      tableReg.rows[i].style.display = 'none';
                  }
              }
    },
    FiltrarTabla: function(idTabla,idfiltro){
    var tableReg = document.getElementById(idTabla);
    let filtro = document.getElementById(idfiltro).value;

    var searchText = filtro.toLowerCase();
      var cellsOfRow="";
      var found=false;
      var compareWith="";
   
      // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
                {
                  cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                    found = false;
                    // Recorremos todas las celdas
                    for (var j = 0; j < cellsOfRow.length && !found; j++)
                    {
                      compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                      // Buscamos el texto en el contenido de la celda
                      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                      {
                          found = true;
                      }
                  }
                  if(found)
                  {
                      tableReg.rows[i].style.display = '';
                  } else {
                      // si no ha encontrado ninguna coincidencia, esconde la
                      // fila de la tabla
                      tableReg.rows[i].style.display = 'none';
                  }
              }
        //funciones.scrollUp(1000, 'easing');
    },
    OcultarRows: function(idTabla){
    var tableReg = document.getElementById(idTabla);
        // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
        {
            if(i>15){
                tableReg.rows[i].style.display = 'none';
            }
        }
    },
    PingInternet: async (url)=>{
    var peticion = new Request(url, {
        method: 'POST',
        headers: new Headers({
            // Encabezados
           'Content-Type': 'application/json'
        })
      });

      await fetch(peticion)
         .then(function(res) {
           if (res.status==200)
               {
                   funciones.hablar('parece que ya hay internet');
                }
      })
      .catch(
          ()=>{
            funciones.hablar('por lo visto no hay señal');
          }
      )
    },
    NotificacionPersistent : (titulo,msn)=>{

    function InicializarServiceWorkerNotif(){
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () =>
       navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(err => 'SW registration failed'));
      };
      
      requestPermission();
    }
    
    if ('Notification' in window) {};
    
    function requestPermission() {
      if (!('Notification' in window)) {
        funciones.Aviso('Notification API not supported!');
        return;
      }
      
      Notification.requestPermission(function (result) {
        //$status.innerText = result;
      });
    }

    InicializarServiceWorkerNotif();
    
    const options = {
        body : titulo,
        icon: "../favicon.png",
        vibrate: [1,2,3],
      }
      //image: "../favicon.png",
         if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
          console.log('Persistent Notification API not supported!');
          return;
        }
        
        try {
          navigator.serviceWorker.getRegistration()
            .then(reg => 
                    reg.showNotification(msn, options)
                )
            .catch(err => console.log('Service Worker registration error: ' + err));
        } catch (err) {
          console.log('Notification API error: ' + err);
        }
      
    },
    ObtenerUbicacion: async(idlat,idlong)=>{
        let lat = document.getElementById(idlat);
        let long = document.getElementById(idlong);
        
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                lat.innerText = location.coords.latitude.toString();
                long.innerText = location.coords.longitude.toString();
            })
        } catch (error) {
            funciones.AvisoError(error.toString());
        }
    },
    ComboSemana :(letnum)=>{
      let str = '';
      if(letnum=="LETRAS"){
        str =  `<option value="LUNES">LUNES</option>
                <option value="MARTES">MARTES</option>
                <option value="MIERCOLES">MIERCOLES</option>
                <option value="JUEVES">JUEVES</option>
                <option value="VIERNES">VIERNES</option>
                <option value="SABADO">SABADO</option>
                <option value="DOMINGO">DOMINGO</option>
                <option value="OTROS">OTROS</option>
                `
      }else{
        str =  `<option value="1">LUNES</option>
                <option value="2">MARTES</option>
                <option value="3">MIERCOLES</option>
                <option value="4">JUEVES</option>
                <option value="5">VIERNES</option>
                <option value="6">SABADO</option>
                <option value="7">DOMINGO</option>
                <option value="0">OTROS</option>
                `
      };

      return str;
      
    },
    getDiaSemana:(numdia)=>{
      switch (numdia) {
        case 0:
          return 'DOMINGO';
          break;
        case 1:
          return 'LUNES';
          break;
        case 2:
          return 'MARTES';
          break;
        case 3:
          return 'MIERCOLES';
          break;
        case 4:
          return 'JUEVES';
          break;
        case 5:
          return 'VIERNES';
          break;
        case 6:
          return 'SABADO';
          break;
      
        default:
          break;
      }
    },
    ComboMeses: ()=>{
    let str =`<option value='1'>Enero</option>
              <option value='2'>Febrero</option>
              <option value='3'>Marzo</option>
              <option value='4'>Abril</option>
              <option value='5'>Mayo</option>
              <option value='6'>Junio</option>
              <option value='7'>Julio</option>
              <option value='8'>Agosto</option>
              <option value='9'>Septiembre</option>
              <option value='10'>Octubre</option>
              <option value='11'>Noviembre</option>
              <option value='12'>Diciembre</option>`
    return str;
    },
    ComboAnio: ()=>{
    let str =`<option value='2017'>2017</option>
              <option value='2018'>2018</option>
              <option value='2019'>2019</option>
              <option value='2020'>2020</option>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
              <option value='2023'>2023</option>
              <option value='2024'>2024</option>
              <option value='2025'>2025</option>
              <option value='2026'>2026</option>
              <option value='2027'>2027</option>
              <option value='2028'>2028</option>
              <option value='2029'>2029</option>
              <option value='2030'>2030</option>`
    return str;
    },
    getFecha(){
      let fecha
      let f = new Date(); 
      let d = f.getDate(); 
      let m = f.getUTCMonth()+1; 

      switch (d.toString()) {
        case '30':
          m = f.getMonth()+1; 
          break;
        case '31':
          m = f.getMonth()+1; 
            break;
      
        default:

          break;
      }

      
      let y = f.getFullYear();
     
      di = d;
      var D = '0' + di;
      let DDI 
      if(D.length==3){DDI=di}else{DDI=D}
      
      ma = m;
      var MA = '0' + ma;
      let DDM 
      if(MA.length==3){DDM=ma}else{DDM=MA}


      fecha = y + '-' + DDM + '-' + DDI;
      return fecha;
    },
    limpiarTexto: (texto) =>{
      var ignorarMayMin = true;
      var reemplazarCon = " pulg";
      var reemplazarQue = '"';
      reemplazarQue = reemplazarQue.replace(/[\\^$.|?*+()[{]/g, "\\$&"),
      reemplazarCon = reemplazarCon.replace(/\$(?=[$&`"'\d])/g, "$$$$"),
      modif = "g" + (ignorarMayMin ? "i" : ""),
      regex = new RegExp(reemplazarQue, modif);
      return texto.replace(regex,reemplazarCon);
    },
    quitarCaracteres: ( texto, reemplazarQue, reemplazarCon, ignorarMayMin) =>{
      var reemplazarQue = reemplazarQue.replace(/[\\^$.|?*+()[{]/g, "\\$&"),
      reemplazarCon = reemplazarCon.replace(/\$(?=[$&`"'\d])/g, "$$$$"),
      modif = "g" + (ignorarMayMin ? "i" : ""),
      regex = new RegExp(reemplazarQue, modif);
      return texto.replace(regex,reemplazarCon);
    },
    devuelveFecha: (idInputFecha)=>{
      let fe = new Date(document.getElementById(idInputFecha).value);
      let ae = fe.getFullYear();
      let me = fe.getUTCMonth()+1;
      let de = fe.getUTCDate() 
      let fret = ae + '-' + me + '-' + de;
      return fret;
    },
    showToast: (text)=>{
      //depente de la libreria noty
      new Noty({
        type: 'info',
        layout: 'topRight',
        timeout: '500',
        theme: 'metroui',
        progressBar: false,
        text,
      }).show();
    },
    getComboSucursales: ()=>{
      let str = '';
      
      dataEmpresas.map((rows)=>{
        str = str + `<option selected value='${rows.codsucursal}'>${rows.nomsucursal}</option>`;
      });

      return str;
      
    },
    slideAnimationTabs: ()=>{
      //inicializa el slide de las tabs en censo
      $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
          var $old_tab = $($(e.target).attr("href"));
          var $new_tab = $($(e.relatedTarget).attr("href"));
  
          if($new_tab.index() < $old_tab.index()){
              $old_tab.css('position', 'relative').css("right", "0").show();
              $old_tab.animate({"right":"-100%"}, 300, function () {
                  $old_tab.css("right", 0).removeAttr("style");
              });
          }
          else {
              $old_tab.css('position', 'relative').css("left", "0").show();
              $old_tab.animate({"left":"-100%"}, 300, function () {
                  $old_tab.css("left", 0).removeAttr("style");
              });
          }
      });
  
      $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
          var $new_tab = $($(e.target).attr("href"));
          var $old_tab = $($(e.relatedTarget).attr("href"));
  
          if($new_tab.index() > $old_tab.index()){
              $new_tab.css('position', 'relative').css("right", "-2500px");
              $new_tab.animate({"right":"0"}, 500);
          }
          else {
              $new_tab.css('position', 'relative').css("left", "-2500px");
              $new_tab.animate({"left":"0"}, 500);
          }
      });
  
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          // your code on active tab shown
      });
    },
    exportTableToExcel: (tableID, filename = '')=>{
      var downloadLink;
      var dataType = 'application/vnd.ms-excel;charset=UTF-8';
      var tableSelect = document.getElementById(tableID);
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
      
      // Specify file name
      filename = filename?filename+'.xls':'excel_data.xlsx';
      
      // Create download link element
      downloadLink = document.createElement("a");
      
      document.body.appendChild(downloadLink);
      
      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['ufeff', tableHTML], {
              type: "text/plain;charset=utf-8;"//dataType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
      
          // Setting the file name
          downloadLink.download = filename;
          
          //triggering the function
          downloadLink.click();
      }
    },
    getHora:()=>{
      let hoy = new Date();
      let hora = hoy.getHours();
      let minuto = hoy.getMinutes();
      return `${hora.toString()}:${minuto.toString()}`;
    },
    gotoGoogleMaps:(lat,long)=>{
      window.open(`https://www.google.com/maps?q=${lat},${long}`);
    },
    imprimirSelec:(nombreDiv)=>{
      var contenido= document.getElementById(nombreDiv).innerHTML;
      var contenidoOriginal= document.body.innerHTML;
  
      document.body.innerHTML = contenido;
  
      window.print();
  
      document.body.innerHTML = contenidoOriginal;
    },
    converFileBase64:(file)=>{
      return new Promise((resolve, reject)=>{
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function() {
                //console.log(reader.result);
                resolve(reader.result);
          };
          reader.onerror = function(e){
                console.log('Error: ', e);
                reject(e);
          };
      })

      //usage:
      /*

       let file = document.querySelector('#txtClienteFoto').files[0];
          funciones.converBase64(file)
          .then((valor)=>{
              document.getElementById('txtCliente64Foto').value = valor;
          })
          .catch((e)=>{
              document.getElementById('txtCliente64Foto').value = e.toString();    
          })
       
       */
    },
    converBase64:(xmlstring)=>{
        return new Promise((resolve, reject)=>{
            let str = btoa(xmlstring)
            resolve(str);
        })
    },
    revertBase64:(base64string)=>{
      return new Promise((resolve, reject)=>{

          let str = atob(base64string)
          resolve(str);
      })
    },
    getCorrelativo_isc:(correlativo)=>{
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
  
  }
};

//export default funciones;