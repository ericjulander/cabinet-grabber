
var gulp = require('gulp');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
var UglifyJS = require("uglify-js");
var browserSync = require('browser-sync').create();


// Static server
gulp.task('launch-scraper', function (finishedTask) {

    app.get('/live-reload.js', function (req, res) {
        res.sendFile(__dirname + '/live-reload.js');
    });
    
    app.get('/index.html', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    app.get("/reciever.html", (req,res)=>{
        res.sendFile(__dirname+"/reciever.html");
    });
    
    io.on('connection', function (socket) {
        socket.on('get-inject-data', function (msg) {
            pushUpdates(()=>{
                //done pushing data
            });
        });

        socket.on("results", (res)=>{
            console.log(res);
        });

        socket.on("scrape-response", emitData);
    });

    function emitData(html){
        io.emit("html-response", html);
    }
    
    http.listen(5555, function () {
        console.log('listening on *:5555');
       
    });

    gulp.watch('./dev/**/*', (done)=>{
        io.emit("scrape-command",fs.readFileSync("dev/scrape.js","utf8"));
            console.log("Scrape..");
            
    
        // emitData(fs.readFileSync("dev/test.html").toString());
        done();
    });
});

