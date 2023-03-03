var express = require("express");
var axios = require('axios');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

const execute = require('./router/connection');
var routerNoticias = require('./router/routerNoticias');
var routerVentas = require('./router/routerVentas');
var routerSucursales = require('./router/routerSucursales');
let routerRepartidor = require('./router/routerRepartidor');
var routerTipoDocs = require('./router/routerTipoDocs');
var routerEmpleados = require('./router/routerEmpleados');
var routerClientes = require('./router/routerClientes');
var routerProductos = require('./router/routerProductos');
let routerDigitacion = require('./router/routerDigitacion');
let routerUsuarios = require('./router/routerUsuarios');
let routerCenso = require('./router/routerCenso');
var routerFEL = require('./router/routerFEL');
var routerConfig = require('./router/routerConfig');
var router_POS = require('./router/router_POS');


var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = process.env.PORT || 7000;

//app.use(bodyParser.json());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));


app.use(express.static('build'));

var path = __dirname + '/'

//manejador de rutas
router.use(function (req,res,next) {
  /*
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, pplication/json');
        // Set to true if you need the website to include cookies in the requests sent
      res.setHeader('Access-Control-Allow-Credentials', true);
  */
  //console.log("/" + req.body);
  next();
});

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

const FEL_URL_LOGIN = "https://felcloud-instance-three.feel.com.gt/api/v2/servicios/externos/login";
const FEL_URL_CONSULTARECEPTORES = 'https://consultareceptores.feel.com.gt/rest/action';
const FEL_URL_CUI = "https://felcloud-instance-three.feel.com.gt/api/v2/servicios/externos/cui";

const Rounder = (value) => {
  return Math.round((+value + 0.00001) * 100) / 100
}

const returnError = (err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).send(err)
}

const parseNit = (nit) => {
  let _nit = nit.replace('.', '')
  _nit = _nit.replace('-', '')
  _nit = _nit.replace('/', '')
  _nit = _nit.replace('.', '')
  return _nit.toUpperCase()
}

const parseSAT = (value) => {
  const _nombre = value.split(',')
  if (_nombre.length === 1 || _nombre.length === 2) {
    return Buffer.from(value,'utf-8').toString()
  } else {
    const _casada = (_nombre[2] !== '') ? ' DE ' + _nombre[2] : ''
    const final = _nombre[3] + ' ' + _nombre[4] + ' ' + _nombre[0] + ' ' + _nombre[1] + _casada
    return Buffer.from(final, 'utf-8').toString()   
	}
}

const fechaDiff = (fecha, fechaFinal) => {
  const fechaInicial = new Date(fecha)
  const fechaVence = new Date(fechaFinal)
  const diff = fechaVence.getTime() - fechaInicial.getTime()

  const fechaHoy = new Date()

  return new Date(fechaHoy.getTime() + diff)
}

const getDiff = (fecha) => {
  //const fecha = storage.getItem('token-vence')
  
  const date = new Date()
  const fechaVence = new Date(fecha)

  const diff = fechaVence.getTime() - date.getTime()

  return diff
}


