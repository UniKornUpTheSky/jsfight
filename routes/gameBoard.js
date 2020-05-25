const express = require('express');
const fs = require('../fs');

var router = express.Router();

router.get('/', function (req, res, next) {
    if(!req.session.user){
        res.redirect('/connection');
    }
    if(!req.session.playerone || !req.session.playertwo){
        res.redirect('/');
    }
    else {
        fs.rf('./views/gameBoard.html', res);
    }
    next();
});

module.exports = router;