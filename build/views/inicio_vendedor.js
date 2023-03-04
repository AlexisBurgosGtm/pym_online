function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0">
                  

                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="menu" role="tabpanel" aria-labelledby="dias-tab">

                                ${view.menu()}

                        </div>
                        <div class="tab-pane fade" id="clientes" role="tabpanel" aria-labelledby="clientes-tab">
                           
                        </div>

                        <div class="tab-pane fade" id="home" role="tabpanel" aria-labelledby="home-tab">
                                   
                          
                        </div>
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-inicio" data-toggle="tab" href="#inicio" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-clientes" data-toggle="tab" href="#clientes" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li> 
                        <li class="nav-item">
                            <a class="nav-link negrita text-info" id="tab-home" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-edit"></i></a>
                        </li>
                                                    
                    </ul>

                </div>
               
            `
        }, 
        menu:()=>{
            return `
            
            <div class="row">

                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4 p-4" align="center">
                    <h3 class="text-mostaza negrita">PYM Online</h3>
                    <img class="img-auto" src="./favicon.png">
                </div>

                <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                    <div class="row">
                        <div class="col-6">
                            <div class="card card-rounded shadow border-mostaza hand" onclick="getMenu('PEDIDOS')">
                                <div class="card-body p-6 text-mostaza negrita">
                                <i class="fal fa-edit negrita text-mostaza" style="font-size:170%"></i>PEDIDOS 
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card card-rounded shadow border-mostaza hand" onclick="getMenu('PRESUPUESTO')">
                                <div class="card-body p-6 text-mostaza negrita">
                                    <i class="fal fa-chart-pie negrita text-mostaza" style="font-size:170%"></i> PRESUPUESTO 
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div class="card card-rounded shadow border-mostaza hand" onclick="getMenu('LIQUIDACION')">
                                <div class="card-body p-6 text-mostaza negrita">
                                <i class="fal fa-car negrita text-mostaza" style="font-size:170%"></i> LIQUIDACIÓN VIÁTICOS 
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card card-rounded shadow border-mostaza hand" onclick="getMenu('PRECIOS')">
                                <div class="card-body p-6 text-mostaza negrita">
                                    <i class="fal fa-book negrita text-mostaza" style="font-size:170%"></i> PRECIOS 
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div class="card card-rounded shadow border-mostaza hand" onclick="getMenu('POS')">
                                <div class="card-body p-6 text-mostaza negrita">
                                <i class="fal fa-tag negrita text-mostaza" style="font-size:170%"></i>PUNTO DE VENTA 
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card card-rounded shadow border-mostaza hand" onclick="getMenu('CREDITOS')">
                                <div class="card-body p-6 text-mostaza negrita">
                                    <i class="fal fa-dollar-sign negrita text-mostaza" style="font-size:170%"></i> CRÉDITOS 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
            `
        }
    }


    root.innerHTML = view.menu();

};


function addListeners(){




    funciones.slideAnimationTabs();


};

function initView(){
   
    getView();
    addListeners();

   

};


function getMenu(opcion){

    switch (opcion) {
        case 'PEDIDOS':
            GlobalCoddoc = 'PED01';
            classNavegar.lista_clientes();
            break;
        case 'CREDITOS':
            
            break;
        case 'LIQUIDACION':
            
            break;
        case 'PRESUPUESTO':
            classNavegar.presupuesto_vendedor();
            break;
        case 'PRECIOS':
            classNavegar.lista_precios();
            break;
        case 'POS':
            classNavegar.modulo_pos();
            break;
    }
};





