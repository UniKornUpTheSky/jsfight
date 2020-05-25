const express = require('express');
const fs = require('../fs');

var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.session.user){
        res.redirect('/connection');
    }
    else {
        delete req.session.user;

        fs.rf('./views/connection.html', res);
    }
    next();
});

module.exports = router;