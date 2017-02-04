var async = require('async'),
	MarketGroups = require('../models/MarketGroups.js')

module.exports = {
	all(client,data,respond) {
		MarketGroups.all(respond)
	},
	index(client,data,respond) {
		var results = {}

		async.parallel([
			function(cb) {
				MarketGroups.index(data.search,data.page,data.limit,function(err,market_groups) {
					if (err) { return respond(err) }
					results.market_groups = market_groups
					return cb()
				})
			},
			function(cb) {
				MarketGroups.indexCount(data.search,function(err,num) {
					if (err) { return respond(err) }
					results.num = num
					return cb()
				})
			}
		],function() {
			respond(null,results)
		})
	},
	update(client,data,respond) {
		MarketGroups.updateFromRemote(function(){
			
		})
		respond(null)
	}
}