var async = require('async'),
	InventoryTypes = require('../models/InventoryTypes.js'),
	BlueprintsInventoryTypes = require('../models/BlueprintsInventoryTypes.js')

module.exports = {
	autocomplete(client,data,respond) {
		InventoryTypes.autocomplete(data.search,respond)
	},
	all(client,data,respond) {
		InventoryTypes.all(respond)
	},
	index(client,data,respond) {
		var results = {}

		async.parallel([
			function(cb) {
				InventoryTypes.index(data.search,data.page,data.limit,function(err,inventory_types) {
					if (err) { return respond(err) }
					results.inventory_types = inventory_types
					return cb()
				})
			},
			function(cb) {
				InventoryTypes.indexCount(data.search,function(err,num) {
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
		InventoryTypes.updateFromRemote(function(err){
			console.log(err)
		})
		respond(null)
	},
	updatePrices(client,data,respond) {
		InventoryTypes.updatePricesFromRemote(function(err){
			console.log(err)
		})
		respond(null)
	},
	updateInventoryTypes(client,data,respond) {
		InventoryTypes.updateFromRemote(function(err){
			console.log(err)
		})
		respond(null)
	}
}