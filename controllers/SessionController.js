var async = require('async'),
	Users = require('./../models/Users.js'),
	Password = require('./../models/Password.js')

module.exports = {
	login(client,data,respond) {
		var results = {},
			password = null

		async.series([
			function(cb) {
				Users.findByEmail(data.email,function(err,user) {
					if (err) { return respond(err) }
					else {
						if (!user) { return respond('User account not found.') } 
						password = user.password
						delete user.password
						results.user = user
						return cb()
					}
				})
			},
			function(cb) {
				if (!Password.verify(data.password,password)) { return respond('Password does not match.') }
				client.setAuthToken({user:results.user})
				return cb()
			}
		],function() {
			respond(null,results)
		})
	},
	logout(client,data,respond) {
		client.deauthenticate()
		respond(null)
	}
}