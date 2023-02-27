function getView(){
    let view = {
        body: ()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-header">
                    <label class="modal-title text-danger h3" id="">Consulta de Precios</label>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="input-group">
                            
                            <input id="txtBusqueda" type="text" ref="txtBusqueda" class="form-control col-12 border-secondary text-danger negrita" placeholder="Buscar productos..." aria-label="" aria-describedby="button-addon4" />
                            <div class="input-group-prepend">
                                <button class="btn btn-secondary btn-rounded waves-effect waves-themed shadow" type="button" id="btnBuscarProducto">
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
                        <thead class="bg-secondary text-white">
                            <tr>
                                <td>Producto</td>
                                <td>Precio</td>                         
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
        }
    }
    root.innerHTML = view.body();
};

function addEventListeners(){

    document.getElementById('txtBusqueda').addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
        }
        if(e.code=='NumpadEnter'){
            fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
        }
    });
    document.getElementById('btnBuscarProducto').addEventListener('click',()=>{
        fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
    });

    document.getElementById('btnPreciosAtras').addEventListener('click',()=>{
        classNavegar.inicio_vendedor();
    });

};

function initView(){
    getView();
    addEventListeners();
};




function fcnBusquedaProducto(idFiltro,idTablaResultado,idTipoPrecio){
    
    let cmbTipoPrecio = document.getElementById(idTipoPrecio);

    let filtro = document.getElementById(idFiltro).value;
    
    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;


    let str = ""; 

    apigen.precios_lista(GlobalCodSucursal,filtro)
    .then((response) => {
        const data = response;
        //con esta variable determino el tipo de precio a usar            
        let pre = 0;
            
            data.map((rows)=>{
                let exist = Number(rows.EXISTENCIA)/Number(rows.EQUIVALE); let strC = '';
                if(Number(rows.EXISTENCIA<=0)){strC='bg-danger text-white'}else{strC='bg-success text-white'};
                let totalexento = 0;
                if (rows.EXENTO==1){totalexento=Number(rows.PRECIO)}
                
                switch (cmbTipoPrecio.value) {
                    case 'P':
                        pre = Number(rows.PRECIO)
                        break;
                    case 'C':
                        pre = Number(rows.PRECIOC)
                        break;
                    case 'B':
                        pre = Number(rows.PRECIOB)
                        break;
                    case 'A':
                        pre = Number(rows.PRECIOA)
                        break;
                    case 'K':
                        pre = Number(0.01)
                        break;
     
                }

                str += `<tr id="${rows.CODPROD}" class="border-bottom">
                <td >
                    ${funciones.quitarCaracteres(rows.DESPROD,'"'," pulg",true)}
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