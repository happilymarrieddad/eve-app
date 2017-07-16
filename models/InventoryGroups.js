var Crest = require('./Crest.js'),
	async = require('async'),
	pool = process.pool

var InventoryGroups = function (opts) {
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

InventoryGroups.prototype.updateFromRemote = function (respond) {
	var storage = { inventory_groups:[] },
		num_pages = 0,
		self = this

	async.series([
		function(cb) {
			Crest.getInventoryGroups(function(err,inventory_groups,num) {
				if (err) { console.log(err);respond('Failed to update from remote inventory_groups') }
				else {
					num_pages = num
					cb()
				}
			})
		},
		function(cb) {
			function getSomeInventoryGroups(i) {
				Crest.getInventoryGroups(function(err,inventory_groups) {
					if (err) { console.log(err);respond('Failed to update from remote inventory_groups') }
					else {
						for (var j = 0 ; j < inventory_groups.length; j++) {
							storage.inventory_groups.push(inventory_groups[j])
						}
						if (!(--num_pages)) { cb() }
						else { getSomeInventoryGroups(i+1) }
					}
				},i)
			}
			getSomeInventoryGroups(1)
		},
		function(cb) {
			var num_items = storage.inventory_groups.length

			function attemptToUpdate(i) {
				self.uniqueByEveId({
					name:storage.inventory_groups[i].name,
					eve_id:storage.inventory_groups[i].id
				},function(err,new_inventory_group) {
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

InventoryGroups.prototype.uniqueByEveId = function (new_inventory_group,respond) {
	var self = this

	self.findByEveId(new_inventory_group.eve_id,function(err,inventory_group) {
		if (err || !inventory_group) {
			self.store(new_inventory_group,function(err,new_mg) {
				if (err) { respond(err) }
				else { respond(null,new_mg) }
			})
		} else {
			self.update(inventory_group.id,new_inventory_group,function(err,new_mg) {
				if (err) { respond(err) }
				else { respond(null,new_mg) }
			})
		}
	})
}

InventoryGroups.prototype.store = function (post,respond) {
	pool.query('INSERT INTO inventory_groups SET ?',post,function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.store');console.log(err);respond('Failed to store inventory_group') }
		else {
			post.id = rows.insertId
			respond(null,post)
		}
	})
}

InventoryGroups.prototype.update = function (id,put,respond) {
	var self = this
	pool.query('UPDATE inventory_groups SET ? WHERE id = ?',[put,id],function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.update');console.log(err);respond('Failed to update inventory_group') }
		else { self.find(id,respond) }
	})
}

InventoryGroups.prototype.updateByEveId = function (id,put,respond) {
	var self = this
	pool.query('UPDATE inventory_groups SET ? WHERE eve_id = ?',[put,id],function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.update');console.log(err);respond('Failed to update inventory_group') }
		else { self.findByEveId(id,respond) }
	})
}

InventoryGroups.prototype.find = function (id,respond) {
	pool.query('SELECT * FROM inventory_groups WHERE id = ?',[id],function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.find');console.log(err);respond('Failed to find inventory_group ' + id) }
		else if (!rows.length) { respond('Failed to find inventory_group ' + id) }
		else { respond(null,rows[0]) }
	})
}

InventoryGroups.prototype.findByEveId = function (id,respond) {
	pool.query('SELECT * FROM inventory_groups WHERE eve_id = ?',[id],function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.findByEveId');console.log(err);respond('Failed to findByEveId inventory_group ' + id) }
		else if (!rows.length) { respond('Failed to findByEveId inventory_group ' + id) }
		else { respond(null,rows[0]) }
	})
}

InventoryGroups.prototype.findByName = function (name,respond) {
	pool.query('SELECT * FROM inventory_groups WHERE name = ?',[name],function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.findByName');console.log(err);respond('Failed to findByName inventory_group ' + id) }
		else if (!rows.length) { respond('Failed to findByName inventory_group ' + id) }
		else { respond(null,rows[0]) }
	})
}

InventoryGroups.prototype.all = function (respond) {
	pool.query('SELECT * FROM inventory_groups',function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.all');console.log(err);respond('Failed to get all inventory_groups') }
		else { respond(null,rows) }
	})
}

InventoryGroups.prototype.index = function (search,page,limit,respond) {
	var results = {},
		offset = (page - 1) * limit

	var qry = 'SELECT * FROM inventory_groups'

	if (search) {
		qry += ' WHERE (inventory_groups.name LIKE "%'+search+'%")'
	}

	qry += ' LIMIT ' + limit + ' OFFSET ' + offset

	pool.query(qry,function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.all');console.log(err);respond('Failed to get all inventory_groups') }
		else { respond(null,rows) }
	})
}

InventoryGroups.prototype.indexCount = function (search,respond) {
	var results = {}

	var qry = 'SELECT COUNT(*) FROM inventory_groups'

	if (search) {
		qry += ' WHERE (inventory_groups.name LIKE "%'+search+'%")'
	}

	pool.query(qry,function(err,rows) {
		if (err) { console.log('InventoryGroups.prototype.all');console.log(err);respond('Failed to get all inventory_groups') }
		else if (!rows.length) { respond(null,0) }
		else { respond(null,rows[0]['COUNT(*)']) }
	})
}

module.exports = new InventoryGroups()
