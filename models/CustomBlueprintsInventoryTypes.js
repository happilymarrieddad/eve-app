var request = require('request'),
	pool = process.pool

var CustomBlueprintsInventoryTypes = function (opts) {
	var self = this

	this.id = null

	this._localEvents = {
		'error':1
	}
	this.options = opts || {}
	this._cid = 1
	this.options.callIdGenerator = function () {
		return self._callIdGenerator
	}
}

CustomBlueprintsInventoryTypes.prototype._callIdGenerator = function () {
	return this._cid++
}

CustomBlueprintsInventoryTypes.prototype.find = function(id,respond) {
	pool.query('SELECT * FROM custom_blueprints_inventory_types WHERE id = ?',[id],function(err,rows) {
		if (err) { console.log(err);return respond('Unable to find custom blueprints inventory types.') }
		else if (!rows.length) { return respond('Unable to find custom blueprints inventory types.') }
		return respond(null,rows[0])
	})
}

CustomBlueprintsInventoryTypes.prototype.destroy = function(id,respond) {
	pool.query('DELETE FROM custom_blueprints_inventory_types WHERE id = ?',[id],respond)
}

CustomBlueprintsInventoryTypes.prototype.findByBlueprintId = function(id,respond) {
	var qry =
	'SELECT '+

	'inventory_types.name as inventory_types_name, ' +
	'inventory_types.cost as inventory_types_cost, ' +
	'inventory_types.sell_for as inventory_types_sell_for, ' +
	'custom_blueprints_inventory_types.* ' +

	'FROM custom_blueprints_inventory_types ' +
	'LEFT JOIN inventory_types ON inventory_types.id = custom_blueprints_inventory_types.inventory_type_id ' +

	'WHERE custom_blueprints_inventory_types.blueprint_id = ?'
	pool.query(qry,[id],respond)
}

CustomBlueprintsInventoryTypes.prototype.store = function(post,respond) {
	pool.query('INSERT INTO custom_blueprints_inventory_types SET ?',post,respond)
}

module.exports = new CustomBlueprintsInventoryTypes()