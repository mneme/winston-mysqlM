var 
	mysql = require('mysql')

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'bullfest',
  database : 'logg' 
});


var DB = {
	clear: function(callback){
		pool.getConnection(function(err, connection) {
    	if(err){
    		callback(err);
    		return;
    	}
  		connection.query('DELETE FROM winstonlog', function(err, rows) {
        callback(null);
    		connection.release();
  		});
		}); 
	},

	get: function(callback){
		pool.getConnection(function(err, connection) {
	   	if(err){
    		callback(err, null);
    		return;
    	}
  		connection.query('SELECT * FROM winstonlog', function(err, rows) {
    		callback(null, rows)
    		connection.release();
  		});
		}); 
	},
}

exports.DB = DB;
exports.pool = pool;