const express = require('express');

const mongoServer = require('mongodb');

const mongo = {
    server: mongoServer,
    client: mongoServer.MongoClient,
    url: 'mongodb://localhost:27017',
    db: {},
    objectId: mongoServer.ObjectId
};

module.exports = {
    connection : function() {
        mongo.client.connect(mongo.url, {useNewUrlParser : true} , function(err, client) {
            if(err) {
                mongo.db.JSFight = false;
                console.log('error while connecting to the database');
            }
            else {
                mongo.db.JSFight = client.db('jsfight');
                console.log('connection achieved');
            }
        });
    },

    getDB : function() {
        return mongo.db.JSFight;
    }
};

/*mongo.db.jsFight.collection('User').find().toArray(function(err,result) {
 console.log(result);  //RETURN ALL
 });

 mongo.db.jsFight.collection('User').findOne({_id: mongo.objectId('INSERT AN OBJECT ID HERE')}, function(err, result) {
 console.log(result); // RETURN ONE
 });*/