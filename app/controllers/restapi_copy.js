var config = require('../config')
var mongoClient = require('mongodb').MongoClient;
var bcrypt = require("bcrypt-nodejs");
var jwt     = require('jsonwebtoken');



var db;
var collection;


mongoClient.connect(config.connectionString, function (err, database) {
    if (err)
        console.log(err);
    else {
        db = database;
    }
});

exports.create = function (req, res) {

    db.collection('restapis').find({}, {
        limit: 1,
        fields: {
            sid: 1
        },
        sort: {
            sid: -1
        }
    }).toArray(function (err, docs) {
        var _next = docs.length ? docs[0].sid + 1 : 1;
        // doc.sid = _next;
        req.body.sid = _next;
        db.collection('restapis').insert(req.body, function (err, result) {
            if ( err ) {
                res.send(err);
                return;
            }
            res.send();
        });
    });

};

exports.list = function (req, res) {
    db.collection('restapis').find({}).toArray(function(err, docs) {
        if ( err ) {
            res.send(err);
            return;
        }
        res.send(docs);
    });
};

exports.edit = function (req, res) {
    db.collection('restapis').update({sid: Number(req.params.sid)}, req.body, function(err, docs) {
        if ( err ) {
            res.send(err);
            return;
        }

        res.send();
    });
};

exports.remove = function (req, res) {
    console.log(req.params.sid);
    db.collection('restapis').remove({sid: Number(req.params.sid)},function(err, docs) {
        if ( err ) {
            res.send(err);
            return;
        }
        console.log("delete success");
        res.send();
    });
};
