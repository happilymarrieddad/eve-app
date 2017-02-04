var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	async.series([
		db.addColumn.bind(db,'inventory_types','cost',{
		  	type:'string',
		  	length:60,
		  	defaultValue:'0'
		})
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.removeColumn.bind(db,'inventory_types','cost')
	], callback)
}
