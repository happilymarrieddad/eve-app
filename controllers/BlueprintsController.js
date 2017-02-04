var async = require('async'),
	Blueprints = require('../models/Blueprints.js'),
	InventoryTypes = require('../models/InventoryTypes.js'),
	CustomBlueprintsInventoryTypes = require('../models/CustomBlueprintsInventoryTypes.js')

module.exports = {
	index(client,data,respond) {
		var results = {}

		async.parallel([
			function(cb) {
				Blueprints.index(data.search,data.page,data.limit,function(err,blueprints) {
					if (err) { return respond(err) }
					results.blueprints = blueprints
					return cb()
				})
			},
			function(cb) {
				Blueprints.indexCount(data.search,function(err,num) {
					if (err) { return respond(err) }
					results.num = num
					return cb()
				})
			}
		],function() {
			respond(null,results)
		})
	},
	customIndex(client,data,respond) {
		var results = {}

		async.parallel([
			function(cb) {
				Blueprints.customIndex(data.search,data.page,data.limit,function(err,blueprints) {
					if (err) { return respond(err) }
					results.blueprints = blueprints
					return cb()
				})
			},
			function(cb) {
				Blueprints.customIndexCount(data.search,function(err,num) {
					if (err) { return respond(err) }
					results.num = num
					return cb()
				})
			}
		],function() {
			respond(null,results)
		})
	},
	customEdit(client,data,respond) {
		var results = {}

		async.series([
			function(cb) {
				Blueprints.find(data.id,function(err,blueprint) {
					if (err) { return respond(err) }
					results.blueprint = blueprint
					return cb()
				})
			},
			function(cb) {
				InventoryTypes.find(results.blueprint.inventory_type_id,function(err,inventory_type) {
					if (err) { return respond(err) }
					results.blueprint.manufactured_inventory_type_name = inventory_type.name
					return cb()
				})
			}
		],function() {
			respond(null,results)
		})
	}
}