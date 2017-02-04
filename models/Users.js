var request = require('request'),
	pool = process.pool

var Users = function (opts) {
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

Users.prototype._callIdGenerator = function () {
	return this._cid++
}

Users.prototype.findByEmail = function(email,respond) {
	pool.query('SELECT * FROM users WHERE email = ?',[email],function(err,rows) {
		if (err) { console.log(err);return respond('Unable to find user account.') }
		else if (!rows.length) { return respond('Unable to find user account.') }
		return respond(null,rows[0])
	})
}

module.exports = new Users()