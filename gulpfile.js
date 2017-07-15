var gulp = require('gulp'),
	fs = require('fs'),
	config = JSON.parse(fs.readFileSync('./config.json')),
	async = require('async'),
	templatizer = require('templatizer'),
	SocketCluster = require('socketcluster').SocketCluster,
	socketCluster = null, // set to null before we initialize
	moment = require('moment'),
	exec = require('child_process').exec

process.env = config

gulp.task('default',['templates','start-server']);


gulp.task('test',[
	'templates',
	'build-and-check-js-files'
])


gulp.task('start-server',['minify'],function() {
	console.log("   Starting in "+process.env.ENV+" mode.")

	var sc_config = {
		workers 				: 	require('os').cpus().length	,
	    brokers 				: 	1							,
		logLevel				: 	1							,
	    port 					: 	process.env.PORT || 3000	,
	    appName					: 	'eve_app'					,
		protocol 				: 	'http'						,
		workerController		: 	__dirname + '/worker.js'	,
		brokerController		: 	__dirname + '/broker.js'	,
		socketEventLimit		: 	500							,
		rebootWorkerOnCrash		: 	true 						,
		wsEngine  				:   'uws' 						,
	    brokerOptions: {
	        host:process.env.REDIS_ADDRESS || 'localhost',
	        port:process.env.REDIS_PORT || 6379
	    }
	}

	if (process.env.ENV == 'production') {
		sc_config.protocol = 'https'
		sc_config.protocolOptions = {
			ca: fs.readFileSync(process.env.ENV_CA_PATH,'utf8'),
			key: fs.readFileSync(process.env.ENV_KEY_PATH,'utf8'),
			cert: fs.readFileSync(process.env.ENV_CRT_PATH,'utf8'),
			passphrase: process.env.SESSION_SECRET
		}
	}

	socketCluster = new SocketCluster(sc_config)

	// var server_watcher1 = gulp.watch('models/*.js',['reload']);
	// server_watcher1.on('change',function(event) {
	// 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	// })
	// var server_watcher2 = gulp.watch('*.js',['reload'])
	// server_watcher2.on('change',function(event) {
	// 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	// })
	// var server_watcher3 = gulp.watch('routes/*.js',['reload'])
	// server_watcher3.on('change',function(event) {
	// 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	// })
	// var server_watcher4 = gulp.watch('controllers/*.js',['reload'])
	// server_watcher4.on('change',function(event) {
	// 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	// })

	// var node_watcher5 = gulp.watch('templates/**/*.jade',['templates'])
	// node_watcher5.on('change',function(event) {
	// 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	// })

	// var node_watcher6 = gulp.watch('public/js/**/*.js',['minify'])
	// node_watcher6.on('change',function(event) {
	// 	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	// })
})

gulp.task('reload', function () {
	socketCluster.killWorkers()
	socketCluster.killBrokers()
})

gulp.task('templates',function() {
	console.log("   Server is building client-side templates.")
	templatizer(
		__dirname+'/templates',
		__dirname+'/public/js/templates.js'
	)
	console.log("   Server is finished building client-side templates.")
})

function runGulpUgMin(cb) {
	return gulp.src([
			// DO NOT ADD server.js !!!! That is the admin side one.
			// 'public/js/home/components/vue/boards/receivables/components/*.js',
			// 'public/js/home/components/vue/**/*.js',
			// 'public/js/home/vue.js',
			// 'public/js/home/router.js',
			// 'public/js/home/components/*.js',
			// 'public/js/home/models/**/*.js',
			// 'public/js/home/startup.js'
		])
		.pipe(require('gulp-babel')({
			presets:['es2015']
		}))
		.pipe(require('gulp-concat')('concat.js',{
			newLine:'\n;'
		}))
		.pipe(require('gulp-uglify')())
		.pipe(require('gulp-minify')())
		.pipe(gulp.dest('public'))
}

gulp.task('minify',function(cb) {
	if (process.env.MINIFY == 1) {
		return runGulpUgMin()
	} else { return cb() }
})

gulp.task('build-and-check-js-files',function() {
	console.log("Server is building test minified JS file")
	return runGulpUgMin()
})
