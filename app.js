const express = require('express');
const database = require('./db');
const fs = require('./fs');
const favicon = require('serve-favicon');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const uuid = require('uuid/v1');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const index = require('./routes/index');
const connection = require('./routes/connection');
const registration = require('./routes/registration');
const gameBoard = require('./routes/gameBoard');
const api = require('./routes/api');
const disconnection = require('./routes/disconnection');
const profile = require('./routes/profile');
const lobby = require('./routes/lobby');

var time;
var log;
var userCountIndex = 0;
var userCountLobby = 0;
var userCountGame = 0;
var gameCount = 0;
var playerOne;
var playerTwo;
var socketIdOne;
var idone;
var idtwo;
var ssn;

database.connection();

app.use(function (req, res, next) {
    req.db = database.getDB();
    if(!req.db){
        database.connection();
    }
    next();
});

app.use(favicon(__dirname + '/favicon.ico'));

app.use(cookieParser());

app.use(session({secret : 'ITSASECRET', genid: function(req) { return uuid(); }, resave: false, saveUninitialized: true}));

io.of('/index').on('connection', function(socket){
    userCountIndex++;
    console.log("Welcome, there is "+userCountIndex+" user(s) in index");
    socket.on('newMessage', function(data) {
        socket.emit('displayMessage', data.message, data.pseudo);
        socket.broadcast.emit('displayMessage', data.message, data.pseudo);
        console.log("message sent");
    });
    socket.on('disconnect', function() {
        userCountIndex--;
        console.log("bye bye, only "+userCountIndex+" user(s) left in index")
    });
});

io.of('/lobby').on('connection', function(socket) {
    userCountLobby++;
    console.log("Welcome, there is "+userCountLobby+" user(s) in lobby");
    if(userCountLobby == 2){
        setTimeout(function(){
            socket.emit('sendUser');
            socket.broadcast.emit('sendUser');
        }, 1000);
    }
    socket.on('userSent', function(user) {
        gameCount++;
        console.log("GameCount = " + gameCount);
        if(gameCount == 1){
            playerOne = user;
            socketIdOne = socket.id;
        }
        if(gameCount == 2){
            playerTwo = user;
        }
        if(playerOne && playerTwo){
            gameCount = 0;
            socket.broadcast.to(socketIdOne).emit("opponentFound", playerOne.user, playerTwo.user);
            socket.emit("opponentFound", playerOne.user, playerTwo.user);
        }
    });
    socket.on('disconnect', function() {
        userCountLobby--;
        console.log("bye bye, only "+userCountLobby+" user(s) left in lobby")
    });
});

io.of('/game').on('connection', function(socket){
    userCountGame++;
    console.log("Welcome, there is "+userCountGame+" user(s) in game");
    if(userCountGame == 1){
        idone = socket.id;
    }
    if(userCountGame == 2){
        idtwo = socket.id;
    }
    socket.on("rightPone", function(){
        console.log("rightPone");
        socket.broadcast.to(idone).emit('rightPone');
        socket.broadcast.to(idtwo).emit("rightPone");
    }).on('leftPone', function(){
        console.log("leftPone");
        socket.broadcast.to(idone).emit('leftPone');
        socket.broadcast.to(idtwo).emit("leftPone");
    }).on('jumpPone', function(){
        console.log("jumpPone");
        socket.broadcast.to(idone).emit('jumpPone');
        socket.broadcast.to(idtwo).emit("jumpPone");
    }).on('crouchPone', function(){
        console.log("crouchPone");
        socket.broadcast.to(idone).emit('crouchPone');
        socket.broadcast.to(idtwo).emit("crouchPone");
    }).on('kickPone', function(){
        console.log("kickPone");
        socket.broadcast.to(idone).emit('kickPone');
        socket.broadcast.to(idtwo).emit("kickPone");
    }).on('punchPone', function(){
        console.log("punchPone");
        socket.broadcast.to(idone).emit('punchPone');
        socket.broadcast.to(idtwo).emit("punchPone");
    }).on('specPone', function(){
        console.log("specPone");
        socket.broadcast.to(idone).emit('specPone');
        socket.broadcast.to(idtwo).emit("specPone");
    }).on('stopJumpPone', function(){
        console.log("stopJumpPone");
        socket.broadcast.to(idone).emit('stopJumpPone');
        socket.broadcast.to(idtwo).emit("stopJumpPone");
    }).on('stopCrouchPone', function(){
        console.log("stopCrouchPone");
        socket.broadcast.to(idone).emit('stopCrouchPone');
        socket.broadcast.to(idtwo).emit("stopCrouchPone");
    }).on('rightPtwo', function(){
        console.log("rightPtwo");
        socket.broadcast.to(idone).emit('rightPtwo');
        socket.broadcast.to(idtwo).emit("rightPtwo");
    }).on('leftPtwo', function(){
        console.log("leftPtwo");
        socket.broadcast.to(idone).emit('leftPtwo');
        socket.broadcast.to(idtwo).emit("leftPtwo");
    }).on('jumpPtwo', function(){
        console.log("jumpPtwo");
        socket.broadcast.to(idone).emit('crouchPone');
        socket.broadcast.to(idtwo).emit("crouchPone");
    }).on('crouchPtwo', function(){
        console.log("crouchPtwo");
        socket.broadcast.to(idone).emit('crouchPtwo');
        socket.broadcast.to(idtwo).emit("crouchPtwo");
    }).on('kickPtwo', function(){
        console.log("kickPtwo");
        socket.broadcast.to(idone).emit('kickPtwo');
        socket.broadcast.to(idtwo).emit("kickPtwo");
    }).on('punchPtwo', function(){
        console.log("punchPtwo");
        socket.broadcast.to(idone).emit('punchPtwo');
        socket.broadcast.to(idtwo).emit("punchPtwo");
    }).on('specPtwo', function(){
        console.log("specPtwo");
        socket.broadcast.to(idone).emit('punchPtwo');
        socket.broadcast.to(idtwo).emit("punchPtwo");
    }).on('stopJumpPtwo', function(){
        console.log("stopJumpPtwo");
        socket.broadcast.to(idone).emit('stopJumpPtwo');
        socket.broadcast.to(idtwo).emit("stopJumpPtwo");
    }).on('stopCrouchPtwo', function(){
        console.log("stopCrouchPtwo");
        socket.broadcast.to(idone).emit('stopCrouchPtwo');
        socket.broadcast.to(idtwo).emit("stopCrouchPtwo");
    });
    socket.on('disconnect', function() {
        userCountGame--;
        console.log("bye bye, only "+userCountGame+" user(s) left in game")
    });
});

app.all('*', function(req, res, next) {
    if(req.url.split('.').pop() == 'js' || req.url.split('.').pop() == 'css'){
        fs.rf('.' + req.url, res);
    }
    if(req.url.split('.').pop() == 'png' || req.url.split('.').pop() == 'jpg'){
        fs.ri('.' + req.url, res);
    }
    ssn = req.session;
    time = new Date().getTime();
    log = 'Method : ' + req.method + '    Url : ' + req.url;
    next();
});

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', { error: err });
    next(err);
});

app.use('/' ,index);

app.use('/connection', connection);

app.use('/registration', registration);

app.use ('/game', gameBoard);

app.use('/api', api);

app.use('/disconnection', disconnection);

app.use('/profile', profile);

app.use('/lobby' , lobby);

app.all('*', function(req, res) {
    var genTime = new Date().getTime() - time;
    log += "    Status : " + res.statusCode + "    Generation Time : " + genTime + " miliseconds";
    console.log(log);
});

server.listen(3000);