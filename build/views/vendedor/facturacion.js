function getView(){
    let view = {
        body:()=>{
            return `
                <div class="row">
                    <div class="col-6">
                        <label class="text-secondary" style="font-size:80%" id="lbNomClien">
                            Consumidor Final
                        </label>
                    </div>
                    <div class="col-6 text-right">
                        <h3 id="txtTotalVenta" class="text-secondary negrita"></h3>
                        <h5 id="txtTotalDescuento" class="text-danger negrita"></h5>
                        <h1 id="txtTotalPagar" class="text-mostaza negrita"></h1>
                    </div>
                </div>

                <div class="col-12 p-0">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="pedido" role="tabpanel" aria-labelledby="dias-tab">
                                ${view.encabezadoClienteDocumento() 
                                    + view.gridTempVenta() 
                                    + view.modalCambiarCantidadProducto()
                                }
                        </div>
                        <div class="tab-pane fade" id="precios" role="tabpanel" aria-labelledby="clientes-tab">
                                    ${view.lista_productos() 
                                        + view.modalCantidadProducto()
                                    }
                        </div>

                        <div class="tab-pane fade" id="finalizar" role="tabpanel" aria-labelledby="home-tab">
                                    ${view.finalizar_pedido()}
                        </div>
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-pedido" data-toggle="tab" href="#pedido" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>Pedido
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-info" id="tab-precios" data-toggle="tab" href="#precios" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>Precios
                        </li> 
                        <li class="nav-item">
                            <a class="nav-link negrita text-info" id="tab-finalizar" data-toggle="tab" href="#finalizar" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-edit"></i></a>Finalizar
                        </li>
                                                    
                    </ul>

                </div>
               
            `
        }, 
        encabezadoClienteDocumento :()=>{
            return `
        <div class="row">
            
            <div class="hidden-md-down col-sm-12 col-md-6 col-lg-6 col-xl-6">
                
            </div>
            
            <div class="hidden-md-down col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div id="panel-3" class="panel col-12">
                    <div class="panel-hdr">
                        <h2>Datos del Documento</h2>
                        <div class="panel-toolbar">
                            <button class="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"></button>
                          
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
            `
        },
        gridTempVenta :()=>{
            return `
        <div class="row">
           
                <div class="panel-hdr col-12">
                            <h2 id="txtTotalItems" class="negrita">0 items</h2>
                            <h2 class="text-mostaza">Detalle del Pedido</h2>
                </div>
                        
                    <div class="table-responsive col-12">
                        <table class="table table-hover table-striped"><!--mt-5-->
                            <thead class="">
                                <tr>
                                    <td class=""></td>
                                </tr>
                            </thead>
                            <tbody id="tblGridTempVentas"></tbody>
                        </table>
                    </div>


                        <button class="btn btn-xl btn-circle btn-secondary btn-bottom-l hand shadow" id="btnCambiarCliente">
                            <i class="fal fa-arrow-left"></i>
                        </button>
                    
                        <button class="btn btn-mostaza btn-xl btn-circle btn-bottom-mr shadow hand shadow" id="btnCobrar">
                            <i class="fal fa-dollar-sign"></i> 
                        </button>
                        
                        <button class="btn btn-circle btn-xl btn-success shadow btn-bottom-r hand" id="btnAgregarProd">
                            <i class="fal fa-plus"></i>
                        </button>
        
        </div>  
            `
        },
        lista_productos :()=>{
            return `
            
                    <div class="card card-rounded shadow">
                        <div class="card-header">
                            <label class="modal-title text-mostaza h3" id="">Búsqueda de Productos</label>
                            
                        </div>

                        <div class="card-body">
                            <div class="row">
                                <div class="input-group">
                                    
                                    <input id="txtBusqueda" type="text" ref="txtBusqueda" class="form-control col-12 border-mostazas text-danger negrita" placeholder="Buscar productos..." aria-label="" aria-describedby="button-addon4" />
                                    <div class="input-group-prepend">
                                        <button class="btn btn-mostaza btn-rounded waves-effect waves-themed shadow" type="button" id="btnBuscarProducto">
                                            <i class="fal fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                                <select class="hidden form-control col-3 shadow border-secondary negrita border-left-0 border-right-0 border-top-0" id="cmbTipoPrecio">
                                        <option value="P">P</option>
                                        <option value="C">MC</option>
                                        <option value="B">MB</option>
                                        <option value="A">MA</option>
                                       
                                </select>

                            <table class="table table-responsive table-striped table-hover">
                                <thead class="bg-mostaza text-white">
                                    <tr>
                                        <td>Producto</td>
                                        <td>Precio</td>
                                        <td>No. Lote</td>                         
                                    </tr>
                                </thead>
                                <tbody id="tblResultadoBusqueda">
                                

                                </tbody>
                            </table>
                        </div>
                        
                    
                    </div>
               

                
                    <button class="btn btn-bottom-l btn-secondary btn-xl btn-circle" id="btnPreciosAtras">
                        <i class="fal fa-arrow-left"></i>
                    </button>
               
            `
        },
        finalizar_pedido :()=>{
            return `
            <div class="card">
                <div class="card-header bg-secondary">
                    <label class="modal-title text-white h5" id="">Datos del Cobro</label>
                </div>

                <div class="card-body">
                    <div class="">                            
                        <div class="row">
                            <div class="form-group">
                                <label>Documento a Generar</label>
                                <div class="input-group">
                                    <select class="form-control input-sm" id="cmbCoddoc">
                                    </select>
                                    <input type="text" class="form-control" value="0" id="txtCorrelativo" readonly="true">
                                    <select class="form-control" id="cmbVendedor">
                                    </select>
                                </div>
                            </div>
                            
                            
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Fecha:</label>
                                    <input type="date" class="form-control bg-subtlelight pl-4 text-sm" id="txtFecha">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Forma de Pago:</label>
                                    <select id="cmbConcre" class="form-control">
                                        <option value="CRE">CREDITO</option>
                                        <option value="CON">CONTADO</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                       
                        
                        <div class="form-group">  
                            <div class="row">
                                <div class="col-6">
                                    <label>Código:</label>
                                    <input id="txtNit" type="text" class="form-control" disabled="true" />
                                </div>
                                <div class="col-6">
                                    <label>NIT:</label>
                                    <input id="txtNitDocumento" type="text" class="form-control" disabled="true" />
                                </div>
                            </div>
                        </div>
                        

                        <div class="form-group">
                            <label>Nombre:</label>
                            <input class="form-control" id="txtNombre" placeholder="Nombre de cliente.." disabled="true" >
                        </div>
                                        
                        <div class="form-group">
                            <label>Dirección:</label>
                            <input class="form-control" id="txtDireccion" placeholder="Dirección cliente" disabled="true" >
                        </div>
                                        
                        <hr class="solid">

                        <div class="row">
                            <div class="col-5">
                                <button class="btn btn-outline-secondary btn-xl btn-circle waves-effect waves-themed" id="btnEntregaCancelar">
                                    <i class="fal fa-arrow-left"></i>
                                </button>                                
                            </div>
                
                            <div class="col-1"></div>
                
                            <div class="col-5">
                                <button class="btn btn-mostaza btn-lg btn-pills btn-block waves-effect waves-themed" id="btnFinalizarPedido">
                                    <i class="fal fa-dollar-sign mr-1"></i>Enviar Pedido
                                </button>
                            </div>
                        </div>

                        <div class="input-group hidden">           
                            <div class="input-group-prepend">
                                <button class="btn btn-info waves-effect waves-themed hidden" type="button" id="btnBusquedaClientes">
                                    <i class="fal fa-search"></i>
                                </button>
                                                
                                <button class="btn btn-success waves-effect waves-themed hidden" id="btnNuevoCliente">
                                                    +
                                </button>
                            </div>
                        </div>

                        <div class="form-group hidden">
                            <label>Observaciones</label>
                            <textarea rows="4" cols="80" class="form-control" id="txtEntregaObs" placeholder="Escriba aqui sus observaciones..."></textarea>
                        </div>                                                              
                                            
                    </div>

                    <div class="row">
                        <label class="text-white" id="lbDocLat">0</label>
                        <label class="text-white" id="lbDocLong">0</label class="text-white">
                    </div>
                                                
                </div>
            </div>`
        },
        modalCantidadProducto:()=>{
            return `
            <div class="modal fade" id="ModalCantidadProducto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-md" role="document">
                    <div class="modal-content">
                        <br><br><br><br><br>
                        <div class="modal-header">
                            <label class="modal-title negrita text-danger" id="txtDesProducto">Azucar don Justo Cabal Kilo</label>
                        </div>
                        <div class="modal-body" align="center">
                            <div class="col-8">
                                <div class="row">
                                    <b id="txtCodMedida">UNIDAD</b>
                                </div>
                                
                                <div class="form-group">
                                    <div class="row">
                                        <div class="input-group">
                                
                                            <div class="input-group-prepend">
                                                <button class="btn btn-circle btn-xl btn-icon btn-round btn-danger" id="btnCantidadDown">
                                                    -
                                                </button>
                                            </div>
                                
                                            <input type="number" class="text-center form-control negrita" style="font-size:180%" id="txtCantidad" value="1">    
                                
                                            <div class="input-group-append">
                                                <button class="btn btn-circle btn-xl btn-icon btn-round btn-success" id="btnCantidadUp">
                                                    +
                                                </button>    
                                            </div>
                                        </div>                               
                                    </div>                              
                                </div>

                                <div class="col-12">
                                    <label>Precio: </label>
                                    <label class="text-secondary h3 negrita" id="txtPrecioProducto">Q500</label>
                                    <br>
                                    <label>Subtotal:</label>
                                    <label class="text-danger h1 negrita" id="txtSubTotal">Q500</label>
                                    <br>
                                    <label>Descuento:</label>
                                    <input type="number" class="form-control col-6 text-mostaza negrita h2" id="txtCantidadDescuento" value=0>
                                    <br>
                                    <label>A pagar:</label>
                                    <label class="text-danger h1 negrita text-naranja" id="txtSubTotalDescuento">Q500</label>
                                </div>
                                <br>
                                <div class="row">
                                    <div class="col-6">
                                        <button type="button" class="btn btn-circle btn-secondary btn-xl hand shadow" data-dismiss="modal" id="btnCancelarModalProducto">
                                            <i class="fal fa-arrow-left"></i>
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button type="button" class="btn btn-info btn-circle btn-xl hand shadow" id="btnAgregarProducto">
                                            <i class="fal fa-check"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            `
        },
        modalCambiarCantidadProducto :()=>{
            return `
                <div class="modal fade" id="modalCambiarCantidadProducto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-md" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <label class="modal-title text-mostaza h3" id="">Cambiar cantidad de producto</label>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"><i class="fal fa-times"></i></span>
                                </button>
                            </div>
                
                            <div class="modal-body shadow">
                                    <div class="">            
                                        
                                        <div class="form-group">
                                            <label>Nueva cantidad:</label>
                                            <input type="number" class="form-control border-mostaza negrita shadow col-10" id="txtCantNuevaCant">
                                        </div>   
                                        <div class="form-group">
                                            <label>Nuevo Precio:</label>
                                            <input type="number" class="form-control border-mostaza negrita shadow col-10" id="txtCantNuevoPrecio" disabled="true">
                                        </div>                                                             
                                            
                                    </div>
                                    
                                    <br>
            
                                    <div class="row">
                                        <div class="col-5">
                                            <button class="btn btn-secondary btn-xl btn-circle shadow hand" data-dismiss="modal" id="">
                                                <i class="fal fa-arrow-left"></i>
                                            </button>                                
                                        </div>
            
                                        <div class="col-1"></div>
            
                                        <div class="col-5">
                                            <button class="btn btn-success btn-xl btn-circle hand shadow waves-effect waves-themed" id="btnCantGuardar">
                                                <i class="fal fa-check mr-1"></i>
                                            </button>
                                        </div>
                                        
                                        
                                    </div>
                            
                            </div>
                        
                        </div>
                    </div>
                </div>`
        }
    }

    
    root.innerHTML = view.body(); 


};

