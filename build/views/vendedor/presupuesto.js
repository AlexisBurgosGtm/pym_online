function getView(){
    let view = {
        body:()=>{
            return `
            <div class="col-12 p-0">
                <div class="tab-content" id="myTabHomeContent">
                    <div class="tab-pane fade show active" id="dia" role="tabpanel" aria-labelledby="dias-tab">
                            ${view.ventaDia()}
                    </div>
                    <div class="tab-pane fade" id="mes" role="tabpanel" aria-labelledby="clientes-tab">
                            ${view.ventaMes()}
                    </div>

                    <div class="tab-pane fade" id="presupuesto" role="tabpanel" aria-labelledby="home-tab">
                            ${view.presupuesto()}
                    </div>
                </div>
                <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active negrita text-success" id="tab-dia" data-toggle="tab" href="#dia" role="tab" aria-controls="profile" aria-selected="false">
                            <i class="fal fa-list"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link negrita text-danger" id="tab-mes" data-toggle="tab" href="#mes" role="tab" aria-controls="home" aria-selected="true">
                            <i class="fal fa-comments"></i></a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link negrita text-info" id="tab-presupuesto" data-toggle="tab" href="#presupuesto" role="tab" aria-controls="home" aria-selected="true">
                            <i class="fal fa-edit"></i></a>
                    </li>            
                </ul>
            </div>
            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow" id="btnAtrasMenu">
                <i class="fal fa-arrow-left"></i>
            </button>
            
            <button class="btn btn-info btn-bottom-ml btn-xl btn-circle hand shadow" id="btnMenuDia">
                <i class="fal fa-box"></i>
            </button>

            <button class="btn btn-success btn-bottom-mr btn-xl btn-circle hand shadow" id="btnMenuMes">
                <i class="fal fa-calendar"></i>
            </button>

            <button class="btn btn-mostaza btn-bottom-r btn-xl btn-circle hand shadow" id="btnMenuPresupuesto">
                <i class="fal fa-chart-pie"></i>
            </button>

        `
        },
        ventaDia:()=>{
            return `
            <div class="card card-rounded shadow p-2">
                <div class="card-body">
                    <h5 class="negrita text-info">Venta por Día</h5>
                    <div class="form-group">
                        <label>Fecha:</label>
                        <input type="date" class="form-control" id="txtFecha">
                    </div>
                </div>
            </div>

            <br>

            <div class="card card-rounded shadow p-2">
                <div class="card-body">
                    <div class="table-responsive col-12">
                        <h5 class="text-danger" id="lbTotalVentaDia">Q0.00<h5>
                        <table class="table table-responsive">
                            <thead class="bg-info text-white">
                                <tr>
                                    <td>Documento</td>
                                    <td>Cliente</td>
                                    <td>Importe</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblVentaDia">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>          
            `
        },
        ventaMes:()=>{
            return `
            <div class="card card-rounded shadow p-2">
                <div class="card-body">
                    <h5 class="negrita text-success">Venta por Mes</h5>
                    <div class="form-group">
                        <label>Mes / Año:</label>
                        <div class="input-group">
                            <select class="form-control" id="cmbMes">
                            </select>
                            <select class="form-control" id="cmbAnio">
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <br>

            <div class="card card-rounded shadow p-2">
                <div class="card-body">
                    <div class="table-responsive col-12">
                        <h5 class="text-danger" id="lbTotalVentaMes">Q0.00<h5>
                        <table class="table table-responsive">
                            <thead class="bg-success text-white">
                                <tr>
                                    <td>Fecha</td>
                                    <td>Importe</td>
                                </tr>
                            </thead>
                            <tbody id="tblVentaMes">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>          
            `
        },
        presupuesto:()=>{
            return `
            <div class="card card-rounded shadow p-2">
                <div class="card-body">
                    <h5 class="negrita text-mostaza">Presupuesto Año</h5>
                    <div class="form-group">
                        <label>Seleccione Año:</label>                        
                        <select class="form-control" id="cmbAnioP">
                        </select>
                    </div>
                </div>
            </div>

            <br>

            <div class="card card-rounded shadow p-2">
                <div class="card-body p-2">

                
                

                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){


    document.getElementById('btnMenuDia').addEventListener('click',()=>{
            document.getElementById('tab-dia').click();
    });

    document.getElementById('btnMenuMes').addEventListener('click',()=>{
        document.getElementById('tab-mes').click();
        get_tbl_mes();
    });

    document.getElementById('btnMenuPresupuesto').addEventListener('click',()=>{
        document.getElementById('tab-presupuesto').click();
        get_tbl_presupuesto();
    });

    document.getElementById('btnAtrasMenu').addEventListener('click',()=>{
        classNavegar.inicio_vendedor();
    });

    document.getElementById('txtFecha').value = funciones.getFecha();

    document.getElementById('cmbMes').innerHTML = funciones.ComboMeses();
    document.getElementById('cmbAnio').innerHTML = funciones.ComboAnio();

    document.getElementById('cmbAnioP').innerHTML = funciones.ComboAnio();
    
    let f = new Date(); 
    document.getElementById('cmbMes').value = (f.getMonth()+1)
    document.getElementById('cmbAnio').value = (f.getUTCFullYear())
    document.getElementById('cmbAnioP').value = (f.getUTCFullYear())




    document.getElementById('txtFecha').addEventListener('change',()=>{
        get_tbl_dia();
    });

    document.getElementById('cmbMes').addEventListener('change',()=>{
        get_tbl_mes();
    });
    document.getElementById('cmbAnio').addEventListener('change',()=>{
        get_tbl_mes();
    });
    document.getElementById('cmbAnioP').addEventListener('change',()=>{
        get_tbl_presupuesto();
    });


    get_tbl_dia();


    funciones.slideAnimationTabs();

};

function initView(){
   
    getView();
    addListeners();

};


function getParametros(tipo){

    let param = '';

    switch (tipo) {
        case 'PEDIDOS':
        data_usuario.map((r)=>{
            if(r.TIPODOC=='PED'){
                param += `'${r.NOMOPERACION}',`
            }
        })
            break;

    }

    param = param.substr(0, param.length - 1); 

    return param;

};

function get_tbl_dia(){

    let fecha = funciones.devuelveFecha('txtFecha');
    let container = document.getElementById('tblVentaDia');
    container.innerHTML = GlobalLoader;


    let paramCoddoc = getParametros('PEDIDOS');


    let str = '';

    axios.post('/presupuesto/dia', {
        sucursal: GlobalCodSucursal,
        fecha:fecha,
        coddoc:paramCoddoc
    })
    .then((response) => {
        if(response=='error'){
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = 'No hay datos para mostrar...';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                str += `
                <tr>
                    <td>
                        ${r.CODDOC}-${r.CORRELATIVO}
                        <br>
                        <small>${funciones.convertDateNormal(r.FECHA)}</small>
                    </td>
                    <td>
                        ${r.CLIENTE} (NIT: ${r.NIT})
                        <br>
                        <small>${r.DIRCLIE}</small>
                    </td>
                    <td>${funciones.setMoneda(r.IMPORTE,'Q')}</td>
                    <td>
                        <button class="btn bt-md btn-circle btn-info hand shadow" onclick="">
                            <i class="fal fa-list"></i>
                        </button>
                    </td>
                </tr>

                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        console.log(error);
        funciones.AvisoError('Error en la solicitud');
        container.innerHTML = 'No hay datos para mostrar...';
    });

};

function get_tbl_mes(){

    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;
    let container = document.getElementById('tblVentaMes');
    container.innerHTML = GlobalLoader;



};


function get_tbl_presupuesto(){

    let aniop = document.getElementById('cmbAnioP').value;
    let container = document.getElementById('');
    container.innerHTML = GlobalLoader;

    

};