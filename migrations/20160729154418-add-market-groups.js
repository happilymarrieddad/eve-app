var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.createTable.bind(db,'market_groups', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			name: { type: "string", length:60 },
			description: { type: "string", length:1024 },
			eve_id: { type:'int' }
		},function (err) {
			if (err) { callback(err);return }
			db.connection.query([
				'ALTER TABLE market_groups',
				'ADD updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
				'ON UPDATE CURRENT_TIMESTAMP,',
				'ADD created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP'
			].join(' '),function (err) {
				if (err) { callback(err);return }
				db.connection.query([
					'CREATE TRIGGER market_groups_insert',
					'BEFORE INSERT ON market_groups FOR EACH ROW SET NEW.created_at = CURRENT_TIMESTAMP'
				].join(' '),function() {
					callback(err)
				})
			})
		})
	], callback)
}

exports.down = function(db, callback) {
	async.series([
		db.runSql.bind(db,'DROP TRIGGER market_groups_insert'),
		db.dropTable.bind(db,'market_groups')
	], callback)
}
