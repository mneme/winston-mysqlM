var 
	mysql = require('mysql')

var con  = {
  host     : 'localhost',
  user     : 'root',
  password : 'bullfest',
  database : 'logg' 
};


var DB = {
  connection: con,
	clear: function(callback){
    var self = this;
  	var connection = mysql.createConnection(this.connection);
    connection.query('DELETE FROM winstonlog', function(err, rows) {
      if (callback) callback(null);
    	connection.end();
  	}); 
	},

	get: function(callback){
		var self = this;
    var connection = mysql.createConnection(this.connection);
    
    connection.query('SELECT * FROM winstonlog', function(err, rows) {
      if (callback) callback(null, rows)
  		connection.end();
		});
	}
}

exports.con = con;
exports.DB = DB;