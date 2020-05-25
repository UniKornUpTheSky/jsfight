const fs = require('fs');

module.exports = {
    rf : function(url, res) {
        fs.readFile(url, 'utf8', function(err, data) {
            if(err) {
                console.log("error while reading file at : " + url + '\n' + err.status + " " + err.message);
                data = "error while reading file at : " + url;
                res.status(404);
            }
            res.end(data);
        });
    },
    ri : function(url, res){
        fs.readFile(url, function(err, data) {
            if(err) {
                console.log("error while reading file at : " + url + '\n' + err.status + " " + err.message);
                data = "error while reading file at : " + url;
                res.status(404);
            }
            else {
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
            }
            res.end(data);
        })
    }
};