const tokenInfile = async (fel_alias,fel_llave) => {
  try {
		const params = {
      prefijo: fel_alias,
      llave: fel_llave      
    }
		const postdata = new URLSearchParams(params)
		const { data, status } = await axios({
			url: FEL_URL_LOGIN,
			method: 'POST',
			data: postdata.toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
    if (status === 200) {
      const { token, fecha_de_vencimiento, fecha } = data
      const fechaVence = fechaDiff(fecha, fecha_de_vencimiento)
			//redis.set('token-infile', token)
      //redis.set('token-vence', fechaVence)
      console.log('renovando token ', fechaVence)
      return Promise.resolve({
        status,
        data,
        token,
        fechaVence
      })
    } else {
      console.log('Axios Error')
      console.log(status, data)
      console.log('----')
			//redis.set('token-infile', null)
      //redis.set('token-vence', null)
      return Promise.resolve({
        status,
        data
      })
    }
  } catch (error) {
		console.log('error tokenfile ', error)
    return Promise.reject(error)
  }
}



//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

app.get("/datosnit", async function(req,res){
    
  const {nit, fel_alias, fel_llave} = req.query;
 
  console.log('consultando nit... ')
  console.dir(req.query);

   try {
     const _nit = parseNit(nit)
     const postdata = {
       emisor_codigo: `${fel_alias}`,
       emisor_clave: `${fel_llave}`,
       nit_consulta: `${_nit}`
     }
     const { data } = await axios({
       url: FEL_URL_CONSULTARECEPTORES,
       method: 'POST',
       data: postdata,
       headers: {
         'Content-Type': 'application/json'
       }
     })
     const { nombre } = data;
     console.log(data);
     res.send(nombre);
 
   } catch (e) {
     console.log(e);
     res.send('error:' + e.toString())
   }
   

}); 


app.get("/datosdpi", async function(req,res){
   
 const {dpi, fel_alias, fel_llave} = req.query;

  let cui = dpi;

  try {
   const { token } = await tokenInfile(fel_alias,fel_llave)
   let _token = token;
   
   //CONSULTA EL DPI

   const { data, status } = await axios({
     url: FEL_URL_CUI,
     method: 'POST',
     data: new URLSearchParams({ cui }).toString(),
     headers: {
       'Authorization': `Bearer ${_token}`,
       'Content-Type': 'application/x-www-form-urlencoded'
     }
   })    
   const nombre = (data.cui) ? data.cui.nombre : ''
   //return Promise.resolve(nombre.replace(',',''))
   res.send(nombre.replace(',',''))
  } catch (error) {
   console.log("🚀 ~ file: infileController.js:114 ~ error", error)
   //return Promise.reject(error)
   res.send('error: ' + error.toString());
 }
  

}); 


app.get("/",function(req,res){
  execute.start();
	res.sendFile(path + 'index.html');
}); 

app.get("/login",function(req,res){
  res.redirect('/');
}); 




//Router para SUCURSALES
app.use('/sucursales', routerSucursales);

//Router para app NOTICIAS
app.use('/noticias', routerNoticias);

//Router para app CENSO
app.use('/censo', routerCenso);

//Router para app VENTAS
app.use('/ventas', routerVentas);

// Router pos
app.use('/pos', router_POS);

//Router para app REPARTIDOR
app.use('/repartidor', routerRepartidor);

// Router para Tipodocumentos
app.use('/tipodocumentos', routerTipoDocs);

// Router para empleados o vendedores
app.use('/empleados', routerEmpleados);

// Router para clientes
app.use('/clientes', routerClientes);

// Router para productos
app.use('/productos', routerProductos);

// Router para digitacion
app.use('/digitacion', routerDigitacion);

// Router para usuarios
app.use('/usuarios', routerUsuarios);

// Router para facturación electrónica FEL
app.use('/fel', routerFEL);

// Router para configuraciones
app.use('/config', routerConfig);




app.use("/",router);

app.use("*",function(req,res){
  res.redirect('/');
  //res.send('<h1 class="text-danger">NO DISPONIBLE</h1>');
});




// SOCKET HANDLER
io.on('connection', function(socket){
  
  socket.on('avisos', (tipo,mensaje)=>{
    io.emit('avisos', tipo, mensaje);
  });

  socket.on('noticias nueva', (msg,usuario)=>{
    io.emit('noticias nueva', msg,usuario);
  });

  socket.on('productos precio', function(msg,usuario){
	  io.emit('productos precio', msg, usuario);
  });

  socket.on('productos bloqueado', function(msg,usuario){
	  io.emit('productos bloqueado', msg, usuario);
  });

  socket.on('ventas nueva', (msg,usuario)=>{
    io.emit('ventas nueva', msg,usuario);
  })

  // sucede cuando el repartidor marca un pedido y notifica a su respectivo vendedor
  socket.on('reparto pedidomarcado', (msg,status,vendedor)=>{
    io.emit('reparto pedidomarcado', msg,status,vendedor);
  })

  
});


http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});

