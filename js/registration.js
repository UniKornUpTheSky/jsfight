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