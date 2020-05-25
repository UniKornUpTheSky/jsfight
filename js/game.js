var session;
var socket;
var winPlayer = false;
var winOp = false;

$.ajax({
    url : '/api/session',
    success : function(data){
        session = data;
        var app = new Vue({
            el : '#app',
            data : {
                session : session
            }
        });
    },
    dataType : "json"
});


$(document).ready(function () {

    // Usable functions
    function clearCanvas() {
        ctx.clearRect(0, 0, c.width, c.height);
    }


    function resetPlayers() {
        $('.player').attr('data-valuenow','');
        $('.oponent').attr('data-valuenow','');
        $('.player').attr('style','width : 100% ; background-color: green;');
        $('.oponent').attr('style','width : 100% ; background-color: green;');
        session.playerone = {};
        session.playertwo = {};
        clearCanvas();
        ctx.fillRect(positionX, positionDown, 20 , height);
        ctx.fillRect(positionXop, positionDown, 20 , height);
        window.location = '/'
    }
    
    function checkWin() {
        if ($('.player').attr('data-valuenow') === 'KO' && winOp === true){
            $('.winMessage').empty().append('Player 2 win this game, better luck next time Player 1');
            $('#endGame').modal('show');
            winPlayer = false;
            $('.endGameButton').on('click', function () {
                $.ajax({
                    url : '/profile/endgameplayerone',
                    type : "POST",
                    data : {
                        win : false,
                        played : session.playerone.played+1,
                        time : session.playerone.time + 100,
                    }
                });
                $.ajax({
                    url : '/profile/endgameplayertwo',
                    type : "POST",
                    data : {
                        win : true,
                        played : session.playertwo.played+1,
                        time : session.playertwo.time + 100,
                    }
                });
                resetPlayers();
            });
        }else if ($('.oponent').attr('data-valuenow') === 'KO' && winPlayer === true){
            $('.winMessage').empty().append('Player 1 win this game, better luck next time Player 2');
            $('#endGame').modal('show');
            winOp = false;
            $('.endGameButton').on('click', function () {
                $.ajax({
                    url : '/profile/endgameplayerone',
                    type : "POST",
                    data : {
                        win : false,
                        played : session.playerone.played+1,
                        time : session.playerone.time + 100,
                    }
                });
                $.ajax({
                    url : '/profile/endgameplayertwo',
                    type : "POST",
                    data : {
                        win : true,
                        played : session.playertwo.played+1,
                        time : session.playertwo.time + 100,
                    }
                });
                resetPlayers();
            });
        }
    }

    function checkAtkSpePlayer(){
        if (powerPlayer === 100) {
            $('.alertSpePlayer').attr('style', 'color : green;');
            $('.alertSpePlayer').empty().append('Special attack ready to use !');
        }


    }

    function checkAtkSpeOp(){
        if (powerOp === 100) {
            $('.alertSpeOp').attr('style', 'color : green;');
            $('.alertSpeOp').empty().append('Special attack ready to use !');
        }
    }

    $('#endGame').on('hidden.bs.modal', function () {
        resetPlayers();
    });

    //GLOBAL VARIABLE
    var height = 50;

    //PLAYER
    var positionX = 50;
    var positionDown = 100;
    var newPositionDown;
    var newPositionX;
    var lifePlayer = 100;
    var newLifePlayer;
    var powerPlayer = 0;
    var newPowerPlayer;
    var heightPlayer = 50;

    //OPPONENT

    var positionXop = 200;
    var positionDownOp = 100;
    var newPositionXop;
    var newPositionDownOp;
    var lifeOp = 100;
    var powerOp = 0;
    var newPowerOp;
    var heightOp = 50;

    //CANVAS
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillRect(positionX, positionDown, 20, height);
    ctx.fillRect(positionXop, positionDown, 20, height);

    socket = io('/game');

    socket.on("rightPone", function(){
        console.log("rightPone");
        clearCanvas();
        newPositionX = positionX + 5;
        positionX = newPositionX;
        ctx.fillRect(newPositionX, positionDown, 20, heightPlayer);
        ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
    }).on('leftPone', function(){
        console.log("leftPone");
        clearCanvas();
        newPositionX = positionX - 5;
        positionX = newPositionX;
        ctx.fillRect(newPositionX, positionDown, 20, heightPlayer);
        ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
    }).on('jumpPone', function(){
        console.log("jumpPone");
        newPositionDown = positionDown - 3;
        positionDown = newPositionDown;
        clearCanvas();
        ctx.fillRect(newPositionX, newPositionDown, 20, heightPlayer);
        ctx.fillRect(positionXop, positionDownOp, 20, heightOp);

        setTimeout(function () {
            clearCanvas();
            ctx.fillRect(positionX, 100, 20, 50);
            ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
            positionDown = 100;
        }, 1000)
    }).on('crouchPone', function(){
        console.log("crouchPone");
        clearCanvas();
        heightPlayer = 40;
        positionDown = 115;
        ctx.fillRect(positionX, positionDown, 20, heightPlayer);
        ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
    }).on('kickPone', function(){
        console.log("kickPone");
        checkAtkSpePlayer();

        newPowerPlayer = powerPlayer + 50;
        if (newPowerPlayer > 100) {
            powerPlayer = 100
        }
        else {
            powerPlayer = newPowerPlayer;
        }

        ctx.fillRect(positionX + 20, 140, 10, 10);

        setTimeout(function () {
            clearCanvas();
            ctx.fillRect(positionX, 100, 20, 50);
            ctx.fillRect(positionXop, 100, 20, 50);
        },100);

        $('.specialPlayer').empty().append(powerPlayer);
        $('.specialPlayer').attr('data-specialPlayer', powerPlayer);

        var newLifeOp = lifeOp - 5;
        lifeOp = newLifeOp;
        if (newLifeOp >= 0) {
            $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
            $('.oponent').attr('data-valuenow', newLifeOp);
        }

        if ($('.oponent').attr('data-valuenow') === '0') {
            winPlayer = true;
            $('.player').attr('data-valuenow', 'win');
            $('.oponent').attr('data-valuenow', 'KO');
            checkWin();
        }
    }).on('punchPone', function(){
        console.log("punchPone");
        checkAtkSpePlayer();
        newLifeOp = lifeOp - 3;
        lifeOp = newLifeOp;

        newPowerPlayer = powerPlayer + 30;
        if (newPowerPlayer > 100) {
            powerPlayer = 100
        }
        else {
            powerPlayer = newPowerPlayer;
        }

        ctx.fillRect(positionX + 20, 110, 10, 10);

        setTimeout(function () {
            clearCanvas();
            ctx.fillRect(positionX, 100, 20, 50);
            ctx.fillRect(positionXop, 100, 20, 50);
        },100);

        $('.specialPlayer').empty().append(powerPlayer);
        $('.specialPlayer').attr('data-specialPlayer', powerPlayer);

        if (newLifeOp >= 0) {
            $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
            $('.oponent').attr('data-valuenow', newLifeOp);
        } else {
            newLifeOp = 0;
            $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
            $('.oponent').attr('data-valuenow', newLifeOp);
        }

        if ($('.oponent').attr('data-valuenow') === '0') {
            winPlayer = true;
            $('.player').attr('data-valuenow', 'win');
            $('.oponent').attr('data-valuenow', 'KO');
            checkWin();
        }
    }).on('specPone', function(){
        console.log("specPone");
        if (powerPlayer === 0) {
            $('.alertSpePlayer').attr('style', 'color : red;');
            $('.alertSpePlayer').empty().append('You can\'t use ATK SPE until power isn\'t  under 100% !');
            setTimeout(function () {
                $('.alertSpePlayer').attr('style', 'display : none;');
            }, 1000);
        }

        if (powerPlayer > 100) {
            powerPlayer = 100;
            $('.specialPlayer').append(powerPlayer);
            $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
        }

        if (powerPlayer === 100) {
            $('.alertSpePlayer').attr('style', 'display : none;');
            newLifeOp = lifeOp - 30;
            lifeOp = newLifeOp;
            if (newLifeOp >= 0) {
                $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
                $('.oponent').attr('data-valuenow', newLifeOp);
                powerPlayer = 0;
                $('.specialPlayer').empty().append(powerPlayer);
                $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
                powerPlayer = 0;
                $('.specialPlayer').empty().append(powerPlayer);
                $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
            } else {
                newLifeOp = 0;
                $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
                $('.oponent').attr('data-valuenow', newLifeOp);
                powerPlayer = 0;
                $('.specialPlayer').empty().append(powerPlayer);
                $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
            }

            if ($('.oponent').attr('data-valuenow') === '0') {
                winPlayer = true;
                $('.player').attr('data-valuenow', 'win');
                $('.oponent').attr('data-valuenow', 'KO');
                checkWin();
            }
        }
    }).on('stopJumpPone', function(){
        console.log("stopJumpPone");
        positionDown = 100;
        clearCanvas();
        ctx.fillRect(positionX, positionDown, 20, heightPlayer);
        ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
        positionDown = 100;
    }).on('stopCrouchPone', function(){
        console.log("stopCrouchPone");
        heightPlayer = 50;
        positionDown = 100;
        clearCanvas();
        ctx.fillRect(positionX, positionDown, 20, heightPlayer);
        ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
    }).on('rightPtwo', function(){
        console.log("rightPtwo");
        clearCanvas();
        newPositionXop = positionXop + 5;
        positionXop = newPositionXop;
        ctx.fillRect(positionX, positionDown, 20, heightPlayer);
        ctx.fillRect(newPositionXop, positionDownOp, 20, heightOp);
    }).on('leftPtwo', function(){
        console.log("leftPtwo");
        clearCanvas();
        newPositionXop = positionXop - 5;
        positionXop = newPositionXop;
        ctx.fillRect(positionX, positionDown, 20, heightPlayer);
        ctx.fillRect(newPositionXop, positionDownOp, 20, heightOp);
    }).on('jumpPtwo', function(){
        console.log("jumpPtwo");
        clearCanvas();
        newPositionDownOp = positionDownOp - 3;
        positionDownOp = newPositionDownOp;
        ctx.fillRect(positionX, positionDown, 20, heightPlayer);
        ctx.fillRect(newPositionXop, newPositionDownOp, 20, heightOp);

        setTimeout(function () {
            clearCanvas();
            ctx.fillRect(positionX, positionDown, 20, heightPlayer);
            ctx.fillRect(positionXop, 100, 20, 50);
            positionDown = 100;
            positionDownOp = 100;
        }, 1000)
    }).on('crouchPtwo', function(){
        console.log("crouchPtwo");
        clearCanvas();
        heightOp = 40;
        positionDownOp = 115;
        ctx.fillRect(positionX, positionDown, 20, heightPlayer);
        ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
    }).on('kickPtwo', function(){
        console.log("kickPtwo");
        checkAtkSpeOp();
        newLifePlayer = lifePlayer - 5;
        lifePlayer = newLifePlayer;

        newPowerOp = powerOp + 50;
        if (newPowerOp > 100) {
            powerOp = 100
        }
        else {
            powerOp = newPowerOp;
        }

        var positionIfNegative = positionXop - 20;
        if(positionIfNegative < 0) {
            positionIfNegative = 0;
        }

        ctx.fillRect(positionIfNegative - 20, 140, 10, 10);

        setTimeout(function () {
            clearCanvas();
            ctx.fillRect(positionX, 100, 20, 50);
            ctx.fillRect(positionXop, 100, 20, 50);
        },100);

        $('.specialOp').empty().append(powerOp);
        $('.specialOp').attr('data-specialOp', powerOp);

        if (newLifePlayer >= 0) {
            $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
            $('.player').attr('data-valuenow', newLifePlayer);
        }

        if ($('.player').attr('data-valuenow') === '0') {
            winOp = true;
            $('.player').attr('data-valuenow', 'KO');
            $('.oponent').attr('data-valuenow', 'win');
            checkWin();
        }
    }).on('punchPtwo', function(){
        console.log("punchPtwo");
        checkAtkSpeOp();

        newLifePlayer = lifePlayer - 5;
        lifePlayer = newLifePlayer;

        newPowerOp = powerOp + 30;
        if (newPowerOp > 100) {
            powerOp = 100
        }
        else {
            powerOp = newPowerOp;
        }

        var positionIfNegative = positionXop - 20;
        if(positionIfNegative < 0) {
            positionIfNegative = 0;
        }

        ctx.fillRect(positionIfNegative - 20, 110, 10, 10);

        setTimeout(function () {
            clearCanvas();
            ctx.fillRect(positionX, 100, 20, 50);
            ctx.fillRect(positionXop, 100, 20, 50);
        },100);

        $('.specialOp').empty().append(powerOp);
        $('.specialOp').attr('data-specialOp', powerOp);


        newLifePlayer = lifePlayer - 3;
        lifePlayer = newLifePlayer;
        if (newLifePlayer >= 0) {
            $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
            $('.player').attr('data-valuenow', newLifePlayer);
        } else {
            newLifePlayer = 0;
            $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
            $('.player').attr('data-valuenow', newLifePlayer);
        }

        if ($('.player').attr('data-valuenow') === '0') {
            winOp = true;
            $('.player').attr('data-valuenow', 'KO');
            $('.oponent').attr('data-valuenow', 'win');
            checkWin();
        }
    }).on('specPtwo', function(){
        console.log('specPtwo');
        if (powerOp !== 100) {
            $('.alertSpePOp').attr('style', 'color : red;');
            setTimeout(function () {
                $('.alertSpePOp').attr('style', 'display : none;');
            }, 1000);
        }

        if (powerOp > 100) {
            powerOp = 100;
            $('.specialOp').append(powerOp);
            $('.specialOp').attr('data-specialPlayer', powerOp);
        }

        if (powerOp === 100) {
            $('.alertSpePOp').attr('style', 'display : none;');

            newLifePlayer = lifePlayer - 30;
            lifePlayer = newLifePlayer;
            if (newLifePlayer >= 0) {
                $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
                $('.player').attr('data-valuenow', newLifePlayer);
            } else {
                newLifePlayer = 0;
                $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
                $('.player').attr('data-valuenow', newLifePlayer);
                powerOp = 0;
                $('.specialOp').empty().append(powerOp);
                $('.specialOp').attr('data-specialPlayer', powerOp);
            }

            if ($('.player').attr('data-valuenow') === '0') {
                winOp = true;
                $('.player').attr('data-valuenow', 'KO');
                $('.oponent').attr('data-valuenow', 'win');
                checkWin();
            }


        }
    }).on('stopJumpPtwo', function(){
        console.log("stopJumpPtwo");
        positionDownOp = 100;
        clearCanvas();
        ctx.fillRect(positionXop, positionDown, 20, heightPlayer);
        ctx.fillRect(positionX, positionDownOp, 20, heightOp);
        positionDown = 100;
    }).on('stopCrouchPtwo', function(){
        console.log("stopCrouchPtwo");
        positionDownOp = 100;
        heightOp = 50;
        clearCanvas();
        ctx.fillRect(positionXop, positionDown, 20, heightPlayer);
        ctx.fillRect(positionX, positionDownOp, 20, heightOp);
    });


    function initKeyPress() {
        var pressedKeys = {};
        var keysCount = 0;
        var interval = null;
        const trackedKeys = {
            //PLAYER
            90: true,   // Z Kick
            65: true,   // A Punch
            81: true,   // Q Left
            83: true,   // S Crouch
            68: true,   // D Right
            69: true,   // E Special attack
            32: true,   // JUMP

            //OPONENT
            79: true,   // O kick
            73: true,   // I Punch
            75: true,   // K Left
            76: true,   // L Crouch
            77: true,   // M Right
            16: true,   // SHIFT Jump
            80: true,   // P Special attac
        };

        $(document).keydown(function (event) {
            const keyCode = event.which;
            const testParSeconde = 50;

            if (trackedKeys[keyCode]) {
                if (!pressedKeys[keyCode]) {
                    pressedKeys[keyCode] = true;
                    keysCount++;
                }

                if (interval === null) {
                    interval = setInterval(function () {
                        // Event on key pressed

                        ///////////////////////FIGHT///////////////////////

                        ///////////PLAYER///////////

                        if (pressedKeys[90]) { //KICK

                            socket.emit('kickPone');
                            checkAtkSpePlayer();

                            newPowerPlayer = powerPlayer + 50;
                            if (newPowerPlayer > 100) {
                                powerPlayer = 100
                            }
                            else {
                                powerPlayer = newPowerPlayer;
                            }

                            ctx.fillRect(positionX + 20, 140, 10, 10);

                            setTimeout(function () {
                                clearCanvas();
                                ctx.fillRect(positionX, 100, 20, 50);
                                ctx.fillRect(positionXop, 100, 20, 50);
                            },100);

                            $('.specialPlayer').empty().append(powerPlayer);
                            $('.specialPlayer').attr('data-specialPlayer', powerPlayer);

                            var newLifeOp = lifeOp - 5;
                            lifeOp = newLifeOp;
                            if (newLifeOp >= 0) {
                                $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
                                $('.oponent').attr('data-valuenow', newLifeOp);
                            }

                            if ($('.oponent').attr('data-valuenow') === '0') {
                                winPlayer = true;
                                $('.player').attr('data-valuenow', 'win');
                                $('.oponent').attr('data-valuenow', 'KO');
                                checkWin();
                            }
                        }

                        if (pressedKeys[65]) { //PUNCH

                            socket.emit('punchPone');

                            checkAtkSpePlayer();
                            newLifeOp = lifeOp - 3;
                            lifeOp = newLifeOp;

                            newPowerPlayer = powerPlayer + 30;
                            if (newPowerPlayer > 100) {
                                powerPlayer = 100
                            }
                            else {
                                powerPlayer = newPowerPlayer;
                            }

                            ctx.fillRect(positionX + 20, 110, 10, 10);

                            setTimeout(function () {
                                clearCanvas();
                                ctx.fillRect(positionX, 100, 20, 50);
                                ctx.fillRect(positionXop, 100, 20, 50);
                            },100);

                            $('.specialPlayer').empty().append(powerPlayer);
                            $('.specialPlayer').attr('data-specialPlayer', powerPlayer);

                            if (newLifeOp >= 0) {
                                $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
                                $('.oponent').attr('data-valuenow', newLifeOp);
                            } else {
                                newLifeOp = 0;
                                $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
                                $('.oponent').attr('data-valuenow', newLifeOp);
                            }

                            if ($('.oponent').attr('data-valuenow') === '0') {
                                winPlayer = true;
                                $('.player').attr('data-valuenow', 'win');
                                $('.oponent').attr('data-valuenow', 'KO');
                                checkWin();
                            }
                        }


                        if (pressedKeys[69]) { //SPECIAL

                            socket.emit('specPone');

                            if (powerPlayer === 0) {
                                $('.alertSpePlayer').attr('style', 'color : red;');
                                $('.alertSpePlayer').empty().append('You can\'t use ATK SPE until power isn\'t  under 100% !');
                                setTimeout(function () {
                                    $('.alertSpePlayer').attr('style', 'display : none;');
                                }, 1000);
                            }

                            if (powerPlayer > 100) {
                                powerPlayer = 100;
                                $('.specialPlayer').append(powerPlayer);
                                $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
                            }

                            if (powerPlayer === 100) {
                                $('.alertSpePlayer').attr('style', 'display : none;');
                                newLifeOp = lifeOp - 30;
                                lifeOp = newLifeOp;
                                if (newLifeOp >= 0) {
                                    $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
                                    $('.oponent').attr('data-valuenow', newLifeOp);
                                    powerPlayer = 0;
                                    $('.specialPlayer').empty().append(powerPlayer);
                                    $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
                                    powerPlayer = 0;
                                    $('.specialPlayer').empty().append(powerPlayer);
                                    $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
                                } else {
                                    newLifeOp = 0;
                                    $('.oponent').attr('style', 'width :' + newLifeOp + '% ; background-color: green;');
                                    $('.oponent').attr('data-valuenow', newLifeOp);
                                    powerPlayer = 0;
                                    $('.specialPlayer').empty().append(powerPlayer);
                                    $('.specialPlayer').attr('data-specialPlayer', powerPlayer);
                                }

                                if ($('.oponent').attr('data-valuenow') === '0') {
                                    winPlayer = true;
                                    $('.player').attr('data-valuenow', 'win');
                                    $('.oponent').attr('data-valuenow', 'KO');
                                    checkWin();
                                }
                            }
                        }

                        ///////////OPONENT///////////

                        if (pressedKeys[79]) { //KICK

                            socket.emit('kickPtwo');

                            checkAtkSpeOp();
                            newLifePlayer = lifePlayer - 5;
                            lifePlayer = newLifePlayer;

                            newPowerOp = powerOp + 50;
                            if (newPowerOp > 100) {
                                powerOp = 100
                            }
                            else {
                                powerOp = newPowerOp;
                            }

                            ctx.fillRect(positionXop + 20, 140, 10, 10);

                            setTimeout(function () {
                                clearCanvas();
                                ctx.fillRect(positionX, 100, 20, 50);
                                ctx.fillRect(positionXop, 100, 20, 50);
                            },100);

                            $('.specialOp').empty().append(powerOp);
                            $('.specialOp').attr('data-specialOp', powerOp);

                            if (newLifePlayer >= 0) {
                                $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
                                $('.player').attr('data-valuenow', newLifePlayer);
                            }

                            if ($('.player').attr('data-valuenow') === '0') {
                                winOp = true;
                                $('.player').attr('data-valuenow', 'KO');
                                $('.oponent').attr('data-valuenow', 'win');
                                checkWin();
                            }
                        }

                        if (pressedKeys[73]) { //PUNCH

                            socket.emit('punchPtwo');

                            checkAtkSpeOp();

                            newLifePlayer = lifePlayer - 5;
                            lifePlayer = newLifePlayer;

                            newPowerOp = powerOp + 30;
                            if (newPowerOp > 100) {
                                powerOp = 100
                            }
                            else {
                                powerOp = newPowerOp;
                            }

                            ctx.fillRect(positionXop + 20, 110, 10, 10);

                            setTimeout(function () {
                                clearCanvas();
                                ctx.fillRect(positionX, 100, 20, 50);
                                ctx.fillRect(positionXop, 100, 20, 50);
                            },100);

                            $('.specialOp').empty().append(powerOp);
                            $('.specialOp').attr('data-specialOp', powerOp);


                            newLifePlayer = lifePlayer - 3;
                            lifePlayer = newLifePlayer;
                            if (newLifePlayer >= 0) {
                                $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
                                $('.player').attr('data-valuenow', newLifePlayer);
                            } else {
                                newLifePlayer = 0;
                                $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
                                $('.player').attr('data-valuenow', newLifePlayer);
                            }

                            if ($('.player').attr('data-valuenow') === '0') {
                                winOp = true;
                                $('.player').attr('data-valuenow', 'KO');
                                $('.oponent').attr('data-valuenow', 'win');
                                checkWin();
                            }
                        }

                        if (pressedKeys[80]) { //SPECIAL

                            socket.emit('specPtwo', {player : session.playerone});

                            if (powerOp !== 100) {
                                $('.alertSpePOp').attr('style', 'color : red;');
                                setTimeout(function () {
                                    $('.alertSpePOp').attr('style', 'display : none;');
                                }, 1000);
                            }

                            if (powerOp > 100) {
                                powerOp = 100;
                                $('.specialOp').append(powerOp);
                                $('.specialOp').attr('data-specialPlayer', powerOp);
                            }

                            if (powerOp === 100) {
                                $('.alertSpePOp').attr('style', 'display : none;');

                                newLifePlayer = lifePlayer - 30;
                                lifePlayer = newLifePlayer;
                                if (newLifePlayer >= 0) {
                                    $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
                                    $('.player').attr('data-valuenow', newLifePlayer);
                                } else {
                                    newLifePlayer = 0;
                                    $('.player').attr('style', 'width :' + newLifePlayer + '% ; background-color: green;');
                                    $('.player').attr('data-valuenow', newLifePlayer);
                                    powerOp = 0;
                                    $('.specialOp').empty().append(powerOp);
                                    $('.specialOp').attr('data-specialPlayer', powerOp);
                                }

                                if ($('.player').attr('data-valuenow') === '0') {
                                    winOp = true;
                                    $('.player').attr('data-valuenow', 'KO');
                                    $('.oponent').attr('data-valuenow', 'win');
                                    checkWin();
                                }


                            }
                        }


                        ///////////////////////MOVE///////////////////////
                        ///////////PLAYER///////////
                        if (pressedKeys[81] && positionX > 0) { //LEFT

                            socket.emit('leftPone');

                            clearCanvas();
                            newPositionX = positionX - 5;
                            positionX = newPositionX;
                            ctx.fillRect(newPositionX, positionDown, 20, heightPlayer);
                            ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
                        }
                        if (pressedKeys[68] && positionX < (c.width - 20)) { //RIGHT

                            socket.emit('rightPone');

                            clearCanvas();
                            newPositionX = positionX + 5;
                            positionX = newPositionX;
                            ctx.fillRect(newPositionX, positionDown, 20, heightPlayer);
                            ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
                        }

                        if (pressedKeys[32] && positionDown > 0) { //JUMP

                            socket.emit('jumpPone');

                            newPositionDown = positionDown - 3;
                            positionDown = newPositionDown;
                            clearCanvas();
                            ctx.fillRect(newPositionX, newPositionDown, 20, heightPlayer);
                            ctx.fillRect(positionXop, positionDownOp, 20, heightOp);

                            setTimeout(function () {
                                clearCanvas();
                                ctx.fillRect(positionX, 100, 20, 50);
                                ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
                                positionDown = 100;
                            }, 1000)
                        }

                        if (pressedKeys[83]) { //CROUCH

                            socket.emit('crouchPone');

                            clearCanvas();
                            heightPlayer = 40;
                            positionDown = 115;
                            ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                            ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
                        }

                        ///////////OPONENT///////////

                        if (pressedKeys[75] && positionXop > 0) { //LEFT

                            socket.emit('leftPtwo');

                            clearCanvas();
                            newPositionXop = positionXop - 5;
                            positionXop = newPositionXop;
                            ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                            ctx.fillRect(newPositionXop, positionDownOp, 20, heightOp);
                        }

                        if (pressedKeys[77] && positionX < (c.width - 20)) { //RIGHT

                            socket.emit('rightPtwo');

                            clearCanvas();
                            newPositionXop = positionXop + 5;
                            positionXop = newPositionXop;
                            ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                            ctx.fillRect(newPositionXop, positionDownOp, 20, heightOp);
                        }

                        if (pressedKeys[16] && positionDown > 0) { //JUMP

                            socket.emit('jumpPtwo');

                            clearCanvas();
                            newPositionDownOp = positionDownOp - 3;
                            positionDownOp = newPositionDownOp;
                            ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                            ctx.fillRect(newPositionXop, newPositionDownOp, 20, heightOp);

                            setTimeout(function () {
                                clearCanvas();
                                ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                                ctx.fillRect(positionXop, 100, 20, 50);
                                positionDown = 100;
                                positionDownOp = 100;
                            }, 1000)
                        }

                        if (pressedKeys[76]) { //CROUCH

                            socket.emit('crouchPtwo');

                            clearCanvas();
                            heightOp = 40;
                            positionDownOp = 115;
                            ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                            ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
                        }


                    }, testParSeconde);
                }
            }
        });

        $(document).keyup(function (event) {
            var keyCode = event.which;
            const testParSeconde = 50;

            if (trackedKeys[keyCode]) {
                if (!pressedKeys[keyCode]) {
                    pressedKeys[keyCode] = true;
                    keysCount++;
                }

                if (interval === null) {
                    interval = setInterval(function () {
                    }, testParSeconde);
                }
            }

            if (pressedKeys[keyCode]) {
                delete pressedKeys[keyCode];
                keysCount--;
            }

            // need to check if keyboard movement stopped
            if ((trackedKeys[keyCode]) && (keysCount === 0)) {
                clearInterval(interval);
                interval = null;
            }
        });
    }


    $(document).keyup(function () {
        var pressedKeys = {};
        const trackedKeys = {
            //Player
            83: true,   // S Crouch
            32: true,   // JUMP space

            //OPONENT
            76: true,   // L Crouch
            16: true   // SHIFT Jump
        };

        const keyCode = event.which;

        if (trackedKeys[keyCode]) {
            if (!pressedKeys[keyCode]) {
                pressedKeys[keyCode] = true;
            }

            if (pressedKeys[32]) { // AFTER JUMP , GO DOWN ON EARTH

                socket.emit('stopJumpPone');

                positionDown = 100;
                clearCanvas();
                ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
                positionDown = 100;
            }

            if (pressedKeys[83]) { // AFTER CROUCH GO BACK STAND UP

                socket.emit('stopCrouchPone');

                heightPlayer = 50;
                positionDown = 100;
                clearCanvas();
                ctx.fillRect(positionX, positionDown, 20, heightPlayer);
                ctx.fillRect(positionXop, positionDownOp, 20, heightOp);
            }


            if (pressedKeys[16]) { // AFTER JUMP , GO DOWN ON EARTH

                socket.emit('stopJumpPtwo');

                positionDownOp = 100;
                clearCanvas();
                ctx.fillRect(positionXop, positionDown, 20, heightPlayer);
                ctx.fillRect(positionX, positionDownOp, 20, heightOp);
                positionDown = 100;
            }

            if (pressedKeys[76]) { // AFTER CROUCH GO BACK STAND UP

                socket.emit('stopCrouchPtwo');

                positionDownOp = 100;
                heightOp = 50;
                clearCanvas();
                ctx.fillRect(positionXop, positionDown, 20, heightPlayer);
                ctx.fillRect(positionX, positionDownOp, 20, heightOp);
            }



        }
    });


    initKeyPress();

});