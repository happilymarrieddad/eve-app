var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.changeColumn.bind(db, 'blueprints',       'name', { type: "string", length:128 }),
    db.changeColumn.bind(db, 'inventory_groups', 'name', { type: "string", length:128 }),
    db.changeColumn.bind(db, 'inventory_types',  'name', { type: "string", length:128 }),
    db.changeColumn.bind(db, 'market_groups',    'name', { type: "string", length:128 }),
  ], callback);
}

exports.down = function(db, callback) {
  async.series([
    db.changeColumn.bind(db, 'blueprints',       'name', { type: "string", length:60 }),
    db.changeColumn.bind(db, 'inventory_groups', 'name', { type: "string", length:60 }),
    db.changeColumn.bind(db, 'inventory_types',  'name', { type: "string", length:60 }),
    db.changeColumn.bind(db, 'market_groups',    'name', { type: "string", length:60 })
  ], callback);
}
