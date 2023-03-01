function getView(){
    let view = {
        body:()=>{
            return `
                <div class="row">
                    <div class="card bg-mostaza card-rounded shadow col-12">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6 text-left">
                                    <label class="text-white negrita h5" style="font-size:140%" id="lbTotalItems">0 items</label>
                                </div>
                                <div class="col-6 text-right">
                                    <h1 class="text-white negrita" id="lbTotalVenta">Q 0.00</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 p-0">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="pedido" role="tabpanel" aria-labelledby="dias-tab">
                            ${view.pedido()}
                        </div>
                        <div class="tab-pane fade" id="precios" role="tabpanel" aria-labelledby="clientes-tab">
                            ${view.precios()}
                        </div>

                        <div class="tab-pane fade" id="documento" role="tabpanel" aria-labelledby="home-tab">
                            ${view.documento()}
                        </div>
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-pedido" data-toggle="tab" href="#pedido" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>Pedido
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-precios" data-toggle="tab" href="#precios" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>Precios
                        </li> 
                        <li class="nav-item">
                            <a class="nav-link negrita text-info" id="tab-documento" data-toggle="tab" href="#documento" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-edit"></i></a>Finalizar
                        </li>                           
                    </ul>
                </div>
            `
        },
        pedido:()=>{
            return `
            <div class="row">

                <div class="col-6">
                    <div class="card card-rounded shadow border-mostaza col-12 p-2">
                        <div class="card-body">
                            <b class="text-mostaza">Productos agregados a la Factura</b>
                            <br><br>
                            
                                <table class="table table-responsive col-12">
                                    <thead class="bg-mostaza text-white">
                                        <tr>
                                            <td>PRODUCTO</td>
                                            <td>CANTIDAD</td>
                                            <td>SUBTOTAL</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblPosPedido"></tbody>
                                </table>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="col-12 p-0">
                        <div class="tab-content" id="myTabHomeContent">
                            <div class="tab-pane fade show active" id="categorias" role="tabpanel" aria-labelledby="dias-tab">
                                    <div class="card card-rounded shadow border-mostaza col-12 p-2">
                                        <div class="card-body">
                                            <div class="row p-2" id="tblPosClasificaciones">
                
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div class="tab-pane fade" id="productos" role="tabpanel" aria-labelledby="clientes-tab">
                                    <div class="card card-rounded shadow border-mostaza col-12 p-2">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-3 text-left">
                                                    <button class="btn btn-outline-secondary hand shadow" id="btnPosProductosCategoriaAtras">
                                                        <i class="fal fa-arrow-left"></i> Atrás
                                                    </button>
                                                </div>
                                                <div class="col-9">
                                                    <h5 class="text-secondary negrita" id="lbPosCategoriaSeleccionada">Categoria</h5>
                                                </div>
                                            </div>
                                            
                                            <div class="table-responsive col-12 p-2">
                                                <table class="table table-responsive table-border col-12">
                                                    <thead class="bg-mostaza text-white">
                                                        <tr>
                                                            <td>Producto</td>
                                                            <td>Medida</td>
                                                            <td>Precio Un.</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody  id="tblPosProductosCategoria"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>  
                            </div>
                        </div>

                        <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active negrita text-success" id="tab-categorias" data-toggle="tab" href="#categorias" role="tab" aria-controls="profile" aria-selected="false">
                                    <i class="fal fa-list"></i></a>categorias
                            </li>
                            <li class="nav-item">
                                <a class="nav-link negrita text-danger" id="tab-productos" data-toggle="tab" href="#productos" role="tab" aria-controls="home" aria-selected="true">
                                    <i class="fal fa-comments"></i></a>productos
                            </li>                         
                        </ul>
                    </div>
                    
                </div>
            </div>
            
            <div class="row">


            </div>

            <button class="btn btn-secondary btn-xl btn-bottom-l btn-circle shadow hand" id="btnPosAtras">
                <i class="fal fa-arrow-left"></i>
            </button>

            <button class="btn btn-info btn-xl btn-bottom-r btn-circle shadow hand" id="btnPosCobro">
                <i class="fal fa-arrow-right"></i>
            </button>
            `
        },
        precios:()=>{
            return `
            
            `
        },
        documento:()=>{
            return `
            
            <button class="btn btn-secondary btn-xl btn-bottom-l btn-circle shadow hand" id="btnPosDocumentoAtras">
                <i class="fal fa-arrow-left"></i>
            </button>

            `
        }
    }

    root.innerHTML = view.body();

};


function addListeners(){



    // LISTENER DE LA VENTANA DE PEDIDOS
    listener_vista_pedido();

    listener_vista_cobro();

    get_cards_clasificaciones();

    get_tbl_pedido();

    funciones.slideAnimationTabs();


};

function listener_vista_pedido(){

    
    document.getElementById('btnPosAtras').addEventListener('click',()=>{
        classNavegar.inicio_vendedor();
    });

    document.getElementById('btnPosProductosCategoriaAtras').addEventListener('click',()=>{
        document.getElementById('tab-categorias').click();
    });

};

function listener_vista_cobro(){
    
    document.getElementById('btnPosCobro').addEventListener('click',()=>{
        document.getElementById('tab-documento').click();
    });

    document.getElementById('btnPosDocumentoAtras').addEventListener('click',()=>{
        document.getElementById('tab-pedido').click();
    });



};

function initView(){
   
    getView();
    addListeners();

   

};




