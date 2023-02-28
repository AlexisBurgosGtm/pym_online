function getView(){
    let view = {
        body:()=>{
            return `
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
                <div class="card bg-mostaza card-rounded shadow col-12">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 text-left">
                                <label class="text-white negrita h5" style="font-size:140%" id="lbTotalItems">0 items</label>
                            </div>
                            <div class="col-6 text-right">
                                <h1 class="text-white negrita">Q 0.00</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <br>

            <div class="row">
                <div class="col-5">
                    <div class="card card-rounded shadow border-mostaza col-12 p-2">
                        <div class="card-body">

                            <b class="text-mostaza">Productos agregados a la Factura</b>
                            
                            <br><br>

                            
                                <table class="table table-responsive table-striped col-12">
                                    <thead class="bg-mostaza text-white">
                                        <tr>
                                            <td>PRODUCTO</td>
                                            <td>SUBTOTAL</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblPosPedido"></tbody>
                                </table>
                            

                        </div>
                    </div>
                </div>
                <div class="col-7">
                    <div class="card card-rounded shadow border-mostaza col-12 p-2">
                        <div class="card-body">
                            <div class="card-deck" id="tblPosClasificaciones">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">


            </div>

            <button class="btn btn-secondary btn-xl btn-bottom-l btn-circle shadow hand" id="btnPosAtras">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        precios:()=>{
            return `
            
            `
        },
        documento:()=>{
            return `
            
            `
        }
    }

    root.innerHTML = view.body();

};


function addListeners(){



    // LISTENER DE LA VENTANA DE PEDIDOS
    listener_vista_pedido();

    get_cards_clasificaciones();

    funciones.slideAnimationTabs();


};

function listener_vista_pedido(){

    document.getElementById('btnPosAtras').addEventListener('click',()=>{
        classNavegar.inicio_vendedor();
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

    axios.post('/api/claseuno', {
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
                <div class="card card-rounded shadow border-mostaza">
                    <div class="card-body p-4">
                        <b class="text-mostaza" style="font-size:180%"><i class="fal fa-box"</i> ${r.DESCRIPCION}</b>
                    </div>
                </div>
                <br>
                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
    });
    

};