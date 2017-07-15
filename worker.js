var fs = require('fs'),
    express = require('express'),
    serveStatic = require('serve-static'),
    config = JSON.parse(fs.readFileSync('./config.json')),
    path = require('path')

module.exports.run = function (worker) {
    console.log('   >> Worker PID:', process.pid)

    var app = require('express')()
    process.env = config
    var pool = require('mysql').createPool({
        host            : process.env.DB_HOST,
        user            : process.env.DB_USERNAME,
        password        : process.env.DB_PASSWORD,
        database        : process.env.DB_DATABASE
    })
    process.pool = pool

    var httpServer = worker.httpServer
    var scServer = worker.scServer

    app.set('views', __dirname+'/views')
    app.set('view engine', 'jade')
    app.use(serveStatic(path.resolve(__dirname, 'public')))

    httpServer.on('request', app)

    var Controllers = require('./controllers/Controllers')

    // Routes
    app.use("/",require('./routes/home.js'))
    app.use("/admin",require('./routes/admin.js'))

    app.get("/status", function(req,res) {
        res.json({success:1,message:'Server is live!'})
    })

    // Handle All Other Express Routes
    app.get('*', function(req,res) {
        res.redirect('/')
    })

    scServer.on('connection', function (client) {
        console.log('Client',client.id,'connected to worker',worker.id)

        client.on('messages',function(data,respond) {
            try { Controllers[data['controller']][data['method']](client,data,respond) }
            catch(err) {
                if (data.controller) {
                    console.log(data['controller']+'.'+data['method']+' vue-route failed!')
                    console.log(err)
                    client.emit('response', {
                        success:0,
                        message:data['controller']+'-'+data['method']+' is not implemented yet.'
                    })
                }
            }
        })

    })
}