async function iniciarVistaVentas(nit,nombre,direccion,nitdoc){

    
    //inicializa la vista
    getView();


    let lbNomClien = document.getElementById('lbNomClien');
    lbNomClien.innerText = `${nombre} // ${direccion}`;
    
    document.getElementById('btnCambiarCliente').addEventListener('click',()=>{
        classNavegar.lista_clientes();
    })


    let txtFecha = document.getElementById('txtFecha');txtFecha.value = funciones.getFecha();
    let txtEntregaFecha = funciones.getFecha();// document.getElementById('txtEntregaFecha');txtEntregaFecha.value = funciones.getFecha();

   

    document.getElementById('txtBusqueda').addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
            //$('#ModalBusqueda').modal('show');
        }
        if(e.code=='NumpadEnter'){
            fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
            //$('#ModalBusqueda').modal('show');
        }
    });
    document.getElementById('btnBuscarProducto').addEventListener('click',()=>{
        fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
        //$('#ModalBusqueda').modal('show');
    });

    document.getElementById('btnPreciosAtras').addEventListener('click',()=>{
        document.getElementById('tab-pedido').click();
    });


    let btnCobrar = document.getElementById('btnCobrar');
    btnCobrar.addEventListener('click',()=>{
       
        //ALEXIS REVISAR LOGICA
        if(btnCobrar.innerText=='Terminar'){
            funciones.AvisoError('No puede finalizar un pedido sin productos')
        }else{
           if(txtNit.value==''){
               funciones.AvisoError('Especifique el cliente a quien se carga la venta');
           }else{
               funciones.ObtenerUbicacion('lbDocLat','lbDocLong')
               
                        //$('#ModalFinalizarPedido').modal('show');  
                document.getElementById('tab-finalizar').click();
                            
           }
       }
       
    });



    let cmbCoddoc = document.getElementById('cmbCoddoc');
    //classTipoDocumentos.comboboxTipodoc('PED','cmbCoddoc');
    //cmbCoddoc.value = GlobalCoddoc;
    let str = data_usuario.map((r)=>{if(r.TIPODOC=='PED'){if(r.EMP_NIT.toString()==GlobalCodSucursal.toString()){return `<option value='${r.NOMOPERACION}'>${r.NOMOPERACION}</option>`}}}).join('\n')
    cmbCoddoc.innerHTML = str;

    cmbCoddoc.addEventListener('change',async ()=>{
       await classTipoDocumentos.fcnCorrelativoDocumento('PED',cmbCoddoc.value,'txtCorrelativo');
    });

    let cmbVendedor = document.getElementById('cmbVendedor');

    let btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
    btnFinalizarPedido.addEventListener('click',async ()=>{
        fcnFinalizarPedido();
    });

    document.getElementById('btnEntregaCancelar').addEventListener('click',()=>{
        document.getElementById('tab-pedido').click();
    });



    // carga el grid
    fcnCargarGridTempVentas('tblGridTempVentas');
    
    await classTipoDocumentos.fcnCorrelativoDocumento('PED',cmbCoddoc.value,'txtCorrelativo');
    
    cmbVendedor.innerHTML = data_usuario.map((r)=>{if(r.TIPOOPERACION=='VENDEDORES'){if(r.EMP_NIT.toString()==GlobalCodSucursal.toString()){return `<option value='${r.NOMOPERACION}'>${r.NOMBRE}</option>`}}}).join('\n');

    addEventsModalCambioCantidad();

    //carga los datos del cliente
    document.getElementById('txtNit').value = nit; //codclie
    document.getElementById('txtNitDocumento').value = nitdoc;
    document.getElementById('txtNombre').value = nombre;
    document.getElementById('txtDireccion').value = direccion;
    
    //inicia los eventos de la ventana Cantidad al agregar productos
    fcnIniciarModalCantidadProductos();

    document.getElementById('btnAgregarProd').addEventListener('click',()=>{
        document.getElementById('tab-precios').click();
    });

    funciones.slideAnimationTabs();
};

