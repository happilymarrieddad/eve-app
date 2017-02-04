var request = require('request'),
	sha = require('sha256')

var Password = function (opts) {
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

Password.prototype._callIdGenerator = function () {
	return this._cid++
}

Password.prototype.verify = function(password_to_verify,hash) {
	if (sha.x2(password_to_verify) == hash) { return true }
	return false
}

module.exports = new Password()