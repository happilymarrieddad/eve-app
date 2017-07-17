var Crest = require('./Crest.js'),
	async = require('async'),
	pool = process.pool,
	moment = require('moment')

var InventoryTypes = function (opts) {
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

InventoryTypes.prototype.updateFromRemote = function (respond) {
	var storage = { inventory_types:[] },
		num_pages = 0,
		self = this

	async.series([
		function(cb) {
			Crest.getInventoryTypes(function(err,inventory_types,num) {
				if (err) { console.log(err);respond('Failed to update from remote inventory_types') }
				else {
					num_pages = num
					cb()
				}
			})
		},
		function(cb) {
			function getSomeInventoryTypes(i) {
				console.log('Getting data',i,'with',num_pages,'left')
				Crest.getInventoryTypes(function(err,inventory_types) {
					if (err) { console.log(err);respond('Failed to update from remote inventory_types') }
					else {
						for (var j = 0 ; j < inventory_types.length; j++) {
							storage.inventory_types.push(inventory_types[j])
						}
						if (!(--num_pages)) { cb() }
						else { getSomeInventoryTypes(i+1) }
					}
				},i)
			}
			getSomeInventoryTypes(1)
		},
		function(cb) {
			var num_items = storage.inventory_types.length

			function attemptToUpdate(i) {
				console.log('Updating',i,'with',num_items,'left')
				self.uniqueByEveId({
					name:storage.inventory_types[i].name,
					eve_id:storage.inventory_types[i].id
				},function(err,new_inventory_type) {
					if (!(--num_items)) { cb() }
					else { attemptToUpdate(i+1) }
				})
			}

			if (num_items > 0) { attemptToUpdate(0) }
			else { cb() }
		}
	],function() {
		respond()
	})
}

InventoryTypes.prototype.updatePricesFromRemote = function(respond) {
	var self = this,
		results = {},
		start_time = moment(new Date()).format('MM-DD-YYYY HH:mm:ss')

	async.series([
		function(cb) {
			self.all(function(err,inventory_types) {
				if (err) { respond(err) }
				else {
					if (inventory_types.length) {
						results.inventory_types = inventory_types
						cb()
					} else {
						respond('No inventory types found...')
					}
				}
			})
		},
		function(cb) {
			var num = results.inventory_types.length

			function updatePrices(i) {
				function finish() {
					if (!(--num)) { cb() }
					else { updatePrices(i+1) }
				}

				Crest.getMarketPriceByInventoryTypeEveId(results.inventory_types[i].eve_id,function(err,price_data) {
					if (err) { finish() }
					else {
						console.log('Updating price on',results.inventory_types[i].name)
						self.update(results.inventory_types[i].id,{
							low_price:price_data.lowPrice,
							high_price:price_data.highPrice,
							avg_price:price_data.avgPrice
						},function(err,data) {
							if (err) { console.log(err) }
							finish()
						})
					}
				})
			}

			updatePrices(0)
		}
	],function() {
		console.log('Finished updating prices.')
		console.log('Start time',start_time)
		console.log('Finish time',moment(new Date()).format('MM-DD-YYYY HH:mm:ss'))
		respond(null)
	})
}

InventoryTypes.prototype.updateCostFromRemote = function(respond) {
	var self = this,
		results = {},
		start_time = moment(new Date()).format('MM-DD-YYYY HH:mm:ss')

	async.series([
		function(cb) {
			self.all(function(err,inventory_types) {
				if (err) { respond(err) }
				else {
					if (inventory_types.length) {
						results.inventory_types = inventory_types
						cb()
					} else {
						respond('No inventory types found...')
					}
				}
			})
		},
		function(cb) {
			var num = results.inventory_types.length

			function updatePrices(i) {
				function finish() {
					if (!(--num)) { cb() }
					else { updatePrices(i+1) }
				}

				Crest.getInventoryTypeCost(results.inventory_types[i].eve_id,function(err,price_data) {
					if (err) { finish() }
					else {
						console.log('Updating price on',results.inventory_types[i].name,i,'out of',results.inventory_types.length-1)
						self.update(results.inventory_types[i].id,{
							cost:price_data
						},function(err,data) {
							if (err) { console.log(err) }
							finish()
						})
					}
				})
			}

			updatePrices(0)
		}
	],function() {
		console.log('Finished updating cost.')
		console.log('Start time',start_time)
		console.log('Finish time',moment(new Date()).format('MM-DD-YYYY HH:mm:ss'))
		respond(null)
	})
}

InventoryTypes.prototype.updateSellForFromRemote = function(respond) {
	var self = this,
		results = {},
		start_time = moment(new Date()).format('MM-DD-YYYY HH:mm:ss')

	async.series([
		function(cb) {
			self.all(function(err,inventory_types) {
				if (err) { respond(err) }
				else {
					if (inventory_types.length) {
						results.inventory_types = inventory_types
						cb()
					} else {
						respond('No inventory types found...')
					}
				}
			})
		},
		function(cb) {
			var num = results.inventory_types.length

			function updatePrices(i) {
				function finish() {
					if (!(--num)) { cb() }
					else { updatePrices(i+1) }
				}

				Crest.getInventoryTypeSellFor(results.inventory_types[i].eve_id,function(err,price_data) {
					if (err) { finish() }
					else {
						console.log('Updating sell for on',results.inventory_types[i].name,i,'out of',results.inventory_types.length-1)
						self.update(results.inventory_types[i].id,{
							sell_for:price_data
						},function(err,data) {
							if (err) { console.log(err) }
							finish()
						})
					}
				})
			}

			updatePrices(0)
		}
	],function() {
		console.log('Finished updating sell for.')
		console.log('Start time',start_time)
		console.log('Finish time',moment(new Date()).format('MM-DD-YYYY HH:mm:ss'))
		respond(null)
	})
}

InventoryTypes.prototype.updateNoPricesFromRemote = function(respond) {
	var self = this,
		results = {},
		start_time = moment(new Date()).format('MM-DD-YYYY HH:mm:ss')

	async.series([
		function(cb) {
			self.noPrice(function(err,inventory_types) {
				if (err) { respond(err) }
				else {
					if (inventory_types.length) {
						results.inventory_types = inventory_types
						cb()
					} else {
						respond('No inventory types found...')
					}
				}
			})
		},
		function(cb) {
			var num = results.inventory_types.length

			function updatePrices(i) {
				function finish() {
					if (!(--num)) { cb() }
					else { updatePrices(i+1) }
				}

				Crest.getMarketPriceByInventoryTypeEveId(results.inventory_types[i].eve_id,function(err,price_data) {
					if (err) { finish() }
					else {
						console.log('Updating price on',results.inventory_types[i].name)
						self.update(results.inventory_types[i].id,{
							low_price:price_data.lowPrice,
							high_price:price_data.highPrice,
							avg_price:price_data.avgPrice
						},function(err,data) {
							if (err) { console.log(err) }
							finish()
						})
					}
				})
			}

			updatePrices(0)
		}
	],function() {
		console.log('Finished updating prices.')
		console.log('Start time',start_time)
		console.log('Finish time',moment(new Date()).format('MM-DD-YYYY HH:mm:ss'))
		respond(null)
	})
}

InventoryTypes.prototype.uniqueByEveId = function (new_inventory_type,respond) {
	var self = this

	self.findByEveId(new_inventory_type.eve_id,function(err,inventory_type) {
		if (err || !inventory_type) {
			self.store(new_inventory_type,function(err,new_mg) {
				if (err) { respond(err) }
				else { respond(null,new_mg) }
			})
		} else {
			self.update(inventory_type.id,new_inventory_type,function(err,new_mg) {
				if (err) { respond(err) }
				else { respond(null,new_mg) }
			})
		}
	})
}

InventoryTypes.prototype.store = function (post,respond) {
	pool.query('INSERT INTO inventory_types SET ?',post,function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.store');console.log(err);respond('Failed to store inventory_type') }
		else {
			post.id = rows.insertId
			respond(null,post)
		}
	})
}

