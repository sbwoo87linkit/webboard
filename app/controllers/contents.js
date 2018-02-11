var config = require('../config');
var mongoClient = require('mongodb').MongoClient;
//var bcrypt = require("bcrypt-nodejs");
var jwt = require('express-jwt');
var co = require('co');

// import series from 'async/series';
// var series
var async = require('async');

var model = require('../../models/model');
var ObjectID = require('mongodb').ObjectID;

var db;
var collection;
mongoClient.connect(config.connectionString, function (err, database) {
    if (err)
        console.log(err);
    else {
        db = database;
        console.log("db connected...");
    }
})



exports.list = function (req, res) {


    async.waterfall([
        function (callback) {
            db.collection('board').count({
                $or: [{
                    'articleType': req.query.articleType
                }, {
                    share: true
                }]
            }, function (err, count) {
                callback(null, count);
            });

        }
    ], function (err, result) {
        if (req.query.articleType === 'notice') {
            db.collection('board').find({
                $or: [{
                    'articleType': req.query.articleType
                }, {
                    share: true
                }]
            })
                .sort({
                    date: -1
                }).skip(req.query.rows * (req.query.page - 1)).limit(Number(req.query.rows)).toArray(function (err, docs) {
                    res.send({ count: result, list: docs });
                })
        } else {
            db.collection('board').find({
                $or: [{
                    'articleType': req.query.articleType
                }]
            })
                .sort({
                    date: -1
                }).skip(req.query.rows * (req.query.page - 1)).limit(Number(req.query.rows)).toArray(function (err, docs) {
                    res.send({count:result, list: docs});
                })
        }
    });

}

exports.view = function (req, res) {
    db.collection('board').findOne({ _id: ObjectID(req.params.sid) }, function(err, doc) {        
        if (!err) {
            res.json(doc);
        }
        res.status(500).end(err);
    });
}

exports.update = function (req, res) {
    // co(function* () {
    //         var args = {
    //             sid: Number(req.params.sid)
    //         };
    //         delete(req.body._id);
    //         // console.log("update:", Number(req.params.sid), req.body);
    //         var result = yield model.updateDoc(args, req.body, db.collection('board'));
    //         if (result.n === 1)
    //             res.status(200).send(result);
    //         else res.status(400).send(result);
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //         console.log(err.stack);
    //         res.status(400).end();
    //     });


    // console.log(req.params.sid, req.body);
    // res.send('OK');


    db.collection('board').update({ _id: ObjectID(req.params.sid) }, req.body, function (err, doc) {
        if (!err) {
            res.json(doc);
        }
        console.log(err)
        res.status(500).end();
    });
};
exports.create = function (req, res) {
    db.collection('board').insert(req.body, function (err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.send();
    });
    // //console.log(req);
    // co(function* () {
    //     var result = yield model.insertDoc(req.body, db.collection('board'), 'boardid');
    //     res.status(200).send()
    // }).catch(function (err) {
    //     console.log(err);
    //     console.log(err.stack);
    //     res.status(500).end();
    // });

}

exports.delete = function (req, res) {
    // var args = {sid : Number(req.params.sid)};
    // co(function* () {
    //         var args = {
    //             sid: Number(req.params.sid)
    //         };
    //         var result = yield model.deleteDoc(args, db.collection('board'));
    //         if (result.n === 1)
    //             res.status(200).send(result);
    //         else res.status(400).send(result);
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //         console.log(err.stack);
    //         res.status(400).end();
    //     });

    db.collection('board').remove({ _id: ObjectID(req.params.sid) }, function (err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.send();
    });

}
