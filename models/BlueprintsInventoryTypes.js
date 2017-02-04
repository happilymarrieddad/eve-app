var request = require('request'),
	async = require('async'),
	pool = process.pool,
	Crest = require('./Crest.js'),
	Blueprints = require('./Blueprints.js'),
	InventoryTypes = require('./InventoryTypes.js')

var BlueprintsInventoryTypes = function (opts) {
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

BlueprintsInventoryTypes.prototype._callIdGenerator = function () {
	return this._cid++
}

BlueprintsInventoryTypes.prototype.all = function(respond) {
	pool.query('SELECT * FROM blueprints_inventory_types',function(err,rows) {
		if (err) { console.log(err);return respond('Unable to find blueprints.') }
		return respond(null,rows)
	})
}

BlueprintsInventoryTypes.prototype.findByBlueprintId = function(id,respond) {
	var self = this
	pool.query('SELECT * FROM blueprints_inventory_types WHERE blueprint_id',[id],function(err,rows) {
		if (err) { console.log(err);return respond('Unable to find blueprints.') }
		return respond(null,rows)
	})
}

BlueprintsInventoryTypes.prototype.find = function(id,respond) {
	var self = this
	pool.query('SELECT * FROM blueprints_inventory_types WHERE id = ?',[id],function(err,rows) {
		if (err || !rows.length) { console.log(err);return respond('Unable to find blueprint inventory type.') }
		else { respond(null,rows[0]) }
	})
}

BlueprintsInventoryTypes.prototype.store = function(blueprint_inventory_type,respond) {
	var self = this
	pool.query('INSERT INTO blueprints_inventory_types SET ?',[blueprint_inventory_type],function(err,rows) {
		if (err) { console.log(err);return respond('Unable to store blueprint inventory type.') }
		self.find(rows.insertId,function(err2,new_blueprint_inventory_type) {
			if (err2) { console.log(err);return respond('Unable to store blueprint inventory type.') }
			return respond(null,new_blueprint_inventory_type)
		})
	})
}

BlueprintsInventoryTypes.prototype.updateFromRemote = function(respond) {
	var self = this,
		results = {}
	async.series([
		function(cb) {
			pool.query('TRUNCATE blueprints_inventory_types',function(err,rows) {
				if (err) { console.log(err);return respond('Failed to truncate blueprints_inventory_types') }
				return cb()
			})
		},
		function(cb) {
			Blueprints.all(function(err,blueprints) {
				if (err) { console.log(err);return respond('Failed to get blueprints') }
				results.blueprints = blueprints
				return cb()
			})
		},
		function(cb) {
			var num = results.blueprints.length

			function updateInvTypes(i) {
				console.log('Updating blueprint',results.blueprints[i].name,' ',i,'out of',(results.blueprints.length-1))
				var temp_data = []
				async.series([
					function(cb2) {
						Crest.getBlueprintData(results.blueprints[i].eve_id,function(err,data) {
							if (err) { console.log(err);return respond('Failed to get blueprint inventory types') }
							temp_data = data
							return cb2()
						})
					},
					function(cb2) {
						var num_temp_data = temp_data.length || 0

						function insertTempData(j) {
							var inventory_type_id = 0

							async.series([
								function(cb3) {
									InventoryTypes.findByEveId(temp_data[j].typeid[0],function(err2,inventory_type) {
										if (err2) { console.log(err2);return respond('Failed to store blueprint inventory types') }
										inventory_type_id = inventory_type.id
										return cb3()
									})
								},
								function(cb3) {
									//console.log('Adding',temp_data[j].name[0],'to',results.blueprints[i].name)
									self.store({
										blueprint_id:results.blueprints[i].id,
										blueprint_eve_id:results.blueprints[i].eve_id,
										inventory_type_id:inventory_type_id,
										inventory_type_eve_id:temp_data[j].typeid[0],
										me_1_quantity:+temp_data[j].quantity[0],
										me_10_quantity:Math.ceil((+temp_data[j].quantity[0]) * 0.9)
									},function(err2,new_blueprint_inventory_type) {
										if (err2) { console.log(err2);return respond('Failed to store blueprint inventory types') }
										return cb3()
									})
								}
							],function() {
								if (!(--num_temp_data)) { cb2() }
								else { insertTempData(j+1) }
							})
						}

						if (num_temp_data > 0) {
							insertTempData(0)
						} else {
							cb2()
						}
					}
				],function() {
					if (!(--num)) { cb() }
					else { updateInvTypes(i+1) }
				})
			}

			updateInvTypes(0)
		}
	],function() {
		console.log('Finished updating blueprint inventory quantity')
		respond(null)
	})
}

module.exports = new BlueprintsInventoryTypes()