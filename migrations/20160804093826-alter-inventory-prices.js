var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.addColumn.bind(db,'inventory_types','low_price',{
		  	type:'string',
		  	length:60
		}),
		db.addColumn.bind(db,'inventory_types','high_price',{
		  	type:'string',
		  	length:60
		}),
		db.addColumn.bind(db,'inventory_types','avg_price',{
		  	type:'string',
		  	length:60
		})
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.removeColumn.bind(db,'inventory_types','low_price'),
		db.removeColumn.bind(db,'inventory_types','high_price'),
		db.removeColumn.bind(db,'inventory_types','avg_price')
	], callback)
}