InventoryTypes.prototype.update = function (id,put,respond) {
	var self = this
	pool.query('UPDATE inventory_types SET ? WHERE id = ?',[put,id],function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.update');console.log(err);respond('Failed to update inventory_type') }
		else { self.find(id,respond) }
	})
}

InventoryTypes.prototype.updateByEveId = function (id,put,respond) {
	var self = this
	pool.query('UPDATE inventory_types SET ? WHERE eve_id = ?',[put,id],function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.update');console.log(err);respond('Failed to update inventory_type') }
		else { self.findByEveId(id,respond) }
	})
}

InventoryTypes.prototype.find = function (id,respond) {
	pool.query('SELECT * FROM inventory_types WHERE id = ?',[id],function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.find');console.log(err);respond('Failed to find inventory_type ' + id) }
		else if (!rows.length) { respond('Failed to find inventory_type ' + id) }
		else { respond(null,rows[0]) }
	})
}

InventoryTypes.prototype.findByEveId = function (id,respond) {
	pool.query('SELECT * FROM inventory_types WHERE eve_id = ?',[id],function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.findByEveId');console.log(err);respond('Failed to findByEveId inventory_type ' + id) }
		else if (!rows.length) { respond('Failed to findByEveId inventory_type ' + id) }
		else { respond(null,rows[0]) }
	})
}

