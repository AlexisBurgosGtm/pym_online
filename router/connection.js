
const config = {
	user: 'iEx',
	password: 'iEx',
	server: 'ELORIGEN\\SQLDEV',
	database: 'VENTAS',
	pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}
};

const sql = require('mssql');

let execute = {
	Query : (res,sqlqry)=>{	
		
		console.log('ejecutando consulta... ' + sqlqry);		

		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					console.log(err.message);
					res.send('error')
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
			  res.send('error');
		  })
		} catch (error) {
			console.log(error);
		  res.send('error')   
		  sql.close();
		}
	},
	command : (rsqlqry)=>{			
		return new Promise((resolve,reject)=>{
			try {
				const pool1 = new sql.ConnectionPool(config, err => {
				  new sql.Request(pool1)
				  .query(sqlqry, (err, result) => {
						sql.close();
						if(err){
							reject(err);		  
						}else{
							resolve(result);
						}					
				  })  
				})
				pool1.on('error', err => {
					sql.close();
					reject(err);
				})
			  } catch (error) {
					sql.close();
					reject(error);
			  }
		})
	},
	start:()=>{
		console.log('intentando iniciar la conexión...')
		//const sql = require('mssql')
		try {
			sql.connect(config).then(()=>{sql.close();})
			console.log('primera conexion exitosa...');
		} catch (error) {
			console.log('primera conexion fallo: ' & error);
		}
	}
}

module.exports = execute;

