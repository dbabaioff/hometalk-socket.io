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
        console.log('NEW PLAYER');

        data.id = socket.id;

        players[playerId] = data;
        playerId++;

        io.emit('players_data', players);
    })

    socket.on('player_move', function(data) {
        for (var i = 0, length = players.length; i < length; i++) {
            if (players[i].id === socket.id) {
                players[i].x = data.pos.x;
                players[i].y = data.pos.y;

                console.log('Client: ' + socket.id + ' | X: ' + data.pos.x + ' Y: ' + data.pos.y);
                break;
            }
        }

        io.emit('players_data', players);
    });

    // socket.on('disconnect', function() {
    //     for (var index = 0, length = players.length; index < length; index++) {
    //         if (players[index].id === socket.id) {
    //             players.splice(index, 1);
    //         }
    //     }
    // });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});