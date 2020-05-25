const express = require('express');
const fs = require('../fs');

var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.session.user){
        res.redirect('/connection');
    }
    else {
        fs.rf('./views/lobby.html', res)
    }
    next();
});

module.exports = router;