var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile(path.resolve('../client/index.html'));
});

var USERS  = {};
var userId = 0;

io.on('connection', function(socket) {
    socket.emit('userId', {userId: userId++});

    socket.on('mousemove', function(message) {
        console.log(message);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});