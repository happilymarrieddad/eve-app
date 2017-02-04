var request = require('request'),
	xml = require('xml2js').parseString

var Crest = function (opts) {
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
	this._baseUrl = 'https://crest-tq.eveonline.com'
}

Crest.prototype._callIdGenerator = function () {
	return this._cid++
}

Crest.prototype.getMarketTypes = function (respond,page) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/types/' + (page ? ( '?page=' + page ) : '')
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.items) { respond(null,data.items,data.pageCount) }
		else { respond(data.message) }
	})
}

Crest.prototype.getSpecificMarketType = function (id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/types/'+id+'/'
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.message) { respond(data.message) }
		else { respond(null,data) }
	})
}

Crest.prototype.getMarketGroups = function (respond,page) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/groups/' + (page ? ( '?page=' + page ) : '')
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.items) { respond(null,data.items,data.pageCount) }
		else { respond(data.message) }
	})
}

Crest.prototype.getSpecificMarketGroup = function (id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/groups/'+id+'/'
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.message) { respond(data.message) }
		else { respond(null,data) }
	})
}

Crest.prototype.getMarketTypes = function (respond,page) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/types/' + (page ? ( '?page=' + page ) : '')
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.items) { respond(null,data.items,data.pageCount) }
		else { respond(data.message) }
	})
}

Crest.prototype.getSpecificMarketType = function (id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/types/'+id+'/'
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.message) { respond(data.message) }
		else { respond(null,data) }
	})
}

Crest.prototype.getInventoryTypes = function (respond,page) {
	var self = this
	request.get({
		url:self._baseUrl+'/inventory/types/' + (page ? ( '?page=' + page ) : '')
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.items) { respond(null,data.items,data.pageCount) }
		else { respond(data.message) }
	})
}

Crest.prototype.getSpecificInventoryType = function (id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/inventory/types/'+id+'/'
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.message) { respond(data.message) }
		else { respond(null,data) }
	})
}

Crest.prototype.getInventoryGroups = function (respond,page) {
	var self = this
	request.get({
		url:self._baseUrl+'/inventory/groups/' + (page ? ( '?page=' + page ) : '')
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.items) { respond(null,data.items,data.pageCount) }
		else { respond(data.message) }
	})
}

Crest.prototype.getSpecificInventoryGroup = function (id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/inventory/groups/'+id+'/'
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.message) { respond(data.message) }
		else { respond(null,data) }
	})
}

Crest.prototype.getMarketPriceByInventoryTypeEveId = function(id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/10000002/history/?type=https://crest-tq.eveonline.com/inventory/types/'+id+'/'
	},function(err,response,data) {
		try {
			data = JSON.parse(data)
		} catch(err){
			data = {}
		}
		if (data && data.message) { respond(data.message) }
		else {
			if (data && data.items && data.items.length) {
				respond(null,data.items[data.items.length-1])
			} else {
				respond(null,{
					volume_str:'',
					lowPrice:0,
					highPrice:0,
					avgPrice:0,
					volume:0,
					orderCount_str:'',
					date:null
				})
			}
		}
	})
}

Crest.prototype.getBlueprintData = function(id,respond) {
	var self = this
	request.get({
		url:'https://www.fuzzwork.co.uk/blueprint/api/xml.php?typeid='+id
	},function(err,response,data) {
		if (data) {
			xml(data,function(err, result) {
				if (result && result.eveapi && result.eveapi.activity && result.eveapi.activity.length && result.eveapi.activity[0].materials.length) {
	    			var res = []
	    			for (var i = 0; i < result.eveapi.activity.length; i++) {
	    				if (result.eveapi.activity[i].$.activity == 1 || result.eveapi.activity[i].$.activity == '1') {
	    					res = result.eveapi.activity[i].materials[0].material
	    				}
	    			}
	    			respond(null,res)
				} else { respond(null,[]) }
			})
		} else { respond(null,[]) }
	})
}

Crest.prototype.getInventoryTypeCost = function(id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/10000002/orders/sell/?type=https://crest-tq.eveonline.com/inventory/types/'+id+'/'
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.message) { return respond(data.message) }
		var items = data.items
		var cost = items.length ? items[items.length-1].price : 0
		return respond(null,cost)
	})
}

Crest.prototype.getInventoryTypeSellFor = function(id,respond) {
	var self = this
	request.get({
		url:self._baseUrl+'/market/10000002/orders/buy/?type=https://crest-tq.eveonline.com/inventory/types/'+id+'/'
	},function(err,response,data) {
		data = JSON.parse(data)
		if (data.message) { return respond(data.message) }
		var items = data.items
		var cost = items.length ? items[items.length-1].price : 0
		return respond(null,cost)
	})
}

module.exports = new Crest()