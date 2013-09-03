var winston = require('winston')
var mysql = require('mysql')
var logger = require('./lib/winston-mysql')

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'bullfest',
  database : 'logg' 
});


var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.mysql)({ pool: pool })
  ]
});


logger.log('info', 'test', {app:'test', bepp:'apa'})