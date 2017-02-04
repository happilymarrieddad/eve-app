var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	async.series([
		db.addColumn.bind(db,'blueprints','manufactured_inventory_type_id',{
		  	type:'int',
		  	length:11,
		  	defaultValue:'0'
		})
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.removeColumn.bind(db,'blueprints','manufactured_inventory_type_id')
	], callback)
}
