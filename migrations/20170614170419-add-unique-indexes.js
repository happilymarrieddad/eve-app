var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.changeColumn.bind(db, 'inventory_groups', 'name', { type: "string", length:60, notNull: true }),
		db.changeColumn.bind(db, 'inventory_types',  'name', { type: "string", length:60, notNull: true }),
		db.changeColumn.bind(db, 'market_groups',    'name', { type: "string", length:60, notNull: true }),
		db.addIndex.bind(db, 'inventory_groups', 'unique_name', ['name'], true),
		db.addIndex.bind(db, 'inventory_types',  'unique_name', ['name'], true),
		db.addIndex.bind(db, 'market_groups',    'unique_name', ['name'], true)
	], callback);
}

exports.down = function(db, callback) {
	async.series([
		db.removeIndex.bind(db, 'inventory_groups', 'unique_name'),
		db.removeIndex.bind(db, 'inventory_types',  'unique_name'),
		db.removeIndex.bind(db, 'market_groups',    'unique_name'),
		db.changeColumn.bind(db, 'inventory_groups', 'name', { type: "string", length:60 }),
		db.changeColumn.bind(db, 'inventory_types',  'name', { type: "string", length:60 }),
		db.changeColumn.bind(db, 'market_groups',    'name', { type: "string", length:60 })
	], callback);
}

