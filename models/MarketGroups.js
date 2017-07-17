var Crest = require('./Crest.js'),
	async = require('async'),
	MarketTypes = require('./MarketTypes'),
	pool = process.pool

var MarketGroups = function (opts) {
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

MarketGroups.prototype.updateFromRemote = function (respond) {
	var storage = { market_groups:[] },
		self = this

	async.series([
		function(cb) {
			Crest.getMarketGroups(function(err,market_groups) {
				if (err) { console.log(err);respond('Failed to update from remote market_groups') }
				else {
					storage.market_groups = market_groups
					cb()
				}
			})
		},
		function(cb) {
			var num_items = storage.market_groups.length

			function attemptToUpdate(i) {
				console.log('Getting data',i,'with',num_items,'left')
				self.uniqueByEveId({
					name:storage.market_groups[i].name,
					description:storage.market_groups[i].description,
					eve_id:storage.market_groups[i].id
				},function(err,new_market_group) {
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

MarketGroups.findByEveId = function (id,respond) {
	pool.query('SELECT * FROM market_groups WHERE eve_id = ?',[id],function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.findByEveId');console.log(err);respond('Failed to findByEveId market_group ' + id) }
		else if (!rows.length) { respond('Failed to findByEveId market_group ' + id) }
		else { respond(null,rows[0]) }
	})
}

MarketGroups.prototype.findByEveId = function (id,respond) {
	pool.query('SELECT * FROM market_groups WHERE eve_id = ?',[id],function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.findByEveId');console.log(err);respond('Failed to findByEveId market_group ' + id) }
		else if (!rows.length) { respond('Failed to findByEveId market_group ' + id) }
		else { respond(null,rows[0]) }
	})
}

MarketGroups.prototype.uniqueByEveId = function (new_market_group,respond) {
	var self = this

	self.findByEveId(new_market_group.eve_id,function(err,market_group) {
		if (err || !market_group) {
			self.store(new_market_group,function(err,new_mg) {
				if (err) { respond(err) }
				else { respond(null,new_mg) }
			})
		} else {
			self.update(market_group.id,new_market_group,function(err,new_mg) {
				if (err) { respond(err) }
				else { respond(null,new_mg) }
			})
		}
	})
}

MarketGroups.prototype.store = function (post,respond) {
	pool.query('INSERT INTO market_groups SET ?',post,function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.store');console.log(err);respond('Failed to store market_group') }
		else {
			post.id = rows.insertId
			respond(null,post)
		}
	})
}

MarketGroups.prototype.update = function (id,put,respond) {
	var self = this
	pool.query('UPDATE market_groups SET ? WHERE id = ?',[put,id],function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.update');console.log(err);respond('Failed to update market_group') }
		else { self.find(id,respond) }
	})
}

MarketGroups.prototype.updateByEveId = function (id,put,respond) {
	var self = this
	pool.query('UPDATE market_groups SET ? WHERE eve_id = ?',[put,id],function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.update');console.log(err);respond('Failed to update market_group') }
		else { self.findByEveId(id,respond) }
	})
}

MarketGroups.prototype.find = function (id,respond) {
	pool.query('SELECT * FROM market_groups WHERE id = ?',[id],function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.find');console.log(err);respond('Failed to find market_group ' + id) }
		else if (!rows.length) { respond('Failed to find market_group ' + id) }
		else { respond(null,rows[0]) }
	})
}

MarketGroups.prototype.findByName = function (name,respond) {
	pool.query('SELECT * FROM market_groups WHERE name = ?',[name],function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.findByName');console.log(err);respond('Failed to findByName market_group ' + id) }
		else if (!rows.length) { respond('Failed to findByName market_group ' + id) }
		else { respond(null,rows[0]) }
	})
}

MarketGroups.prototype.all = function (respond) {
	pool.query('SELECT * FROM market_groups',function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.all');console.log(err);respond('Failed to get all market_groups') }
		else { respond(null,rows) }
	})
}

MarketGroups.prototype.index = function (search,page,limit,respond) {
	var results = {},
		offset = (page - 1) * limit

	var qry = 'SELECT * FROM market_groups'

	if (search) {
		qry += ' WHERE (market_groups.name LIKE "%'+search+'%")'
	}

	qry += ' LIMIT ' + limit + ' OFFSET ' + offset

	pool.query(qry,function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.all');console.log(err);respond('Failed to get all market_groups') }
		else { respond(null,rows) }
	})
}

MarketGroups.prototype.indexCount = function (search,respond) {
	var results = {}

	var qry = 'SELECT COUNT(*) FROM market_groups'

	if (search) {
		qry += ' WHERE (market_groups.name LIKE "%'+search+'%")'
	}

	pool.query(qry,function(err,rows) {
		if (err) { console.log('MarketGroups.prototype.all');console.log(err);respond('Failed to get all market_groups') }
		else if (!rows.length) { respond(null,0) }
		else { respond(null,rows[0]['COUNT(*)']) }
	})
}

module.exports = new MarketGroups()
