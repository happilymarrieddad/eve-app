var request = require('request'),
	pool = process.pool,
	async = require('async'),
	InventoryTypes = require('./InventoryTypes.js')

var Blueprints = function (opts) {
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

Blueprints.prototype._callIdGenerator = function () {
	return this._cid++
}

Blueprints.prototype.all = function(respond) {
	pool.query('SELECT * FROM blueprints ORDER BY name',function(err,rows) {
		if (err) { console.log(err);return respond('Unable to find blueprints.') }
		return respond(null,rows)
	})
}

Blueprints.prototype.find = function (id,respond) {
	pool.query('SELECT * FROM blueprints WHERE id = ?',[id],function(err,rows) {
		if (err) { console.log('Blueprints.prototype.find');console.log(err);respond('Failed to find blueprint ' + id) }
		else if (!rows.length) { respond('Failed to find blueprint ' + id) }
		else { respond(null,rows[0]) }
	})
}

Blueprints.prototype.update = function (id,put,respond) {
	var self = this
	pool.query('UPDATE blueprints SET ? WHERE id = ?',[put,id],function(err,rows) {
		if (err) { console.log('Blueprints.prototype.update');console.log(err);respond('Failed to update blueprint') }
		else { self.find(id,respond) }
	})
}

Blueprints.prototype.updateManufacturedInventoryItem = function(respond) {
	var results = {},
		self = this

	async.series([
		function(cb) {
			self.all(function(err,blueprints) {
				if (err) { return respond(err) }
				results.blueprints = blueprints
				cb()
			})
		},
		function(cb) {
			var num = results.blueprints.length

			function finish(i) {
				if (!(--num)) { return cb() }
				updateBlueprint(i+1)
			}

			function updateBlueprint(i) {
				console.log('Updating',i,'of',(results.blueprints.length-1))
				InventoryTypes.findByNameNotBlueprint(results.blueprints[i].name.replace(' Blueprint','').trim(),function(err,inventory_type) {
					if (err) { return finish(i) }
					self.update(results.blueprints[i].id,{
						manufactured_inventory_type_id:inventory_type.id
					},function(err,new_blueprint) {
						if (err) { return respond(err) }
						return finish(i)
					})
				})
			}

			if (num < 1) { return respond('No blueprints were found...') }
			updateBlueprint(0)
		}
	],function() {
		console.log('Updated manufactured inventory items for blueprints.')
		return respond(null)
	})
}

Blueprints.prototype.index = function (search,page,limit,respond) {
	var results = {},
		offset = (page - 1) * limit

	var qry =
	'SELECT ' +

	'inventory_types.name AS manufactured_name, ' +
	'blueprints.* ' +

	'FROM blueprints ' +
	'LEFT JOIN inventory_types ON inventory_types.id = blueprints.manufactured_inventory_type_id ' +

	'WHERE blueprints.manufactured_inventory_type_id > 0'

	if (search) {
		qry += ' AND (blueprints.name LIKE "%'+search+'%")'
	}

	qry += ' ORDER BY blueprints.avg_profit DESC,TRIM(blueprints.name) LIMIT ' + limit + ' OFFSET ' + offset

	pool.query(qry,function(err,rows) {
		if (err) { console.log('Blueprints.prototype.index');console.log(err);respond('Failed to get all blueprints') }
		else { respond(null,rows) }
	})
}

Blueprints.prototype.indexCount = function (search,respond) {
	var results = {}

	var qry =
	'SELECT ' +

	'COUNT(*) ' +

	'FROM blueprints'

	if (search) {
		qry += ' WHERE (blueprints.name LIKE "%'+search+'%")'
	}

	pool.query(qry,function(err,rows) {
		if (err) { console.log('Blueprints.prototype.indexCount');console.log(err);respond('Failed to get all blueprints') }
		else if (!rows.length) { respond(null,0) }
		else { respond(null,rows[0]['COUNT(*)']) }
	})
}

Blueprints.prototype.customIndex = function (search,page,limit,respond) {
	var results = {},
		offset = (page - 1) * limit

	var qry =
	'SELECT ' +

	'inventory_types.name AS manufactured_name, ' +
	'blueprints.* ' +

	'FROM blueprints ' +
	'LEFT JOIN inventory_types ON inventory_types.id = blueprints.manufactured_inventory_type_id ' +

	'WHERE blueprints.manufactured_inventory_type_id > 0'

	if (search) {
		qry += ' AND (blueprints.name LIKE "%'+search+'%")'
	}

	qry += ' ORDER BY blueprints.avg_profit DESC,TRIM(blueprints.name) LIMIT ' + limit + ' OFFSET ' + offset

	pool.query(qry,function(err,rows) {
		if (err) { console.log('Blueprints.prototype.index');console.log(err);respond('Failed to get all blueprints') }
		else { respond(null,rows) }
	})
}

Blueprints.prototype.customIndexCount = function (search,respond) {
	var results = {}

	var qry =
	'SELECT ' +

	'COUNT(*) ' +

	'FROM blueprints'

	if (search) {
		qry += ' WHERE (blueprints.name LIKE "%'+search+'%")'
	}

	pool.query(qry,function(err,rows) {
		if (err) { console.log('Blueprints.prototype.indexCount');console.log(err);respond('Failed to get all blueprints') }
		else if (!rows.length) { respond(null,0) }
		else { respond(null,rows[0]['COUNT(*)']) }
	})
}

module.exports = new Blueprints()