var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.addColumn.bind(db,'blueprints','high_profit',{
		  	type:'string',
		  	length:60,
		  	defaultValue:'0'
		}),
		db.addColumn.bind(db,'blueprints','low_profit',{
		  	type:'string',
		  	length:60,
		  	defaultValue:'0'
		}),
		db.addColumn.bind(db,'blueprints','avg_profit',{
		  	type:'string',
		  	length:60,
		  	defaultValue:'0'
		}),
		db.createTable.bind(db,'blueprints_inventory_types', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			blueprint_id: { type:'int',length:11,defaultValue:0 },
			blueprint_eve_id: { type:'int',length:11,defaultValue:0 },
			inventory_type_id: { type:'int',length:11,defaultValue:0 },
			inventory_type_eve_id: { type:'int',length:11,defaultValue:0 },
			me_1_quantity: { type:'int',length:11,defaultValue:0 },
			me_10_quantity: { type:'int',length:11,defaultValue:0 }
		},callback)
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.removeColumn.bind(db,'blueprints','high_profit'),
		db.removeColumn.bind(db,'blueprints','low_profit'),
		db.removeColumn.bind(db,'blueprints','avg_profit'),
		db.dropTable.bind(db,'blueprints_inventory_types')
	], callback)
}