function addEventsModalCambioCantidad(){


    document.getElementById('txtCantidadDescuento').addEventListener('input',()=>{
            
    });
    
    
    document.getElementById('btnCantGuardar').addEventListener('click',()=>{
        
        let nuevacantidad = Number(document.getElementById('txtCantNuevaCant').value) || 0;
        let nuevoprecio = Number(document.getElementById('txtCantNuevoPrecio').value) || 0;

        if(nuevoprecio>0){
        }else{
            funciones.AvisoError('Precio inválido');
            return;
        };

        if(nuevacantidad>0){ 
        }else{
            funciones.AvisoError('Cantidad inválido');
            return;
        };
          

        fcnUpdateTempRow(GlobalSelectedId,nuevacantidad,nuevoprecio)
        .then(()=>{
            $('#modalCambiarCantidadProducto').modal('hide');
        });
       

    }) 

};

function fcnIniciarModalCantidadProductos(){

        
    let btnAgregarProducto = document.getElementById('btnAgregarProducto'); //boton agregar 
    let txtCantidad = document.getElementById('txtCantidad'); //input
    let btnCantidadUp = document.getElementById('btnCantidadUp');
    let btnCantidadDown = document.getElementById('btnCantidadDown');
    let txtSubTotal = document.getElementById('txtSubTotal'); //label
    let txtDescuento = document.getElementById('txtCantidadDescuento');

    txtDescuento.addEventListener('input',()=>{
        let cant = parseInt(txtCantidad.value);
        txtCantidad.value = cant + 1;

        let _SubTotal = parseFloat(GlobalSelectedPrecio) * parseFloat(txtCantidad.value);
        let _subtotalDescuento = Number(_SubTotal)-Number(txtDescuento.value||0);

        //_SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
        txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
        document.getElementById('txtSubTotalDescuento').innerHTML = funciones.setMoneda(_subtotalDescuento,'Q');
        
    });

    btnAgregarProducto.addEventListener('click',()=>{
        GlobalSelectedCantidad = Number(txtCantidad.value);
        let totalunidades = (Number(GlobalSelectedEquivale) * Number(GlobalSelectedCantidad));
        let totalexento = GlobalSelectedCantidad * GlobalSelectedExento;

        
        
        fcnAgregarProductoVenta(GlobalSelectedCodprod,GlobalSelectedDesprod,GlobalSelectedCodmedida,GlobalSelectedCantidad,GlobalSelectedEquivale,totalunidades,GlobalSelectedCosto,GlobalSelectedPrecio,totalexento,txtDescuento);
        
        
    });

    txtCantidad.addEventListener('click',()=>{txtCantidad.value =''});

    btnCantidadUp.addEventListener('click',()=>{
        let cant = parseInt(txtCantidad.value);
        txtCantidad.value = cant + 1;

        let _SubTotal = parseFloat(GlobalSelectedPrecio) * parseFloat(txtCantidad.value);
        let _subtotalDescuento = Number(_SubTotal)-Number(txtDescuento.value||0);

        //_SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
        txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
        document.getElementById('txtSubTotalDescuento').innerHTML = funciones.setMoneda(_subtotalDescuento,'Q');
        
    })

    btnCantidadDown.addEventListener('click',()=>{
        if (parseInt(txtCantidad.value)==1){

        }else{
                let cant = parseInt(txtCantidad.value);
                txtCantidad.value = cant - 1;

                let _SubTotal = parseFloat(GlobalSelectedPrecio) * parseFloat(txtCantidad.value);
                let _subtotalDescuento = Number(_SubTotal)-Number(txtDescuento.value||0);

                //s_SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
                txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
                document.getElementById('txtSubTotalDescuento').innerHTML = funciones.setMoneda(_subtotalDescuento,'Q');
            
        }
        
    })

};

