var 	
	should = require('chai').should(),
	Winston = require('Winston'),
	Mysql = require('../lib/winston-mysql.js').Mysql,

	con = require('./test-setup').con,
	DB = require('./test-setup').DB;

var transport = new Mysql({connection:con});



describe('winston-mysql', function() {
	it('should be an instance of mysql', function(){
		transport.should.be.an.instanceof(Mysql)
	});

	it('should have a log method', function(){
		transport.log.should.be.a('Function')
	});

});

var logger = new (Winston.Logger);
		logger.add(Mysql, {connection:con});



describe('winston-mysql #log', function() {

	describe('silent', function() {
		var logger = new (Winston.Logger);
		logger.add(Mysql, {connection:con, silent: true});

		it('should not log when silent',function(done){
			logger.log('info', 'testmessage', function(err, level, msg, meta){
				// get rows from DB
				DB.get(function(err, rows){
					rows.should.be.emtpy
					done();
				});
			});
		});
	});

	describe('logging', function(){

		var logger = new (Winston.Logger);
		logger.add(Mysql, {connection:con});

		afterEach(function(done){
			DB.clear(function(err){
				
				done();
			});
		});
		

		it('should save message', function(done){
			logger.log('info', 'this is an error', function(err, level, msg, meta){
				DB.get(function(err, rows){
					
					rows.should.have.length(1);
					rows[0].msg.should.equal('this is an error');
					
					done();
				});
			});
		});

		it('should save metadata',function(done){
			var metadata = {err:'fel', order:1}
			
			logger.log('error', 'this is an error', metadata, function(err, level, msg, meta){
				DB.get(function(err, rows){

					rows.should.have.length(1);
					
					JSON.parse(rows[0].meta).should.eql(metadata);
					done();
				});
			});
		});
	});
});