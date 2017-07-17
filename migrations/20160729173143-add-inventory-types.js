var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.createTable.bind(db,'inventory_types', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			name: { type: "string", length:60 },
			eve_id: { type:'int',length:11,defaultValue:0 },
			market_group_id: { type:'int',length:11,defaultValue:0 }
		},function (err) {
			if (err) { callback(err);return }
			db.connection.query([
				'ALTER TABLE inventory_types',
				'ADD updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
				'ON UPDATE CURRENT_TIMESTAMP,',
				'ADD created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP'
			].join(' '),function (err) {
				if (err) { callback(err);return }
				db.connection.query([
					'CREATE TRIGGER inventory_types_insert',
					'BEFORE INSERT ON inventory_types FOR EACH ROW SET NEW.created_at = CURRENT_TIMESTAMP'
				].join(' '),function() {
					callback(err)
				})
			})
		})
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.runSql.bind(db,'DROP TRIGGER inventory_types_insert'),
		db.dropTable.bind(db,'inventory_types')
	], callback)
}