function get_cards_clasificaciones(){

 
    let container = document.getElementById('tblPosClasificaciones');
    container.innerHTML = GlobalLoader;

    let str = '';

    axios.post('/pos/claseuno', {
        sucursal: GlobalCodSucursal
    })
    .then((response) => {
        if(response=='error'){
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                str += `
                <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <div class="card card-rounded shadow border-mostaza hand" onclick="get_data_card_clasificacion('${r.CODIGO}','${r.DESCRIPCION}')">
                        <div class="card-body p-4">
                            <b class="text-mostaza" style="font-size:100%"><i class="fal fa-box"></i> ${r.DESCRIPCION}</b>
                        </div>
                    </div>
                    <br>
                </div>
                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
    });
    

};

function get_data_card_clasificacion(codigo,descripcion){

    GlobalSelectedCodCategoria = codigo;

    document.getElementById('lbPosCategoriaSeleccionada').innerText = descripcion;
    document.getElementById('tab-productos').click();

    get_tbl_productos_clasificacion(codigo);

};

function get_tbl_productos_clasificacion(codigo){

    let container = document.getElementById('tblPosProductosCategoria');
    container.innerHTML = GlobalLoader;

    let str = '';

    axios.post('/pos/productos_categoria', {
        sucursal: GlobalCodSucursal,
        codigo:codigo
    })
    .then((response) => {        
        if(response=='error'){
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                str += `
                <tr class="hand border-secondary border-top-0 border-left-0 border-right-0" onclick="get_data_producto_categoria('${r.CODPROD}','${r.DESPROD}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}','${r.PRECIO}')">
                    <td>
                        ${r.DESPROD}
                        <br>
                        <small>Código: <b class="text-danger">${r.CODPROD}</b></small>
                        <br>
                        <small>Marca: <b class="text-secondary">${r.DESMARCA}</b></small>
                    </td>
                    <td>
                        ${r.CODMEDIDA} 
                        <br>
                        <small>Equivale: <b class="text-danger">${r.EQUIVALE}</b></small>
                    </td>
                    <td><b class="h4">${funciones.setMoneda(r.PRECIO,'Q')}</b></td>
                </tr>
                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
    });


};


function get_data_producto_categoria(codprod,desprod,codmedida,equivale,costo,precio){

    insert_producto_pedido(codprod,desprod,codmedida,equivale,costo,precio,1)
    .then(()=>{
        funciones.showToast('Producto agregado ' + desprod);
        get_tbl_pedido();
    })
    .catch(()=>{
        funciones.AvisoError('No se pudo agregar')
    })
    

};


function insert_producto_pedido(codprod,desprod,codmedida,equivale,costo,precio,cantidad){
    
    let datos = 
        {
            CODSUCURSAL:GlobalCodSucursal.toString(),
            EMPNIT:GlobalCodSucursal.toString(),
            USUARIO:'',
            CODPROD:codprod.toString(),
            DESPROD:desprod.toString(),
            CODMEDIDA:codmedida.toString(),
            EQUIVALE:Number(equivale),
            COSTO:Number(costo),
            PRECIO:Number(precio),
            CANTIDAD:Number(cantidad),
            TOTALUNIDADES:Number(cantidad * equivale),
            TOTALPRECIO:Number(cantidad * precio)
        };

    

    return new Promise((resolve,reject)=>{
        insertTempVentasPOS(datos)
        .then(()=>{
            resolve();
        }) 
        .catch(()=>{
            reject();
        }) 
    });

};

function get_tbl_pedido(){

    let container = document.getElementById('tblPosPedido');
    container.innerHTML = GlobalLoader;

    let str = '';
    let varTotalItems = 0;
    let varTotalVenta = 0;
    let varTotalCosto = 0;

    selectTempVentasPOS(GlobalCodSucursal)
    .then((data)=>{
        console.log(data);
        let datos = data.map((rows)=>{
            varTotalItems += 1;
            varTotalVenta = varTotalVenta + Number(rows.TOTALPRECIO);
            varTotalCosto = varTotalCosto + Number(rows.TOTALCOSTO);
            return `
            <tr class="border-mostaza border-left-0 border-right-0 border-top-0">
                <td class="text-left">
                    ${rows.DESPROD}
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <small class="negrita"><b>${rows.CODPROD}</b></small>
                        </div>
                    </div>
                </td>
                <td>
                    ${rows.CANTIDAD}
                    <br><small>${rows.CODMEDIDA} (eq: ${rows.EQUIVALE})</small>
                </td>
                <td class="negrita text-danger h4">${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                <td>
                    <button class="btn btn-md btn-circle btn-info shadow hand">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-md btn-circle btn-danger shadow hand" >
                        <i class="fal fa-trash"></i>
                    </button>
                </td>                            
            </tr>`
       }).join('\n');
        container.innerHTML = datos;
        GlobalTotalCostoDocumento = varTotalCosto;
        GlobalTotalDocumento = varTotalVenta;
        document.getElementById('lbTotalItems').innerText = varTotalItems.toString() + ' items';
        document.getElementById('lbTotalVenta').innerText = funciones.setMoneda(varTotalVenta,'Q');
    })
    .catch((error)=>{
        container.innerHTML = 'No hay datos...';
    })

};


function edit_cantidad_pos(){


};

function delete_item_pedido(id){

    funciones.Confirmacion('¿Está seguro que desea quitar este item?')
    .then((value)=>{
        if(value==true){
            deleteItemVentaPOS(id)
            .then(()=>{
                funciones.showToast('Item eliminado');
                get_tbl_pedido();
            })
            .catch(()=>{
                funciones.AvisoError('No se pudo quitar este item');
            })
        }
    })
    
};


