let versionapp = 'Versión 3.2023';

let root = document.getElementById('root');
let rootMenu = document.getElementById('rootMenu');
let rootMenuFooter = document.getElementById('rootMenuFooter');
let rootErrores = document.getElementById('rootErrores');

let lbMenuTitulo = document.getElementById('lbMenuTitulo');
let rootMenuLateral = document.getElementById('rootMenuLateral');
const showMenuLateral =(titulo)=>{ $("#modalMenu").modal('show'); lbMenuTitulo.innerText = titulo;};
const hideMenuLateral =()=>{ $("#modalMenu").modal('hide'); lbMenuTitulo.innerText = '';};


let GlobalSelectedDiaUpdated  = 0;
let GlobalObjetivoVenta = 0;
let GlobalCodUsuario = 99999;
let GlobalUsuario = '';
let GlobalPassUsuario = '';
let GlobalNivelUser = 0;
let GlobalTipoUsuario ='';
let GlobalSelectedDia ='';
let GlobalBool = false;

let GlobalSelectedForm = '';

let map; //mapa de leaflet
let GlobalGpsLat = 0;
let GlobalGpsLong = 0;
let GlobalSelectedLat = ''; let GlobalSelectedLong='';
let GlobalMarkerId = 0;
let GlobalSelectedId;
let GlobalSelectedCodigo;
let GlobalSelectedFecha;
let GlobalCoddoc = 'PED01';
let GlobalTotalDocumento = 0;
let GlobalTotalCostoDocumento = 0;
let GlobalTotalDescuento = 0;
let GlobalTotalPagado = 0;
let GlobalCodBodega = '01';
let GlobalTipoCobro = 'TERMINAR';
let GlobalSelectedSaldoVencidoCliente = 0;
let GlobalSelectedTipoClie = '';


let GlobalSelectedCodCategoria = '';

let GlobalSelectedCodven = 0;



let GlobalSelectedCodCliente;
let GlobalSelectedNomCliente;
let GlobalSelectedDirCliente;

// global vars para cantidad producto
let GlobalSelectedCodprod = '';
let GlobalSelectedDesprod = '';
let GlobalSelectedCodmedida = '';
let GlobalSelectedEquivale = 0;
let GlobalSelectedCantidad = 0;
let GlobalSelectedExento = 0;
let GlobalSelectedCosto = 0;
let GlobalSelectedPrecio = 0;
let GlobalSelectedExistencia = 0;
let GlobalSelectedCodBodega = '';
let GlobalSelectedNoLote = '';
let GlobalSelectedCodLista = '';
// global vars para cantidad producto

let GlobalSelectedCodEmbarque ='';
let GlobalSelectedStatus=0;
let GlobalSelectedSt = 'O';
let GlobalSelectedCoddoc = '';
let GlobalSelectedCorrelativo = '';

let GlobalSelectedApp = '';

let GlobalSistema = 'ISC';


let GlobalLoaderMini = `<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>`;

let GlobalLoader = `PyM 
                <div>
                    <div class="spinner-border text-mostaza" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-mostaza" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-mostaza" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-mostaza" role="status"><span class="sr-only">Loading...</span></div>
                </div>
                `

let GlobalUrl = document.location.origin.toString();
let GlobalUrlCalls = '';

let data_usuario = [];

let nowhatsapp = '50257255092';



function showWaitForm(){
    $('#modalWait').modal('show');
};


function hideWaitForm(){
    //esta linea ayuda a que las modales cierren
    if ($('.modal-backdrop').is(':visible')) {
        $('body').removeClass('modal-open'); 
        $('.modal-backdrop').remove(); 
    };

    //$('#modalWait').modal('hide');
    document.getElementById('btnCerrarModalWait').click();

};


//elimina los mensajes de console (  logger.disableLogger()  )
var logger = function()
{
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger =  function enableLogger() 
                        {
                            if(oldConsoleLog == null)
                                return;

                            window['console']['log'] = oldConsoleLog;
                        };

    pub.disableLogger = function disableLogger()
                        {
                            oldConsoleLog = console.log;
                            window['console']['log'] = function() {};
                        };

    return pub;
}();


