const express = require('express');
const fs = require('../fs');
const parser = require('querystring');

var router = express.Router();

router.get('/', function (req, res, next) {

    fs.rf('./views/registration.html', res);
    next();

}).post('/', function(req, res, next) {

    var user = {};

    req.on('data', function(chunk) {
        user = parser.parse(chunk.toString());
    });

    req.on('end', function() {
        user.win = 0;
        user.played = 0;
        user.time = 0;

        console.log('Complete data:', user);
        //Si le nom et le mot de passe sont définis
        if(user.name && user.password) {
            /*
             Si le mot de passe correspond à la confirmation*/
            if(user.password == user.confirm) {
                delete user.confirm;
                req.db.collection('User').insertOne(user, function(err, doc) {
                    if (err) {
                        console.log(err);
                        fs.rf('./views/registration.html', res);
                    }
                    else {
                        console.log("1 user inserted : " + doc.ops[0].name);
                        req.message = "Welcome " + doc.ops[0].name;
                        res.redirect('/connection');
                    }
                });

            }
            else {
                fs.rf('./views/registration.html', res);
            }
        }
        else {
            fs.rf('./views/registration.html', res);
        }
    });

    next();
});

module.exports = router;