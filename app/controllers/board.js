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



    // async.series([
    //         function (callback) {
    //             // do some stuff ...
    //             db.collection('news').count({
    //                 $or: [{
    //                     'articleType': req.query.articleType
    //                 }, {
    //                     share: true
    //                 }]
    //             }, function(err, count){
    //                 console.log('series one');
    //                 callback(null, count);

    //             });

    //         },
    //         function (callback) {
    //             console.log('series two');
    //             // do some more stuff ...
    //             callback(null, 'two');
    //         }
    //     ],
    //     // optional callback
    //     function (err, results) {
    //         // results is now equal to ['one', 'two']
    //         console.log('results', results)

    //         if (req.query.articleType === 'notice') {
    //             db.collection('news').find({
    //                     $or: [{
    //                         'articleType': req.query.articleType
    //                     }, {
    //                         share: true
    //                     }]
    //                 })
    //                 .sort({
    //                     date: -1
    //                 }).skip(req.query.rows * (req.query.page - 1)).limit(Number(req.query.rows)).toArray(function (err, docs) {
    //                     res.send(docs);
    //                 })
    //         } else {
    //             db.collection('news').find({
    //                     $or: [{
    //                         'articleType': req.query.articleType
    //                     }]
    //                 })
    //                 .sort({
    //                     date: -1
    //                 }).skip(req.query.rows * (req.query.page - 1)).limit(Number(req.query.rows)).toArray(function (err, docs) {
    //                     res.send(docs);
    //                 })
    //         }


    //     });

    async.waterfall([
        function (callback) {
            db.collection('news').count({
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
            db.collection('news').find({
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
            db.collection('news').find({
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
    db.collection('news').findOne({ _id: ObjectID(req.params.sid) }, function(err, doc) {        
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
    //         var result = yield model.updateDoc(args, req.body, db.collection('news'));
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


    db.collection('news').update({ _id: ObjectID(req.params.sid) }, req.body, function (err, doc) {
        if (!err) {
            res.json(doc);
        }
        console.log(err)
        res.status(500).end();
    });
};
exports.create = function (req, res) {
    db.collection('news').insert(req.body, function (err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.send();
    });
    // //console.log(req);
    // co(function* () {
    //     var result = yield model.insertDoc(req.body, db.collection('news'), 'newsid');
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
    //         var result = yield model.deleteDoc(args, db.collection('news'));
    //         if (result.n === 1)
    //             res.status(200).send(result);
    //         else res.status(400).send(result);
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //         console.log(err.stack);
    //         res.status(400).end();
    //     });

    db.collection('news').remove({ _id: ObjectID(req.params.sid) }, function (err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.send();
    });

}

// db.getCollection('votes').insertMany( [
//     {issue_id:1020, age:'21~', gender:'male', created: new Date(), 'choice':'yes'},
//     {issue_id:1020, age:'21~', gender:'male', created: new Date(), 'choice':'yes'},
//     {issue_id:1020, age:'21~', gender:'male', created: new Date(), 'choice':'yes'}
// ] );