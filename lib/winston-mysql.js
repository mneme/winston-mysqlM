var util = require('util'),
    winston = require('winston'),
    mysql = require('mysql');

//
// options must contain pool
//
var Mysql = function (options) {
  if(!options.connection)
      throw new Error("Argument Missing. Requires options.connection")

  // Name this logger
  this.name = 'Mysql';

  // Set the level from your options
  this.level = options.level || 'info';

  // Currently. Takes a connection object. Is required.
  this.connection = options.connection;

  // No output?
  this.silent = options.silent || false;

  // Table for logging
  this.table = options.table || 'winstonlog'


};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(Mysql, winston.Transport);


Mysql.prototype.log = function (level, msg, meta, callback) {  
  if(this.silent){
    return callback && callback(null, true);
  }
  var self = this;

  var log = {
    level: level,
    msg: msg,
    meta: JSON.stringify(meta),
  }
  
  var query = 'INSERT INTO ' + self.table + ' SET ?'
  var connection = mysql.createConnection(this.connection);

  connection.query(query, log, function(err, rows) {

    if (err) {
      return callback && callback(err, false);
    }
    
    // And done with the connection.
    connection.end();

    return callback && callback(null, true);
  });
};

exports.Mysql = Mysql

