var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.createTable.bind(db,'blueprints', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			name: { type: "string", length:60 },
			inventory_type_id: { type:'int',length:11,defaultValue:0 },
			eve_id: { type:'int',length:11,defaultValue:0 }
		},function (err) {
			if (err) { callback(err);return }
			db.connection.query([
				'ALTER TABLE blueprints',
				'ADD updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
				'ON UPDATE CURRENT_TIMESTAMP,',
				'ADD created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP'
			].join(' '),function (err) {
				if (err) { callback(err);return }
				db.connection.query([
					'CREATE TRIGGER blueprints_insert',
					'BEFORE INSERT ON blueprints FOR EACH ROW SET NEW.created_at = CURRENT_TIMESTAMP'
				].join(' '),function() {
					callback(err)
				})
			})
		})
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.runSql.bind(db,'DROP TRIGGER blueprints_insert'),
		db.dropTable.bind(db,'blueprints')
	], callback)
}
