var util = require('util'),
    winston = require('winston');

//
// options must contain pool
//
var Mysql = function (options) {
  // Name this logger
  this.name = 'Mysql';

  // Set the level from your options
  this.level = options.level || 'info';

  // Currently requires an external MYSQL connection pool.
  this.pool = options.pool

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

//
// Add to Winston.transports.
//
winston.transports.Mysql = Mysql;

Mysql.prototype.log = function (level, msg, meta, callback) {  
    if(this.silent){
      callback(null, true);
      return;
    }

    var self = this
    this.pool.getConnection(function(err, connection) {
    
    if (err) {
      return callback && callback(err, false);
    }

    var log = {
      level: level,
      msg: msg,
      meta: JSON.stringify(meta),
    }
    var query = 'INSERT INTO ' + self.table + ' SET ?'
    
    connection.query(query, log, function(err, rows) {
  
      if (err) {
        return callback && callback(err, false);
      }
      
      // And done with the connection.
      connection.release();

      return callback && callback(null, true);
    });
  });
};

exports.Mysql = Mysql