function fcnBusquedaProducto(idFiltro,idTablaResultado,idTipoPrecio){
    
    let cmbTipoPrecio = document.getElementById(idTipoPrecio);

    let filtro = document.getElementById(idFiltro).value;
    
    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;

    let strCodBodegas = '';
    data_usuario.map((r)=>{
        if(r.TIPOOPERACION.toString()=="BODEGAS"){
            strCodBodegas = strCodBodegas + `'${r.NOMOPERACION.toString()}',`;
        }
    });
    strCodBodegas = strCodBodegas.substring(0, strCodBodegas.length - 1);

    let str = ""; 

    apigen.precios_lista(GlobalCodSucursal,filtro,strCodBodegas,GlobalSelectedTipoClie,CONFIG_EMPRESA.TIPOCOSTO.toString())
    .then((response) => {
        const data = response;
        
        
        let pre = 0;    
        data.map((rows)=>{
            
                let exist = Number(rows.EXISTENCIA)/Number(rows.EQUIVALE); let strC = '';
                if(Number(rows.EXISTENCIA<=0)){strC='bg-danger text-white'}else{strC='bg-success text-white'};
                let totalexento = 0;
                if (rows.EXENTO==1){totalexento=Number(rows.PRECIO)}
                
                pre = Number(rows.PRECIO)
                
                str += `<tr id="${rows.CODPROD}" onclick="getDataMedidaProducto('${rows.CODPROD}','${funciones.limpiarTexto(rows.DESPROD)}','${rows.CODMEDIDA}',1,${rows.EQUIVALE},${rows.EQUIVALE},${rows.COSTO},${pre},${totalexento},${Number(rows.EXISTENCIA)},'${rows.CODBODEGA}','${rows.NOLOTE}');" class="border-bottom">
                <td >
                    ${funciones.limpiarTexto(rows.DESPROD)}
                    <br>
                    <small class="text-danger"><b>${rows.CODPROD}</b></small>
                    <br>
                    <b class"bg-danger text-white">${rows.CODMEDIDA}</b>
                    <small>(${rows.EQUIVALE})</small>
                </td>
                <td>${funciones.setMoneda(pre || 0,'Q ')}
                    <br>
                    <small class="${strC}">E:${funciones.setMoneda(exist,'')}</small>
                </td>
                <td>
                    ${rows.NOLOTE}
                    <br>
                    <small class="negrita">Bodega: ${rows.CODBODEGA}</small>
                </td>
            </tr>`
        })
        tabla.innerHTML= str;
        
    }, (error) => {
        tabla.innerHTML ='<label>No se pudo cargar la lista...</label>';
    })
    .catch((error)=>{
        tabla.innerHTML ='<label>No se pudo cargar la lista...</label>';
    })




};

