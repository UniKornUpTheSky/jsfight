const express = require('express');
const parser = require('querystring');

var router = express.Router();

router.get('/session', function(req, res, next) {
    if(req.session){
        res.json(req.session);
    }
    else {
        res.json({});
    }
    next();
}).post('/setplayerone', function(req, res, next) {

    var playerOne = {};

    if(!req.session.playerone){

        req.on('data', function(chunk) {
            playerOne = parser.parse(chunk.toString());
        });

        req.on('end', function() {

            console.log('Complete data:', playerOne);

            if(req.session){
                req.session.playerone = playerOne;
                res.json(playerOne);
            }
        });
    }
    next();
}).post('/setplayertwo', function(req, res, next) {

    var playerTwo = {};

    if(!req.session.playertwo) {

        req.on('data', function (chunk) {
            playerTwo = parser.parse(chunk.toString());
        });

        req.on('end', function () {

            console.log('Complete data:', playerTwo);

            if (req.session) {
                req.session.playertwo = playerTwo;
                res.json(playerTwo);
            }
        });
    }
    next();
});
module.exports = router;