InventoryTypes.prototype.findByNameNotBlueprint = function (name,respond) {
	var qry = 'SELECT * FROM inventory_types WHERE name = "'+name+'" AND name NOT LIKE "%Blueprint%"'
	pool.query(qry,[name],function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.findByNameNotBlueprint');console.log(err);respond('Failed to findByNameNotBlueprint inventory_type ' + name) }
		else if (!rows.length) { respond('Failed to findByNameNotBlueprint inventory_type ' + name) }
		else { respond(null,rows[0]) }
	})
}

InventoryTypes.prototype.findByName = function (name,respond) {
	pool.query('SELECT * FROM inventory_types WHERE name LIKE "%'+name+'%"',[name],function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.findByName');console.log(err);respond('Failed to findByName inventory_type ' + name) }
		else if (!rows.length) { respond('Failed to findByName inventory_type ' + name) }
		else { respond(null,rows[0]) }
	})
}

InventoryTypes.prototype.autocomplete = function (name,respond) {
	var qry = 'SELECT inventory_types.id as value,inventory_types.name as label,inventory_types.eve_id as eve_id FROM inventory_types WHERE name LIKE "%'+name+'%" ORDER BY name'
	pool.query(qry,[name],function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.findByName');console.log(err);respond('Failed to findByName inventory_type ' + name) }
		else { respond(null,rows) }
	})
}

InventoryTypes.prototype.all = function (respond) {
	pool.query('SELECT * FROM inventory_types',function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.all');console.log(err);respond('Failed to get all inventory_types') }
		else { respond(null,rows) }
	})
}

InventoryTypes.prototype.noPrice = function (respond) {
	pool.query('SELECT * FROM inventory_types WHERE low_price IS NULL OR low_price = "" OR low_price < 1',function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.all');console.log(err);respond('Failed to get all inventory_types') }
		else { respond(null,rows) }
	})
}

InventoryTypes.prototype.index = function (search,page,limit,respond) {
	var results = {},
		offset = (page - 1) * limit

	var qry =
	'SELECT ' +

	'inventory_types.*, ' +
	'market_groups.name as market_group_name ' +

	'FROM inventory_types ' +
	'LEFT JOIN market_groups ON market_groups.id = inventory_types.market_group_id'

	if (search) {
		qry += ' WHERE (inventory_types.name LIKE "%'+search+'%" OR market_groups.name LIKE "%'+search+'%")'
		qry += ' AND (inventory_types.id IN (' +
		       'SELECT inventory_types.id FROM inventory_types LEFT JOIN market_groups ON market_groups.id = inventory_types.market_group_id ' +
		       'WHERE (inventory_types.name LIKE "%'+search+'%" OR market_groups.name LIKE "%'+search+'%") ' +
		       'GROUP BY inventory_types.name' +
		       '))'
	} else {
		qry += ' WHERE inventory_types.id IN ('+
		       'SELECT inventory_types.id FROM inventory_types LEFT JOIN market_groups ON market_groups.id = inventory_types.market_group_id ' +
		       'GROUP BY inventory_types.name' +
		       ')'
	}

	qry += ' LIMIT ' + limit + ' OFFSET ' + offset

	pool.query(qry,function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.all');console.log(err);respond('Failed to get all inventory_types') }
		else { respond(null,rows) }
	})
}

InventoryTypes.prototype.indexCount = function (search,respond) {
	var results = {}

	var qry =
	'SELECT ' +

	'COUNT(DISTINCT inventory_types.name) ' +

	'FROM inventory_types ' +
	'LEFT JOIN market_groups ON market_groups.id = inventory_types.market_group_id'

	if (search) {
		qry += ' WHERE (inventory_types.name LIKE "%'+search+'%" OR market_groups.name LIKE "%'+search+'%")'
	}

	pool.query(qry,function(err,rows) {
		if (err) { console.log('InventoryTypes.prototype.all');console.log(err);respond('Failed to get all inventory_types') }
		else if (!rows.length) { respond(null,0) }
		else { respond(null,rows[0]['COUNT(*)']) }
	})
}

module.exports = new InventoryTypes()