//gestiona la apertura de la cantidad
function getDataMedidaProducto(codprod,desprod,codmedida,cantidad,equivale,totalunidades,costo,precio,exento,existencia,codbodega,nolote){

    //if(parseInt(existencia)>0){
        GlobalSelectedCodprod = codprod;
        GlobalSelectedDesprod = desprod;
        GlobalSelectedCodmedida = codmedida;
        GlobalSelectedEquivale = parseInt(equivale);
        GlobalSelectedCosto = parseFloat(costo);
        GlobalSelectedPrecio = parseFloat(precio);
        
        GlobalSelectedCodBodega = codbodega.toString();
        GlobalSelectedNoLote = nolote.toString();

        GlobalSelectedExento = parseInt(exento);
        GlobalSelectedExistencia = parseInt(existencia);
    
        //modal para la cantidad del producto
        document.getElementById('txtDesProducto').innerText = desprod; //label
        document.getElementById('txtCodMedida').innerText = codmedida; //label
        document.getElementById('txtCantidadDescuento').value = 0; //label
        
        document.getElementById('txtPrecioProducto').innerText = funciones.setMoneda(precio,'Q'); //label
        document.getElementById('txtSubTotal').innerText = funciones.setMoneda(precio,'Q'); //label
        document.getElementById('txtSubTotalDescuento').innerText = funciones.setMoneda(precio,'Q'); //label
        
        
        document.getElementById('txtCantidad').value = 1;
    
        $("#ModalCantidadProducto").modal('show');    
    //document}else{
        //funciones.AvisoError('Producto SIN EXISTENCIA')
    //}


};

//GRID TEMP VENTAS
// agrega el producto a temp_ventas
async function fcnAgregarProductoVenta(codprod,desprod,codmedida,cantidad,equivale,totalunidades,costo,precio,exento,descuento){
   
    if(Number(GlobalSelectedExistencia)<Number(totalunidades)){
        //funciones.AvisoError('No pude agregar una cantidad mayor a la existencia');
        //return;
    };

    document.getElementById('btnAgregarProducto').innerHTML = GlobalLoader;
    document.getElementById('btnAgregarProducto').disabled = true;

    //document.getElementById('tblResultadoBusqueda').innerHTML = '';
    let cmbTipoPrecio = document.getElementById('cmbTipoPrecio');
        let totalcosto = Number(costo) * Number(cantidad);
        let totalprecio = Number(precio) * Number(cantidad);
        
        let coddoc = document.getElementById('cmbCoddoc').value;
        try {        
                var data = {
                    EMPNIT:GlobalEmpnit,  
                    CODSUCURSAL:GlobalCodSucursal,
                    CODDOC:coddoc,     
                    CODPROD:codprod,
                    DESPROD:desprod,
                    CODMEDIDA:codmedida,
                    CANTIDAD:cantidad,
                    EQUIVALE:equivale,
                    TOTALUNIDADES:totalunidades,
                    COSTO:costo,
                    PRECIO:precio,
                    TOTALCOSTO:totalcosto,
                    TOTALPRECIO:totalprecio,
                    EXENTO:exento,
                    USUARIO:GlobalUsuario,
                    TIPOPRECIO:GlobalSelectedTipoClie,
                    EXISTENCIA:GlobalSelectedExistencia,
                    CODBODEGA:GlobalSelectedCodBodega.toString(),
                    NOLOTE:GlobalSelectedNoLote.toString(),
                    CODLISTA:GlobalSelectedCodLista,
                    DESCUENTO:Number(descuento.value||0)
                };
                insertTempVentas(data)
                .then(()=>{                    
      
                        $('#ModalCantidadProducto').modal('hide') //MARCADOR
                        funciones.showToast('Agregado: ' + desprod);
                        
                        fcnCargarGridTempVentas('tblGridTempVentas');
                        
                        document.getElementById('btnAgregarProducto').innerHTML  = `<i class="fal fa-check"></i>`;
                        document.getElementById('btnAgregarProducto').disabled = false;
                        let txbusqueda = document.getElementById('txtBusqueda');
                        txbusqueda.value = '';
                        
                  })
                  .catch(
                      ()=>{
                        document.getElementById('btnAgregarProducto').innerHTML  = `<i class="fal fa-check"></i>`;
                        document.getElementById('btnAgregarProducto').disabled = false;
                        funciones.AvisoError('No se pudo agregar este producto a la venta actual');
                      }
                  )
        
        } catch (error) {
            document.getElementById('btnAgregarProducto').innerHTML  = `<i class="fal fa-check"></i>`;
            document.getElementById('btnAgregarProducto').disabled = false;
        }
   

};

