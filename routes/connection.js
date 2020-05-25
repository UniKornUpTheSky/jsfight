const express = require('express');
const fs = require('../fs');
const parser = require('querystring');

var router = express.Router();


router.get('/', function (req, res, next) {
    fs.rf('./views/connection.html', res);
    next();

}).post('/', function(req, res, next) {

    var userEntry = {};

    req.on('data', function(chunk) {
        userEntry = parser.parse(chunk.toString());
    });

    req.on('end', function() {
        //Si le nom et le mot de passe sont définis et qu'il les trouve dans la db
        if (userEntry.name && userEntry.password) {

            req.db.collection('User').findOne({name : userEntry.name, password : userEntry.password}, function(err, user) {
                if (err) {
                    console.log(err);
                    fs.rf('./views/connection.html', res);
                }
                else {
                    if(user){
                        delete user.password;
                        req.session.user = user;
                        res.redirect('/');
                    }
                    else {
						console.log("No user found with "+userEntry.name+" and "+userEntry.password);
                        fs.rf('./views/connection.html', res);
                    }
                }
            });
        }
        else {
            fs.rf('./views/connection.html', res);
        }
    });
    next();
});

module.exports = router;