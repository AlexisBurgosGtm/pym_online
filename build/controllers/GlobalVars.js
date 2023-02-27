let versionapp = 'Versión 2.2023';

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
let GlobalCodBodega = '01';
let GlobalTipoCobro = 'TERMINAR';

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
// global vars para cantidad producto

let GlobalSelectedCodEmbarque ='';
let GlobalSelectedStatus=0;
let GlobalSelectedSt = 'O';
let GlobalSelectedCoddoc = '';
let GlobalSelectedCorrelativo = '';

let GlobalSelectedApp = '';

let GlobalSistema = 'ISC';


let GlobalLoaderMini = `<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>`;

let GlobalLoader = `
                <div>
                    <div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-info" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-danger" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-warning" role="status"><span class="sr-only">Loading...</span></div>
                </div>
                `

let GlobalUrl = document.location.origin.toString();

let nowhatsapp = '50257255092';


let FEL = {
    CodigoEstablecimiento:"1",
    NITEmisor:"",
    NombreComercial:"GRANJA AVICOLA SANTA FE",
    NombreEmisor:"GRANJA AVICOLA SANTA FE, S.A.",
    Direccion:"CIUDAD",
    CodigoPostal:"06012",
    Municipio:"SANTA CRUZ NARANJO",
    Departamento:"SANTA ROSA",
    ACCESO_REQ_NOMBRE:"GRANJAASF",
    ACCESO_REQ_CLAVE:"AAAAFFDD",
    ACCESO_FIRMA_USUARIO:"GRAN",
    ACCESO_FIRMA_CLAVE:"654f",
    URL_REPORT_INFILE: "https://report.feel.com.gt/ingfacereport/ingfacereport_documento?uuid=",
    CONFIG_FEL_HABILITADO: 'SI'
};

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