function fcnEliminarItem(id){
    funciones.Confirmacion('¿Está seguro que desea quitar este item?')
    .then((value)=>{
        if(value==true){
                deleteItemVenta(id)
                  .then(()=>{                       
                        //document.getElementById(id.toString()).remove();
                        funciones.showToast('item eliminado');
                        fcnCargarGridTempVentas('tblGridTempVentas');
                  })
                  .catch(
                      ()=>{
                        funciones.AvisoError('No se pudo remover este producto a la venta actual');
                      }
                  )
        }        
    })
    
};

async function fcnCargarGridTempVentas(idContenedor){
    
    let tabla = document.getElementById(idContenedor);
    tabla.innerHTML = GlobalLoader;

    let varTotalVenta = 0; let varTotalCosto = 0; let varTotalDescuento = 0;
    let varTotalItems =0;

    let btnCobrarTotal = document.getElementById('btnCobrar')
    btnCobrarTotal.disabled = true; //.innerText =  'Terminar';
   
    let coddoc = document.getElementById('cmbCoddoc').value;
    
    let containerTotalVenta = document.getElementById('txtTotalVenta');
    containerTotalVenta.innerText = '--';

    let containerTotalItems = document.getElementById('txtTotalItems');
    containerTotalItems.innerHTML = '--'

    try {
        selectTempventas(GlobalUsuario)
        .then((response)=>{
            let idcant = 0;
            let data = response.map((rows)=>{
                idcant = idcant + 1;
                varTotalItems += 1;
                varTotalVenta = varTotalVenta + Number(rows.TOTALPRECIO);
                varTotalCosto = varTotalCosto + Number(rows.TOTALCOSTO);
                varTotalDescuento += Number(rows.DESCUENTO);
                return `
                <tr id="${rows.ID.toString()}" class="border-mostaza card card-rounded bg-white" ondblclick="funciones.hablar('${rows.DESPROD}')">
                    <td class="text-left">
                        ${rows.DESPROD}
                        <br>
                        <div class="row">
                            <div class="col-7">
                                <small class="negrita"><b>${rows.CODPROD} (Equivale: ${rows.EQUIVALE})</b></small>
                                <br>
                                <small>
                                    Cantidad:<b class="text-info h4" id=${idcant}>${rows.CANTIDAD}</b>  ${rows.CODMEDIDA}  -  Precio Un:<b class="text-info h5">${funciones.setMoneda(rows.PRECIO,'Q')}</b>
                                </small>
                            </div>
                            <div class="col-5">

                                <div class="text-right" id=${'S'+idcant}>
                                    <b class="text-secondary" style="font-size:110%">${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</b>
                                    <br><b class="text-danger" style="font-size:100%">${funciones.setMoneda(rows.DESCUENTO,'Q')}</b>
                                    <br><b class="text-mostaza" style="font-size:120%">${funciones.setMoneda(Number(rows.TOTALPRECIO)-Number(rows.DESCUENTO),'Q')}</b>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-4 " align="left">
                                <small class="negrita">LOTE: ${rows.NOLOTE}</small>
                            </div>
                            <div class="col-4 " align="right">
                                <button class="btn btn-secondary btn-sm" onClick="fcnCambiarCantidad(${rows.ID},${rows.CANTIDAD},'${rows.CODPROD}',${rows.EXISTENCIA},${rows.PRECIO});">
                                    <i class="fal fa-edit"></i>Editar
                                </button>    
                            </div>
                            <div class="col-4 text-right" align="right">
                                <button class="btn btn-sm btn-danger" onclick="fcnEliminarItem(${rows.ID});">
                                    <i class="fal fa-trash"></i>Quitar
                                </button>    
                            </div>
                        </div>
                    </td>
                    <br>                                        
                </tr>`
           }).join('\n');
           tabla.innerHTML = data;
           GlobalTotalDocumento = varTotalVenta;
           GlobalTotalCostoDocumento = varTotalCosto;
           GlobalTotalDescuento = varTotalDescuento;
           containerTotalVenta.innerText = funciones.setMoneda(GlobalTotalDocumento,'Q ');
           document.getElementById('txtTotalDescuento').innerText =funciones.setMoneda(GlobalTotalDescuento,'Q ');
           document.getElementById('txtTotalPagar').innerText =funciones.setMoneda(Number(GlobalTotalDocumento)-Number(GlobalTotalDescuento),'Q ');
           

           if(GlobalTotalDocumento==0){
                btnCobrarTotal.disabled = true;
           }else{
                btnCobrarTotal.disabled = false;
           }
           containerTotalItems.innerHTML = `${varTotalItems} items`;
        })
    } catch (error) {
        GlobalTotalDocumento = 0;
        GlobalTotalCostoDocumento = 0;
        GlobalTotalDescuento = 0;
        tabla.innerHTML = 'No se logró cargar la lista...';
        containerTotalVenta.innerText = '0';
        document.getElementById('txtTotalDescuento').innerText = '0';
        document.getElementById('txtTotalPagar').innerText = '0';
           
        btnCobrarTotal.disabled = true; //innerText =  'Terminar';
        containerTotalItems.innerHTML = `0 items`;
    }

};

