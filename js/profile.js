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
                verifNotEmpty : function () {
                    var oldPass = $('#oldPass').val();
                    var newPass = $('#newPass').val();
                    var confirmPass = $('#confirmPass').val();

                    if( oldPass !== '' && newPass !== '' && confirmPass !== '' ){
                        $('#confirm').modal('show');
                    }else{
                        $('.alertMessage').empty().append(' All fields must be filled');
                        $('.alertPopup').removeAttr('style');
                        setTimeout(function () {
                            $('.alertPopup').attr('style','display:none');
                        },2000);
                    }
                },

                editPass : function () {

                    $.ajax({
                        type: 'POST',
                        data: {
                            old : $('#oldPass').val(),
                            password : $('#newPass').val(),
                            confirm : $('#confirmPass').val()
                        },
                        contentType: 'application/json',
                        url: 'http://localhost:3000/profile/password',
                        success: function(data) {
                            console.log('password edited');
                            window.location = '/profile'
                        }
                    });

                    $('#oldPass').val('');
                    $('#newPass').val('');
                    $('#confirmPass').val('');
                    $('#confirm').modal('hide');
                    $('#editPass').modal('hide');
                },

                backToHome : function () {
                    window.location = '/';
                }
            }
        });
    },
    dataType : "json"
});