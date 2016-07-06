var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile(path.resolve('../client/index.html'));
});

app.use(require('express').static('../client'));

var players  = [];
var playerId = 0;

io.on('connection', function(socket) {
    socket.on('new_player', function(data) {
        data.id = socket.id;

        players[playerId] = data;
        playerId++;

        console.log('NEW PLAYER', players);

        io.emit('players_data', players);
    })

    socket.on('player_move', function(data) {
        if (! players.length) {
            return;
        }

        for (var i = 0, length = players.length; i < length; i++) {
            if (players[i].id === socket.id) {
                players[i].x = data.pos.x;
                players[i].y = data.pos.y;

                // console.log('Client: ', data);
                break;
            }
        }

        io.emit('players_data', players);
    });

    socket.on('disconnect', function() {
        players = players.filter(function(player, index) {
            return (player.id !== socket.id);
        });

        if (playerId > 0) {
            playerId--;
        }
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});