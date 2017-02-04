var Crest = require('./Crest.js'),
	InventoryTypes = require('./InventoryTypes.js'),
	MarketGroups = require('./MarketGroups.js'),
	async = require('async'),
	pool = process.pool

var MarketTypes = function (opts) {
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

MarketTypes.prototype.updateFromRemote = function (respond) {
	var storage = { market_types:[] },
		num_pages = 0,
		self = this

	async.series([
		function(cb) {
			Crest.getMarketTypes(function(err,market_types,num) {
				if (err) { console.log(err);respond('Failed to update from remote market_types') }
				else {
					console.log('Got',num,'pages from market types')
					num_pages = num
					cb()
				}
			})
		},
		function(cb) {
			function getSomeMarketTypes(i) {
				console.log('Getting market types from page',i)
				Crest.getMarketTypes(function(err,market_types) {
					if (err) { console.log(err);respond('Failed to update from remote market_types') }
					else {
						console.log('Got',market_types.length,'from',i)
						for (var j = 0 ; j < market_types.length; j++) {
							storage.market_types.push(market_types[j])
						}
						if (!(--num_pages)) { cb() }
						else { getSomeMarketTypes(i+1) }
					}
				},i)
			}
			getSomeMarketTypes(1)
		},
		function(cb) {
			console.log('There are',storage.market_types.length,'market types')
			var num_items = storage.market_types.length

			function attemptToUpdate(i) {
				var market_group_id = 0
				console.log('Starting return',i)

				async.series([
					function(cb) {
						console.log('Getting market group by eve_id',storage.market_types[i].marketGroup.id)
						MarketGroups.findByEveId(storage.market_types[i].marketGroup.id,function(err,market_group) {
							if (err) { console.log(err);return 'Failed to find market_type' }
							else {
								market_group_id = market_group.id
								cb()
							}
						})
					},
					function(cb) {
						console.log('Updating inventory type by eve_id',storage.market_types[i].type.id)
						InventoryTypes.updateByEveId(storage.market_types[i].type.id,{
							market_group_id:market_group_id
						},function(err,inventory_type) {
							if (!(--num_items)) { cb() }
							else { attemptToUpdate(i+1) }
						})
					}
				])
			}

			if (num_items > 0) { attemptToUpdate(0) }
			else { cb() }
		}
	],function() {
		console.log('Finished updating data.')
		respond()
	})
}

module.exports = new MarketTypes()