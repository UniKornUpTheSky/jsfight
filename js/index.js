$.ajax({
    url : '/api/session',
    success : function(data){
        session = data;

        var app = new Vue({
            el : '#app',
            data : {
                session : session
            },
            methods : {
                send : function () {
                    var message = $('.messageToSend').val();
                    var pseudo = $('.pseudo').val();

                    socket.emit('newMessage', {message : message, pseudo: pseudo});
                    $('.messageToSend').focus().val('');
                },
                quickFight : function () {
                    window.location = '/lobby'
                },
                goProfile : function () {
                    window.location = '/profile'
                },
                logout : function () {
                    window.location = '/disconnection'
                }
            }
        });
        var socket = io('/index');

        socket.on('displayMessage', function(message, pseudo){
            $('.tchat').append('<p><label>'+pseudo+' : </label>'+message+'</p>');
        });
    },
    dataType : "json"
});