var async = require('async'),
	InventoryGroups = require('../models/InventoryGroups.js')

module.exports = {
	all(client,data,respond) {
		InventoryGroups.all(respond)
	},
	index(client,data,respond) {
		var results = {}

		async.parallel([
			function(cb) {
				InventoryGroups.index(data.search,data.page,data.limit,function(err,inventory_groups) {
					if (err) { return respond(err) }
					results.inventory_groups = inventory_groups
					return cb()
				})
			},
			function(cb) {
				InventoryGroups.indexCount(data.search,function(err,num) {
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
		InventoryGroups.updateFromRemote(function(){
			
		})
		respond(null)
	}
}