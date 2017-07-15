var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.createTable.bind(db,'custom_blueprints_inventory_types', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			blueprint_id: { type:'int',length:11,defaultValue:0 },
			blueprint_eve_id: { type:'int',length:11,defaultValue:0 },
			inventory_type_id: { type:'int',length:11,defaultValue:0 },
			inventory_type_eve_id: { type:'int',length:11,defaultValue:0 },
			user_id: { type:'int',length:11,defaultValue:0 },
			me_1_quantity: { type:'int',length:11,defaultValue:0 },
			me_10_quantity: { type:'int',length:11,defaultValue:0 }
		},callback)
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.dropTable.bind(db,'custom_blueprints_inventory_types')
	], callback)
}
