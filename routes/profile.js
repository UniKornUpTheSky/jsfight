const express = require('express');
const fs = require('../fs');
const parser = require('querystring');
const ObjectId = require('mongodb').ObjectID;

var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.session.user){
        res.redirect('/connection');
    }
    fs.rf('./views/profile.html', res);
    next();
}).post('/password', function(req, res, next) {

    var userEntry = {};

    var modify = false;
    var newPassword;

    req.on('data', function(chunk) {
        userEntry = parser.parse(chunk.toString());
    });

    req.on('end', function() {

        console.log('Complete data:', userEntry);
        //Si le nom et le mot de passe sont définis
        if(userEntry.old && userEntry.password) {
            /*
             Si le mot de passe correspond à la confirmation*/
            if(userEntry.password == userEntry.confirm) {

                var id = new ObjectId(req.session.user._id);

                req.db.collection('User').findOne({_id : id}, function(err, user) {
                    if (err) {
                        console.log(err);
                        fs.rf('./views/profile.html', res);
                    }
                    else {
                        if(userEntry.old == user.password){
                            newPassword = userEntry.password;
                            req.db.collection('User').update({_id : id}, {name : user.name, password : newPassword, win : user.win, played : user.played, time : user.time}, function(err, result) {
                                if(err) {
                                    console.log(err);
                                    fs.rf('./views/profile.html', res);
                                }
                                else {
                                    console.log("password updated");
                                }
                            });
                        }
                        else {
                            fs.rf('./views/profile.html', res);
                        }
                    }
                });

            }
            else {
                fs.rf('./views/profile.html', res);
            }
        }
        else {
            fs.rf('./views/profile.html', res);
        }
    });

    next();

}).post('/endgameplayerone', function(req, res, next) {

    var stats = {};
    var newPassword;

    req.on('data', function(chunk) {
        stats = parser.parse(chunk.toString());
    });

    req.on('end', function() {

        var id = new ObjectId(req.session.playerone.id);

        console.log('Complete data:', stats);

        req.db.collection('User').findOne({_id : id}, function(err, user) {
            if (err) {
                console.log(err);
                fs.rf('./views/profile.html', res);
            }
            else {
                var win = user.win;
                if(stats.win == true){
                    win = user.win+1;
                }
                req.db.collection('User').update({_id : id}, {name : user.name, password : user.password, win : win, played : stats.played, time : stats.time}, function(err, result) {
                    if(err) {
                        console.log(err);
                        fs.rf('./views/index.html', res);
                    }
                    else {
                        console.log("stats updated");
                        req.session.user.win = stats.win;
                        req.session.user.played = stats.played;
                        req.session.user.time = stats.time;
                    }
                });
            }
        });
    });

    next();

}).post('/endgameplayertwo', function(req, res, next) {

    var stats = {};
    var newPassword;

    req.on('data', function(chunk) {
        stats = parser.parse(chunk.toString());
    });

    req.on('end', function() {

        var id = new ObjectId(req.session.playerone.id);

        console.log('Complete data:', stats);

        req.db.collection('User').findOne({_id : id}, function(err, user) {
            if (err) {
                console.log(err);
                fs.rf('./views/profile.html', res);
            }
            else {
                var win = user.win;
                if(stats.win == true){
                    win = user.win+1;
                }
                req.db.collection('User').update({_id : id}, {name: user.name, password : user.password, win : win, played : stats.played, time : stats.time}, function(err, result) {
                    if(err) {
                        console.log(err);
                        fs.rf('./views/index.html', res);
                    }
                    else {
                        console.log("stats updated");
                        req.session.user.win = stats.win;
                        req.session.user.played = stats.played;
                        req.session.user.time = stats.time;
                    }
                });
            }
        });
    });

    next();

});

module.exports = router;