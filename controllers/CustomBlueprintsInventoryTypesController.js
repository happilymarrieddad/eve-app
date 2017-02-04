var async = require('async'),
	CustomBlueprintsInventoryTypes = require('../models/CustomBlueprintsInventoryTypes.js')

module.exports = {
	destroy(client,data,respond) {
		var results = {}

		async.parallel([
			function(cb) {
				CustomBlueprintsInventoryTypes.destroy(data.id,function(err,blueprints) {
					if (err) { return respond(err) }
					return cb()
				})
			}
		],function() {
			respond(null,results)
		})
	},
	findByBlueprintId(client,data,respond) {
		CustomBlueprintsInventoryTypes.findByBlueprintId(data.id,respond)
	},
	store(client,data,respond) {
		CustomBlueprintsInventoryTypes.store(data.post,respond)
	}
}