async function BACKUP_fcnCargarGridTempVentas(idContenedor){
    
    let tabla = document.getElementById(idContenedor);
    tabla.innerHTML = GlobalLoader;

    let varTotalVenta = 0; let varTotalCosto = 0;
    let varTotalItems =0;

    let btnCobrarTotal = document.getElementById('btnCobrar')
    btnCobrarTotal.disabled = true; //.innerText =  'Terminar';
   
    let coddoc = document.getElementById('cmbCoddoc').value;
    
    let containerTotalVenta = document.getElementById('txtTotalVenta');
    containerTotalVenta.innerText = '--';

    let containerTotalItems = document.getElementById('txtTotalItems');
    containerTotalItems.innerHTML = '--'

    try {
        selectTempventas(GlobalUsuario)
        .then((response)=>{
            let idcant = 0;
            let data = response.map((rows)=>{
                idcant = idcant + 1;
                varTotalItems += 1;
                varTotalVenta = varTotalVenta + Number(rows.TOTALPRECIO);
                varTotalCosto = varTotalCosto + Number(rows.TOTALCOSTO);
                return `
                <tr id="${rows.ID.toString()}" class="border-mostaza card card-rounded bg-white" ondblclick="funciones.hablar('${rows.DESPROD}')">
                    <td class="text-left">
                        ${rows.DESPROD}
                        <br>
                        <div class="row">
                            <div class="col-7">
                                <small class="negrita"><b>${rows.CODPROD} (Equivale: ${rows.EQUIVALE})</b></small>
                                <br>
                                <small>
                                    Cantidad:<b class="text-info h4" id=${idcant}>${rows.CANTIDAD}</b>  ${rows.CODMEDIDA}  -  Precio Un:<b class="text-info h5">${funciones.setMoneda(rows.PRECIO,'Q')}</b>
                                </small>
                            </div>
                            <div class="col-5">
                                <div class="text-right" id=${'S'+idcant}>
                                    <b class="text-mostaza" style="font-size:120%">${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</b>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-4 " align="left">
                                <small class="negrita">LOTE: ${rows.NOLOTE}</small>
                            </div>
                            <div class="col-4 " align="right">
                                <button class="btn btn-secondary btn-sm" onClick="fcnCambiarCantidad(${rows.ID},${rows.CANTIDAD},'${rows.CODPROD}',${rows.EXISTENCIA},${rows.PRECIO});">
                                    <i class="fal fa-edit"></i>Editar
                                </button>    
                            </div>
                            <div class="col-4 text-right" align="right">
                                <button class="btn btn-sm btn-danger" onclick="fcnEliminarItem(${rows.ID});">
                                    <i class="fal fa-trash"></i>Quitar
                                </button>    
                            </div>
                        </div>
                    </td>
                    <br>                                        
                </tr>`
           }).join('\n');
           tabla.innerHTML = data;
           GlobalTotalDocumento = varTotalVenta;
           GlobalTotalCostoDocumento = varTotalCosto;
           containerTotalVenta.innerText = funciones.setMoneda(GlobalTotalDocumento,'Q ');
           
           if(GlobalTotalDocumento==0){
                btnCobrarTotal.disabled = true;
           }else{
                btnCobrarTotal.disabled = false;
           }
           containerTotalItems.innerHTML = `${varTotalItems} items`;
        })
    } catch (error) {
        tabla.innerHTML = 'No se logró cargar la lista...';
        containerTotalVenta.innerText = '0';
        btnCobrarTotal.disabled = true; //innerText =  'Terminar';
        containerTotalItems.innerHTML = `0 items`;
    }

};

async function fcnUpdateTempRow(id,cantidad,precio){

    //--------------------------
    if(Number(GlobalSelectedExistencia)<Number(cantidad)){
        //funciones.AvisoError('No pude agregar una cantidad mayor a la existencia');
        //return;
    };
    //--------------------------

    return new Promise((resolve, reject) => {
            //OBTIENE LOS DATOS DE LA ROW    
            selectDataRowVenta(id,cantidad,precio)
            .then(()=>{
                fcnCargarGridTempVentas('tblGridTempVentas');
                resolve();
            })
            .catch(()=>{
                funciones.AvisoError('No se logró Eliminar la lista de productos agregados');
                reject();
            })

        });
};

async function fcnCambiarCantidad(id,cantidad,codprod, existencia,precio){
    
    GlobalSelectedId = id;
    GlobalSelectedExistencia = Number(existencia);
    //$('#ModalCantidad').modal('show');
    document.getElementById('txtCantNuevaCant').value = cantidad;
    document.getElementById('txtCantNuevoPrecio').value = precio;

    $('#modalCambiarCantidadProducto').modal('show');
    
};

async function fcnNuevoPedido(){
    classNavegar.lista_clientes();
};


