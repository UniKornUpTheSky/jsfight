const express = require('express');
const fs = require('../fs');

var router = express.Router();

router.get('/', function (req, res, next) {
    if(!req.session.user){
        res.redirect('/connection');
    }
    else {
        req.db.collection('User').find().toArray(function(err,result){
            var leaderboard = [];
            if(err) {
                console.log(err);
            }
            else{
                var ratio;
                for(var i = 0; i < result.length; i++){
                    var user = result[i];
                    if(user.played > 0){
                        ratio = user.win / user.played;
                    }
                    else{
                        ratio = 0;
                    }
                    leaderboard.push({
                        name : user.name,
                        win : user.win,
                        lost : user.played-user.win,
                        ratio : ratio
                    });
                }
                var sortedLeaderboard = sortJSON(leaderboard, 'ratio');
                for(var j = 0; j < sortedLeaderboard.length; j++){
                    var user = sortedLeaderboard[j];
                    user.rank = j+1;
                }
                req.session.leaderboard = sortedLeaderboard;
                fs.rf('./views/index.html', res);
            }
        });
    }
    next();
});

function sortJSON(data, key) {
    return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports = router;