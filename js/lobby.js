$.ajax({
    url : '/api/session',
    success : function(data){
        var session = data;

        var app = new Vue({
            el: '#app',
            data: {
                session: session
            },
            methods: {
                toMain: function () {
                    window.location = "/"
                },
                toFight: function () {
                    window.location = "/game"
                }
            }
        });

        var socket = io('/lobby');

        socket.on('sendUser', function() {
            var user = session.user;
            setTimeout(function(){
                socket.emit('userSent', {user : user});
            }, 1000);
        });

        socket.on('opponentFound', function(playerOne, playerTwo){
            if(playerOne && playerTwo)
            {
                $.ajax({
                    url: '/api/setplayerone',
                    type: "POST",
                    dataType: 'json',
                    data : {
                        id : playerOne._id,
                        name : playerOne.name,
                        win : playerOne.win,
                        played : playerOne.played,
                        time : playerOne.time
                    },
                    success: function (data) {
                        console.log("player one set")
                    }
                });
            }
            if(playerOne && playerTwo)
            {
                $.ajax({
                    url: '/api/setplayertwo',
                    type: "POST",
                    dataType: 'json',
                    data : {
                        id : playerTwo._id,
                        name : playerTwo.name,
                        win : playerTwo.win,
                        played : playerTwo.played,
                        time : playerTwo.time
                    },
                    success: function (data) {
                        console.log("player two set")
                    }
                });
            }
            setTimeout(function(){
                $('#playerFound').modal('show');
            }, 1000);
        });
    }
});

$(document).ready(function () {


    setTimeout(function () {
        $('#noPlayerFound').modal('show');
    },300000);

    /*setTimeout(function () {
     $('#playerFound').modal('show');
     },1000);*/

});