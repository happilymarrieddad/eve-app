var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.addColumn.bind(db,'inventory_types','sell_for',{
		  	type:'string',
		  	length:60,
		  	defaultValue:'0'
		})
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.removeColumn.bind(db,'inventory_types','sell_for')
	], callback)
}
