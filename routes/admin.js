var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	parseUrlencoded = bodyParser.urlencoded({ extended:false }),
	async = require('async'),
	pool = process.pool

// Session Middleware
router.use(function(req,res,next) {
  	next()
})

router.route("/")
	.get(function(req,res) {
		res.render('admin/index')
	})

module.exports = router