//FINALIZAR PEDIDO
async function fcnFinalizarPedido(){
    
    fcnCargarGridTempVentas('tblGridTempVentas');

    if(GlobalSelectedCodCliente.toString()=='SI'){funciones.AvisoError('Datos del cliente incorrectos, por favor, seleccione cliente nuevamente');return;}

    let codcliente = GlobalSelectedCodCliente;
    let ClienteNombre = funciones.limpiarTexto(document.getElementById('txtNombre').value);
    let dirclie = funciones.limpiarTexto(document.getElementById('txtDireccion').value); // CAMPO DIR_ENTREGA
    let obs = funciones.limpiarTexto(document.getElementById('txtEntregaObs').value); 
    let direntrega = "SN"; //document.getElementById('txtEntregaDireccion').value; //CAMPO MATSOLI
    let codbodega = GlobalCodBodega;
    //let cmbTipoEntrega = document.getElementById('cmbEntregaConcre').value; //campo TRANSPORTE
    let txtFecha = new Date(document.getElementById('txtFecha').value);
    let anio = txtFecha.getFullYear();
    let mes = txtFecha.getUTCMonth()+1;
    let d = txtFecha.getUTCDate() 
    let fecha = anio + '-' + mes + '-' + d; // CAMPO DOC_FECHA
    let dia = d;
    let hora = funciones.getHora();
    let fe = txtFecha;// new Date(document.getElementById('txtEntregaFecha').value);
    let ae = fe.getFullYear();
    let me = fe.getUTCMonth()+1;
    let de = fe.getUTCDate() 
    let fechaentrega = ae + '-' + me + '-' + de;  // CAMPO DOC_FECHAENT
    let coddoc = document.getElementById('cmbCoddoc').value;//GlobalCoddoc;
    let correlativoDoc = document.getElementById('txtCorrelativo').value;
    let cmbVendedor = document.getElementById('cmbVendedor');
    let nit = document.getElementById('txtNit').value;
    let nitdocumento = document.getElementById('txtNitDocumento').value;
    let latdoc = document.getElementById('lbDocLat').innerText;
    let longdoc = document.getElementById('lbDocLong').innerText;
    let concre = document.getElementById('cmbConcre').value;

    document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-dollar-sign mr-1 fa-spin"></i>';
    document.getElementById('btnFinalizarPedido').disabled = true;

    gettempDocproductos(GlobalUsuario)
    .then((response)=>{
        //UNA VEZ OBTENIDO EL DETALLE, PROCEDE A GUARDARSE O ENVIARSE

        //OBTIENE EL CORRELATIVO DEL DOCUMENTO
        classTipoDocumentos.getCorrelativoDocumento('PED',coddoc)
        .then((correlativo)=>{
            correlativoDoc = correlativo;             
          
            funciones.Confirmacion('¿Está seguro que desea finalizar esta venta?')
            .then((value)=>{
                if(value==true){
         
                        axios.post('/ventas/insertventa', {
                                jsondocproductos:JSON.stringify(response),
                                sucursal:GlobalCodSucursal,
                                empnit: GlobalEmpnit,
                                coddoc:coddoc,
                                correl: correlativoDoc,
                                anio:anio,
                                mes:mes,
                                dia:dia,
                                fecha:fecha,
                                fechaentrega:fechaentrega,
                                formaentrega:concre,
                                codbodega:codbodega,
                                codcliente: codcliente,
                                nomclie:ClienteNombre,
                                totalcosto:GlobalTotalCostoDocumento,
                                totalprecio:GlobalTotalDocumento,
                                totaldescuento:GlobalTotalDescuento,
                                nitclie:nit,
                                dirclie:dirclie,
                                obs:obs,
                                direntrega:direntrega,
                                usuario:GlobalUsuario,
                                codven:cmbVendedor.value,
                                lat:latdoc,
                                long:longdoc,
                                hora:hora,
                                nitdoc:nitdocumento,
                                fecha_operacion:funciones.getFecha(),
                                concre:concre,
                                tipoclie:GlobalSelectedTipoClie
                        })
                        .then(async(response) => {
                            if(response.data=='error'){
                                document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-dollar-sign mr-1"></i>Enviar Pedido';
                                document.getElementById('btnFinalizarPedido').disabled = false;
    
                                funciones.AvisoError('No se pudo guardar este pedido');        

                            }else{
                                const data = response.data;
                                if (data.rowsAffected[0]==0){
                                    
                                    document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-dollar-sign mr-1"></i>Enviar Pedido';
                                    document.getElementById('btnFinalizarPedido').disabled = false;
    
                                    funciones.AvisoError('No se pudo guardar este pedido');               
    
                                }else{
    
                                    funciones.Aviso('Pedido enviado exitosamente!!')
                                    //classEmpleados.updateMyLocation();            
                                    //actualiza la última venta del cliente
                                    //apigen.updateClientesLastSale(nit,'VENTA');
                                    //elimina el temp ventas asociado al empleado
                                    deleteTempVenta(GlobalUsuario);
                                         
                                    //prepara todo para un nuevo pedido
                                    fcnNuevoPedido();       
                                }
                            }
                        }, (error) => {
                                document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-dollar-sign mr-1"></i>Enviar Pedido';
                                document.getElementById('btnFinalizarPedido').disabled = false;
                                funciones.AvisoError('No se pudo guardar este pedido')
                        });        
                }else{
                    document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-dollar-sign mr-1"></i>Enviar Pedido';
                    document.getElementById('btnFinalizarPedido').disabled = false;   
                }
            })
        })
        .catch(()=>{
            document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-dollar-sign mr-1"></i>Enviar Pedido';
            document.getElementById('btnFinalizarPedido').disabled = false;
            funciones.AvisoError('No se pudo enviar el pedido');                 
        })
    })
    .catch((error)=>{
        document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-dollar-sign mr-1"></i>Enviar Pedido';
        document.getElementById('btnFinalizarPedido').disabled = false;
        funciones.AvisoError('No pude crear la tabla de productos del pedido ' + error);
    })  
};
