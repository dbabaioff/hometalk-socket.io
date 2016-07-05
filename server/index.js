var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile(path.resolve('../client/index.html'));
});

var players  = [];
var playerId = 0;

io.on('connection', function(socket) {
    socket.on('new_player', function(data) {
        players[playerId] = {
            id: socket.id,
            pos: {
                x: 0, y: 0
            }
        };
        playerId++;

        io.emit('players_data', players);
    });

    socket.on('player_move', function(data) {
        console.log(data);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});